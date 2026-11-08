import hashlib
import os

import chromadb


class RAG:
    """Chroma-backed retrieval: one collection per course, content-addressed
    chunks, cosine similarity search over real embeddings."""

    def __init__(self, path):
        os.makedirs(path, exist_ok=True)
        self.client = chromadb.PersistentClient(path=path)
        self.signatures = {}

    def _collection(self, course_id):
        return self.client.get_or_create_collection(
            name=f'course-{course_id}', metadata={'hnsw:space': 'cosine'}
        )

    @staticmethod
    def _chunk(text, words_per_chunk=120):
        words = str(text or '').split()
        return [
            ' '.join(words[i : i + words_per_chunk])
            for i in range(0, len(words), words_per_chunk)
            if words[i : i + words_per_chunk]
        ]

    def _documents(self, sources, description='', lessons=None):
        docs = []
        for source in sources or []:
            title = str(source.get('title') or 'Source')[:120]
            for index, chunk in enumerate(self._chunk(source.get('text', ''))):
                digest = hashlib.sha1(f'{title}|{chunk}'.encode('utf-8')).hexdigest()[:20]
                docs.append((digest, chunk, {'title': title, 'kind': 'source', 'index': index}))
        if description:
            docs.append(
                (hashlib.sha1(description.encode('utf-8')).hexdigest()[:20], description, {
                    'title': 'Course description', 'kind': 'description', 'index': 0,
                })
            )
        for lesson in lessons or []:
            title = str(lesson.get('title') or 'Lesson')[:120]
            text = f"{title}. {lesson.get('content', '')}".strip()
            if not text:
                continue
            for index, chunk in enumerate(self._chunk(text)):
                digest = hashlib.sha1(f'{title}|{chunk}'.encode('utf-8')).hexdigest()[:20]
                docs.append((digest, chunk, {'title': f'Lesson: {title}', 'kind': 'lesson', 'index': index}))
        return docs

    def ensure_indexed(self, course_id, sources, description='', lessons=None):
        """Upsert the course documents into its Chroma collection. Skips the
        write when the content signature is unchanged."""
        docs = self._documents(sources, description, lessons)
        signature = hashlib.sha1('|'.join(d[0] for d in docs).encode('utf-8')).hexdigest()
        if self.signatures.get(course_id) == signature:
            return len(docs)

        collection = self._collection(course_id)
        if collection.count() > 0:
            existing = collection.get(limit=2000)
            if existing.get('ids'):
                collection.delete(ids=existing['ids'])
        if docs:
            collection.add(
                ids=[d[0] for d in docs],
                documents=[d[1] for d in docs],
                metadatas=[d[2] for d in docs],
            )
        self.signatures[course_id] = signature
        return len(docs)

    def retrieve(self, course_id, query, k=6):
        collection = self._collection(course_id)
        if collection.count() == 0:
            return []
        result = collection.query(query_texts=[str(query or 'course overview')], n_results=min(k, collection.count()))
        documents = (result.get('documents') or [[]])[0]
        metadatas = (result.get('metadatas') or [[]])[0]
        return [
            {'text': text, 'title': (meta or {}).get('title', 'Source')}
            for text, meta in zip(documents, metadatas)
        ]

    def sample(self, course_id, limit=40):
        collection = self._collection(course_id)
        if collection.count() == 0:
            return []
        result = collection.get(limit=min(limit, collection.count()))
        documents = result.get('documents') or []
        metadatas = result.get('metadatas') or []
        return [
            {'text': text, 'title': (meta or {}).get('title', 'Source')}
            for text, meta in zip(documents, metadatas)
        ]

    def count(self, course_id):
        return self._collection(course_id).count()

    @staticmethod
    def context(chunks, max_chars=7000):
        block = '\n\n'.join(f"[{i + 1}] ({c['title']})\n{c['text']}" for i, c in enumerate(chunks))
        return block[:max_chars]
