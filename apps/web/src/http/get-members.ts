import type { Role } from '@saas/auth'

import { api } from './api-client'

interface GetMembersResponse {
  members: {
    name: string | null
    id: string
    avatarUrl: string | null
    role: Role
    userId: string
    email: string
  }[]
}

export async function getMembers(organizationSlug: string) {
  const result = await api
    .get(`organizations/${organizationSlug}/members`, {
      next: {
        tags: [`${organizationSlug}/members`],
      },
    })
    .json<GetMembersResponse>()

  return result
}
