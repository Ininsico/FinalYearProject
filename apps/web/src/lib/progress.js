import { api } from "./auth"

/** The signed-in student's own progress, with per-course percentages and scores. */
export const fetchMyProgress = () => api("/api/students/progress")

/** Mark a lesson complete or undo it. */
export const setLessonComplete = (courseId, lessonId, completed) =>
  api("/api/students/progress/lesson", {
    method: "POST",
    body: JSON.stringify({ courseId, lessonId, completed }),
  })

/** Record one quiz attempt. */
export const recordQuizAttempt = (courseId, lessonId, score, total) =>
  api("/api/students/progress/quiz", {
    method: "POST",
    body: JSON.stringify({ courseId, lessonId, score, total }),
  })
