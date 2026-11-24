import os

from dotenv import load_dotenv
from flask import Flask, jsonify, request

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, '.env'))

from guard import Guard, GuardError  # noqa: E402
from llm import LLM, LLMError  # noqa: E402
from rag import RAG  # noqa: E402
from graph import extract_graph  # noqa: E402
from extract import extract, ExtractError  # noqa: E402

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 21 * 1024 * 1024

guard = Guard()
llm = LLM(guard)
rag = RAG(os.path.join(BASE_DIR, 'data', 'chroma'))

SERVICE_KEY = os.environ.get('AI_SERVICE_KEY', '').strip()

SYSTEM_AUTHOR = (
    'You are Fablet, an academic course author. You write clear, accurate, '
    'well-structured educational content grounded strictly in the provided course material.'
)


def error(message, status):
    return jsonify({'error': message}), status


@app.before_request
def check_service_key():
    if request.path in ('/health', '/status'):
        return None
    if SERVICE_KEY and request.headers.get('X-AI-Key') != SERVICE_KEY:
        return error('Unauthorized', 401)
    return None


@app.get('/health')
def health():
    return jsonify(
        {
            'ok': True,
            'model': llm.primary_model,
            'usage': guard.snapshot(),
        }
    )


@app.get('/status')
def status():
    return jsonify({'usage': guard.snapshot()})


@app.post('/index')
def index_course():
    try:
        body = request.get_json(force=True) or {}
        course_id = str(body.get('courseId') or '').strip()
        if not course_id:
            return error('courseId is required', 400)
        count = rag.ensure_indexed(
            course_id,
            body.get('sources') or [],
            body.get('description') or '',
            body.get('lessons') or [],
        )
        return jsonify({'indexed': count, 'vectors': rag.count(course_id)})
    except GuardError as exc:
        return error(str(exc), exc.status)


@app.post('/generate')
def generate():
    try:
        body = request.get_json(force=True) or {}
        course_id = str(body.get('courseId') or '').strip()
        if not course_id:
            return error('courseId is required', 400)

        brief = body.get('brief') or {}
        sources = body.get('sources') or []
        description = body.get('description') or ''
        lessons = body.get('lessons') or []
        mode = body.get('mode') or 'lesson'

        rag.ensure_indexed(course_id, sources, description, lessons)

        title = str(brief.get('title') or '')
        subject = str(brief.get('subject') or '')
        level = str(brief.get('level') or '')
        topics = ', '.join(brief.get('topics') or [])

        if mode == 'describe':
            chunks = rag.retrieve(course_id, f'{title} {subject} overview')
            context = rag.context(chunks, 5000)
            user = '\n\n'.join(
                part
                for part in [
                    f'Title: {title}\nSubject: {subject}\nLevel: {level}\nTopics: {topics}',
                    f'Course material excerpts:\n{context}' if context else '',
                    'Write a course description and 4-6 measurable learning outcomes.',
                    'Respond with JSON only, shaped exactly like:',
                    '{ "description": "3-5 sentence paragraph", "outcomes": ["outcome", "outcome"] }',
                ]
                if part
            )
            parsed = llm.chat_json(SYSTEM_AUTHOR, user, temperature=0.3)
            outcomes = parsed.get('outcomes') if isinstance(parsed, dict) else []
            return jsonify(
                {
                    'description': str(parsed.get('description', '')).strip(),
                    'outcomes': [str(o).strip() for o in (outcomes or []) if str(o).strip()][:6],
                }
            )

        if mode == 'quiz':
            quiz_query = str(body.get('query') or f'{title} {brief.get("lessonTitle", "")}')
            chunks = rag.retrieve(course_id, quiz_query)
            context = rag.context(chunks, 5000)
            requested = [
                q for q in (body.get('types') or ['mcq', 'truefalse', 'fillblank', 'match'])
                if q in ('mcq', 'truefalse', 'fillblank', 'match')
            ] or ['mcq']
            count = min(max(int(body.get('count', 5) or 5), 3), 10)
            user = '\n\n'.join(
                part
                for part in [
                    f'Title: {title}\nSubject: {subject}\nLevel: {level}',
                    f"Section: {brief.get('sectionTitle', '')}" if brief.get('sectionTitle') else '',
                    f"Lesson: {brief.get('lessonTitle', '')}",
                    f'Retrieved course material:\n{context}' if context else '',
                    f'Write {count} assessment questions using only these types: {", ".join(requested)}.',
                    'Respond with JSON only, shaped exactly like:',
                    '{ "questions": [ ... ] } where each question is exactly one of:',
                    '{"type":"mcq","prompt":"...","options":["...","...","...","..."],"answerIndex":0}',
                    '{"type":"truefalse","prompt":"...","options":["True","False"],"answerIndex":0}',
                    '{"type":"fillblank","prompt":"sentence with ___ for the blank","answer":"missing words"}',
                    '{"type":"match","prompt":"...","pairs":[{"left":"...","right":"..."}]}',
                ]
                if part
            )
            parsed = llm.chat_json(SYSTEM_AUTHOR, user, temperature=0.3, max_tokens=2000)
            raw_questions = parsed.get('questions') if isinstance(parsed, dict) else []
            questions = []
            for question in raw_questions or []:
                qtype = str(question.get('type', '')).strip().lower()
                if qtype not in requested:
                    continue
                prompt = str(question.get('prompt', '')).strip()[:1000]
                if not prompt:
                    continue
                item = {'type': qtype, 'prompt': prompt}
                if qtype == 'mcq':
                    options = [
                        str(option).strip()[:300]
                        for option in (question.get('options') or [])
                        if str(option).strip()
                    ][:8]
                    if len(options) < 2:
                        continue
                    try:
                        answer_index = int(question.get('answerIndex', 0) or 0)
                    except (TypeError, ValueError):
                        answer_index = 0
                    item['options'] = options
                    item['answerIndex'] = min(max(answer_index, 0), len(options) - 1)
                elif qtype == 'truefalse':
                    try:
                        answer_index = int(question.get('answerIndex', 0) or 0)
                    except (TypeError, ValueError):
                        answer_index = 0
                    item['options'] = ['True', 'False']
                    item['answerIndex'] = 1 if answer_index == 1 else 0
                elif qtype == 'fillblank':
                    answer = str(question.get('answer', '')).strip()[:300]
                    if not answer:
                        continue
                    item['answer'] = answer
                else:  # match
                    pairs = [
                        {
                            'left': str(pair.get('left', '')).strip()[:200],
                            'right': str(pair.get('right', '')).strip()[:200],
                        }
                        for pair in (question.get('pairs') or [])
                        if pair.get('left') and pair.get('right')
                    ][:10]
                    if len(pairs) < 2:
                        continue
                    item['pairs'] = pairs
                questions.append(item)

            if not questions:
                return error('The AI could not build quiz questions — try again', 502)
            return jsonify({'questions': questions[:count]})

        query = str(body.get('query') or f'{title} {brief.get("sectionTitle", "")} {brief.get("lessonTitle", "")}')
        chunks = rag.retrieve(course_id, query)
        context = rag.context(chunks)
        lesson_type = body.get('lessonType') or 'reading'
        instruction = str(body.get('instruction') or '')

        user = '\n\n'.join(
            part
            for part in [
                f'Title: {title}\nSubject: {subject}\nLevel: {level}',
                f"Section: {brief.get('sectionTitle', '')}" if brief.get('sectionTitle') else '',
                f"Lesson: {brief.get('lessonTitle', '')} (type: {lesson_type})" if brief.get('lessonTitle') else '',
                f'Retrieved course material:\n{context}' if context else '',
                f'Extra instruction: {instruction}' if instruction else '',
                'Write the assessment: the task, what will be graded and how a student should prepare. Plain text, 150-250 words.'
                if lesson_type in ('quiz', 'assignment')
                else 'Write the lesson content: a short intro, the key points with concrete examples, and a takeaway. Plain text with short paragraphs, 200-350 words.',
            ]
            if part
        )
        content = llm.chat(SYSTEM_AUTHOR, user)
        return jsonify({'content': content})
    except GuardError as exc:
        return error(str(exc), exc.status)
    except LLMError as exc:
        return error(str(exc), exc.status)


