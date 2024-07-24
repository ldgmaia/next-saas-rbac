import { api } from './api-client'

interface CreateProjectRequest {
  name: string
  domain: string | null
  shouldAttachUsersByDomain: boolean
}

type CreateProjectResponse = void

export async function createProject({
  name,
  domain,
  shouldAttachUsersByDomain,
}: CreateProjectRequest): Promise<CreateProjectResponse> {
  await api.post('projects', {
    json: {
      name,
      domain,
      shouldAttachUsersByDomain,
    },
  })
}
