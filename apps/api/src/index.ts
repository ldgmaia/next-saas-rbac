import { defineAbilityFor, projectSchema } from '@saas/auth'

const ability = defineAbilityFor({
  role: 'MEMBER',
  // role: ['MEMBER', 'BILLING'],
  id: 'user-id',
  __typename: 'User',
})

const project = projectSchema.parse({
  id: 'project-id',
  ownerId: 'user-id',
  // __typename: 'Project',
})

console.log(ability.can('transfer_ownership', 'Organization'))
console.log(ability.can('delete', 'User'))
console.log(ability.can('delete', project))
console.log(ability.can('manage', 'Billing'))
