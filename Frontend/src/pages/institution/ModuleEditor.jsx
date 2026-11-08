import CourseEditorPage from "../../components/courses/CourseEditorPage"
import {
  fetchInstitutionModules,
  fetchInstitutionModule,
  createCourseModule,
  updateCourseModule,
  deleteCourseModule,
  courseAi,
  courseStructure,
  institutionExtractFile,
} from "../../lib/dictionary"

const institutionCoursesApi = {
  list: fetchInstitutionModules,
  get: fetchInstitutionModule,
  create: createCourseModule,
  update: updateCourseModule,
  remove: deleteCourseModule,
}

const institutionAiApi = courseAi("/api/institutions/modules")
const institutionStructureApi = courseStructure("/api/institutions/modules")

export default function InstitutionModuleEditor() {
  return (
    <CourseEditorPage
      courses={institutionCoursesApi}
      ai={institutionAiApi}
      extract={institutionExtractFile}
      structure={institutionStructureApi}
      basePath="/institution/modules"
      backLabel="Course modules"
    />
  )
}
