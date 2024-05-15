import {
  AbilityBuilder,
  CreateAbility,
  MongoAbility,
  createMongoAbility,
} from '@casl/ability'
import { z } from 'zod'
import { User } from './models/user.js'
import { permissions } from './permissions.js'
import { billingSubject } from './subjects/billing.js'
import { inviteSubject } from './subjects/invite.js'
import { organizationSubject } from './subjects/organization.js'
import { projectSubject } from './subjects/project.js'
import { userSubject } from './subjects/user.js'

export * from './models/organization.js'
export * from './models/project.js'
export * from './models/user.js'
export * from './roles.js'

const appAbilitiesSchema = z.union([
  billingSubject,
  inviteSubject,
  organizationSubject,
  projectSubject,
  userSubject,
  z.tuple([z.literal('manage'), z.literal('all')]),
])

type AppAbilities = z.infer<typeof appAbilitiesSchema>

export type AppAbility = MongoAbility<AppAbilities>
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>

// export function defineAbilityFor(user: User) {
//   const builder = new AbilityBuilder(createAppAbility)

//   const build = (role: Role) => {
//     if (typeof permissions[role] !== 'function') {
//       throw new Error(`Permissions for role ${role} not found`)
//     }
//     return permissions[role](user, builder)
//   }

//   if (typeof user.role === 'string') {
//     build(user.role)
//   }

//   if (Array.isArray(user.role)) {
//     for (const role of user.role) {
//       build(role)
//     }
//   }

//   const ability = builder.build({
//     detectSubjectType(subject) {
//       return subject.__typename
//     },
//   })

//   return ability
// }

export function defineAbilityFor(user: User) {
  const builder = new AbilityBuilder(createAppAbility)

  if (typeof permissions[user.role] !== 'function') {
    throw new Error(`Permissions for role ${user.role} not found.`)
  }
  permissions[user.role](user, builder)

  // for (const role of user.role) {
  //   // Check if there's a corresponding permission defined for the role
  //   if (typeof permissions[role] !== 'function') {
  //     throw new Error(`Permissions for role ${role} not found`)
  //   }
  //   permissions[role](user, builder)
  // }

  const ability = builder.build({
    detectSubjectType(subject) {
      return subject.__typename
    },
  })

  ability.can = ability.can.bind(ability)
  ability.cannot = ability.cannot.bind(ability)

  return ability
}
