import LessonEditorPage from "../../components/courses/LessonEditorPage"
import { fetchAdminCourse, courseAi, courseStructure } from "../../lib/dictionary"

const adminStructureApi = courseStructure("/api/admin/courses")
const adminAiApi = courseAi("/api/admin/courses")

export default function AdminCourseLesson() {
  return (
    <LessonEditorPage
      courses={{ get: fetchAdminCourse }}
      structure={adminStructureApi}
      ai={adminAiApi}
      basePath="/admin/courses"
      backLabel="Courses"
    />
  )
}
