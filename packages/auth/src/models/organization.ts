import { z } from 'zod'

export const organizationSchema = z.object({
  __typename: z.literal('Organization').default('Organization'),
  id: z.string(), // does not need to add all database table columns, only the ones that is needed
  ownerId: z.string(),
})

export type Organization = z.infer<typeof organizationSchema>
