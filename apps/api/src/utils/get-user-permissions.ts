import { defineAbilityFor, userSchema, type Role } from '@saas/auth'

export function getUserPermissions(userId: string, role: Role) {
  const authuser = userSchema.parse({
    id: userId,
    role: role,
  })

  return defineAbilityFor(authuser)
}
