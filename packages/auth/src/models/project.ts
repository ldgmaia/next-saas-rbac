import { z } from 'zod'

export const projectSchema = z.object({
  __typename: z.literal('Project').default('Project'),
  id: z.string(), // does not need to add all database table columns, only the ones that is needed
  ownerId: z.string(),
})

export type Project = z.infer<typeof projectSchema>
