import SectionEditorPage from "../../components/courses/SectionEditorPage"
import { fetchAdminCourse, courseStructure } from "../../lib/dictionary"

const adminStructureApi = courseStructure("/api/admin/courses")

export default function AdminCourseSection() {
  return (
    <SectionEditorPage
      courses={{ get: fetchAdminCourse }}
      structure={adminStructureApi}
      basePath="/admin/courses"
      backLabel="Courses"
    />
  )
}
