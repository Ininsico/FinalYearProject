import CourseEditorPage from "../../components/courses/CourseEditorPage"
import {
  fetchAdminCourses,
  fetchAdminCourse,
  createAdminCourse,
  updateAdminCourse,
  deleteAdminCourse,
  courseAi,
  courseStructure,
  adminExtractFile,
} from "../../lib/dictionary"

const adminCoursesApi = {
  list: fetchAdminCourses,
  get: fetchAdminCourse,
  create: createAdminCourse,
  update: updateAdminCourse,
  remove: deleteAdminCourse,
}

const adminAiApi = courseAi("/api/admin/courses")
const adminStructureApi = courseStructure("/api/admin/courses")

export default function AdminCourseEditor() {
  return (
    <CourseEditorPage
      courses={adminCoursesApi}
      ai={adminAiApi}
      extract={adminExtractFile}
      structure={adminStructureApi}
      basePath="/admin/courses"
      backLabel="Courses"
    />
  )
}
