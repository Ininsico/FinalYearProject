import { callAi } from './aiService.js'

/**
 * Course AI operations. All work — embedding, retrieval, generation — happens
 * inside the Fablet AI service (Flask + ChromaDB). The backend only builds the
 * course snapshot and persists results.
 */

function briefFor(course) {
  return {
    title: course.title,
    subject: course.subject,
    level: course.level,
    topics: course.topics ?? [],
  }
}

function sourcesFor(course) {
  return (course.knowledge ?? []).map((source) => ({
    title: source.title || 'Source',
    text: source.text || '',
  }))
}

function lessonsFor(course) {
  const lessons = []
  for (const section of course.curriculum ?? []) {
    for (const lesson of section.lessons ?? []) {
      lessons.push({
        title: lesson.title,
        content: lesson.content?.trim() || `${lesson.title} (${lesson.type} lesson)`,
      })
    }
  }
  return lessons
}

function payloadFor(course) {
  return {
    courseId: course._id.toString(),
    brief: briefFor(course),
    sources: sourcesFor(course),
    description: course.description || '',
    lessons: lessonsFor(course),
  }
}

/** Generate a course description + learning outcomes (not saved; editor applies). */
export async function generateDescription(course) {
  const data = await callAi('/generate', { ...payloadFor(course), mode: 'describe' })
  return {
    description: String(data.description ?? '').trim(),
    outcomes: Array.isArray(data.outcomes) ? data.outcomes.slice(0, 6) : [],
  }
}

/** Generate the text content for one lesson, grounded in the vector store. */
export async function generateLessonContent(course, sectionIndex, lessonIndex, instruction = '') {
  const section = course.curriculum?.[sectionIndex]
  const lesson = section?.lessons?.[lessonIndex]
  if (!lesson) {
    const error = new Error('Lesson not found')
    error.status = 404
    throw error
  }

  const brief = {
    ...briefFor(course),
    sectionTitle: section.title,
    lessonTitle: lesson.title,
  }

  const data = await callAi('/generate', {
    ...payloadFor(course),
    brief,
    mode: 'lesson',
    lessonType: lesson.type,
    instruction,
    query: `${course.title} ${section.title} ${lesson.title} ${instruction}`,
  })

  return { content: String(data.content ?? '').trim() }
}

/** Generate structured quiz questions for one lesson via the AI service. */
export async function generateQuiz(course, sectionIndex, lessonIndex, types = null) {
  const section = course.curriculum?.[sectionIndex]
  const lesson = section?.lessons?.[lessonIndex]
  if (!lesson) {
    const error = new Error('Lesson not found')
    error.status = 404
    throw error
  }

  const data = await callAi('/generate', {
    ...payloadFor(course),
    brief: {
      ...briefFor(course),
      sectionTitle: section.title,
      lessonTitle: lesson.title,
    },
    mode: 'quiz',
    lessonType: 'quiz',
    types: Array.isArray(types) && types.length ? types : undefined,
    query: `${course.title} ${section.title} ${lesson.title} quiz questions`,
  })

  const questions = Array.isArray(data.questions) ? data.questions : []
  if (!questions.length) {
    const error = new Error('The AI could not build quiz questions — add richer sources and retry')
    error.status = 502
    throw error
  }
  return { quiz: questions }
}

/** Extract a concept graph via the AI service and persist it on the course. */
export async function generateKnowledgeGraph(course) {
  const data = await callAi('/graph', payloadFor(course))
  const graph = data.knowledgeGraph ?? { nodes: [], edges: [] }

  if (!graph.nodes?.length) {
    const error = new Error('The AI returned an empty graph — add richer knowledge sources and retry')
    error.status = 502
    throw error
  }

  const stored = { ...graph, generatedAt: new Date().toISOString() }
  course.set('knowledgeGraph', stored)
  await course.save()
  return stored
}