@app.post('/graph')
def knowledge_graph():
    try:
        body = request.get_json(force=True) or {}
        course_id = str(body.get('courseId') or '').strip()
        if not course_id:
            return error('courseId is required', 400)

        brief = body.get('brief') or {}
        rag.ensure_indexed(
            course_id,
            body.get('sources') or [],
            body.get('description') or '',
            body.get('lessons') or [],
        )
        chunks = rag.sample(course_id, 40)
        if not chunks:
            return error('Add knowledge sources to the course first', 400)
        context = RAG.context(chunks, 7000)
        graph = extract_graph(llm, brief, context)
        return jsonify({'knowledgeGraph': graph})
    except GuardError as exc:
        return error(str(exc), exc.status)
    except LLMError as exc:
        return error(str(exc), exc.status)


@app.post('/extract')
def extract_upload():
    """Read a PDF/image/DOCX/text upload and return its extracted text."""
    file = request.files.get('file')
    if not file or not file.filename:
        return error('Attach a file in the "file" field', 400)

    data = file.read()
    if not data:
        return error('The uploaded file is empty', 400)

    limit_mb = int(os.environ.get('AI_MAX_UPLOAD_MB', '20'))
    if len(data) > limit_mb * 1024 * 1024:
        return error(f'File is larger than {limit_mb}MB', 413)

    try:
        return jsonify(extract(file.filename, data))
    except ExtractError as exc:
        return error(str(exc), exc.status)
    except Exception as exc:  # noqa: BLE001
        message = str(exc)
        if 'tesseract' in message.lower():
            return error('OCR engine (Tesseract) is not available on this machine', 503)
        print('[extract] failed:', message, flush=True)
        return error('Could not read that file', 400)


if __name__ == '__main__':
    port = int(os.environ.get('AI_PORT', '8001'))
    print(f'[ai] Fablet AI service on http://127.0.0.1:{port} (model: {llm.primary_model})', flush=True)
    app.run(host='127.0.0.1', port=port, threaded=True)
