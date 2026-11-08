import LessonEditorPage from "../../components/courses/LessonEditorPage"
import { fetchInstitutionModule, courseAi, courseStructure } from "../../lib/dictionary"

const institutionStructureApi = courseStructure("/api/institutions/modules")
const institutionAiApi = courseAi("/api/institutions/modules")

export default function InstitutionModuleLesson() {
  return (
    <LessonEditorPage
      courses={{ get: fetchInstitutionModule }}
      structure={institutionStructureApi}
      ai={institutionAiApi}
      basePath="/institution/modules"
      backLabel="Course modules"
    />
  )
}
