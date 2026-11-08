import SectionEditorPage from "../../components/courses/SectionEditorPage"
import { fetchInstitutionModule, courseStructure } from "../../lib/dictionary"

const institutionStructureApi = courseStructure("/api/institutions/modules")

export default function InstitutionModuleSection() {
  return (
    <SectionEditorPage
      courses={{ get: fetchInstitutionModule }}
      structure={institutionStructureApi}
      basePath="/institution/modules"
      backLabel="Course modules"
    />
  )
}
