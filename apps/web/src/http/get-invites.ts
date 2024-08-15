import type { Role } from '@saas/auth'

import { api } from './api-client'

interface GetInvitesResponse {
  invites: {
    id: string
    email: string
    role: Role
    createdAt: string
    author: {
      id: string
      name: string | null
    } | null
  }[]
}

export async function getInvites(organizationSlug: string) {
  const result = await api
    .get(`organizations/${organizationSlug}/invites`, {
      next: {
        tags: [`${organizationSlug}/invites`],
      },
    })
    .json<GetInvitesResponse>()

  return result
}