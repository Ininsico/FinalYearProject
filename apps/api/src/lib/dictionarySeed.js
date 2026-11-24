import Course from '../models/Course.js'
import Institution from '../models/Institution.js'

export const STARTER_COURSES = [
  {
    title: 'Calculus Refresher',
    subject: 'Mathematics',
    summary: 'Limits, derivatives and integrals rebuilt from first principles, with weekly problem sets.',
    level: 'beginner',
    topics: ['Limits', 'Derivatives', 'Integration'],
    lessons: 12,
    premium: false,
  },
  {
    title: 'Linear Algebra for Machine Learning',
    subject: 'Mathematics',
    summary: 'Vectors, matrices, eigenvalues and SVD — the toolkit behind every model.',
    level: 'intermediate',
    topics: ['Matrices', 'Eigenvalues', 'SVD'],
    lessons: 10,
    premium: false,
  },
  {
    title: 'Kinematics & Dynamics',
    subject: 'Physics',
    summary: "Motion in one and two dimensions, Newton's laws and energy methods.",
    level: 'beginner',
    topics: ["Newton's Laws", 'Energy', 'Momentum'],
    lessons: 9,
    premium: false,
    sponsored: true,
  },
  {
    title: 'Python Fundamentals',
    subject: 'Computer Science',
    summary: 'From variables to functions and files — the first course every student takes.',
    level: 'beginner',
    topics: ['Syntax', 'Functions', 'Files'],
    lessons: 14,
    premium: false,
  },
  {
    title: 'Data Structures I',
    subject: 'Computer Science',
    summary: 'Lists, stacks, queues, trees and the complexity trade-offs between them.',
    level: 'intermediate',
    topics: ['Arrays', 'Trees', 'Complexity'],
    lessons: 11,
    premium: true,
    sponsored: true,
  },
  {
    title: 'Entrepreneurship Basics',
    subject: 'Business',
    summary: 'Idea validation, lean canvases and the first pitch.',
    level: 'beginner',
    topics: ['Validation', 'Lean Canvas', 'Pitching'],
    lessons: 6,
    premium: false,
  },
  {
    title: 'Design Systems in Practice',
    subject: 'Design',
    summary: 'Tokens, components and documentation that keep a product coherent.',
    level: 'advanced',
    topics: ['Tokens', 'Components', 'Accessibility'],
    lessons: 8,
    premium: true,
  },
]

/** A Coursera-style starter curriculum derived from each course's topics. */
export function starterCurriculum(course) {
  const topics = course.topics ?? []
  return [
    {
      title: 'Foundations',
      summary: `The core ideas behind ${course.subject.toLowerCase()}.`,
      lessons: [
        {
          title: `Welcome to ${course.title}`,
          type: 'video',
          durationMinutes: 8,
          content: `What you will learn and how the course is structured. Topics: ${topics.join(', ')}.`,
        },
        {
          title: `${topics[0] ?? 'Key concepts'} — deep dive`,
          type: 'reading',
          durationMinutes: 15,
          content: `A worked explanation of ${topics[0] ?? 'the fundamentals'}.`,
        },
      ],
    },
    {
      title: 'Practice & assessment',
      summary: 'Apply the concepts and prove you own them.',
      lessons: [
        {
          title: 'Hands-on exercise',
          type: 'exercise',
          durationMinutes: 30,
          content: 'Complete the guided task and compare against the sample solution.',
        },
        {
          title: 'Module quiz',
          type: 'quiz',
          durationMinutes: 15,
          content: 'A short assessment covering the whole module.',
        },
      ],
    },
  ]
}

const outcomesFor = (course) => course.topics.map((topic) => `Explain and apply ${topic.toLowerCase()}`)

/**
 * Seed starter courses so the public catalogue is never empty on a fresh
 * install. Idempotent per title (upsert with setOnInsert), so overlapping
 * boots can never duplicate the catalogue. Alternates ownership between the
 * demo institute and the platform itself.
 */
export async function ensureDictionarySeed() {
  const demo = await Institution.findOne({ name: 'Instant Demo Institute' })
  const now = new Date().toISOString()
  let seeded = 0

  for (const [index, course] of STARTER_COURSES.entries()) {
    const result = await Course.updateOne(
      { title: course.title },
      {
        $setOnInsert: {
          ...course,
          description: `${course.summary} The course runs through ${course.topics.join(', ')} with short lessons, hands-on practice and an assessment at the end.`,
          outcomes: outcomesFor(course),
          curriculum: starterCurriculum(course),
          institutionId: index % 2 === 0 ? demo?._id ?? null : null,
          status: 'published',
          publishedAt: now,
        },
      },
      { upsert: true }
    )
    if (result.upsertedCount) seeded += 1
  }

  return seeded || null
}
