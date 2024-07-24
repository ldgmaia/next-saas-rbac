'use server'

import { HTTPError } from 'ky'
import { z } from 'zod'

import { createProject } from '@/http/create-project'

const projectSchema = z.object({
  name: z.string().min(4, { message: 'Name must have at least 4 characters' }),
  description: z.string(),
})

export async function createProjectAction(
  // _previousState: unknown,
  data: FormData
) {
  const result = projectSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors
    return { success: false, message: null, errors }
  }

  const { name, description } = result.data

  // await new Promise((resolve) => setTimeout(resolve, 2000))

  try {
    await createProject({
      name,
      description,
    })
  } catch (error) {
    if (error instanceof HTTPError) {
      const { message } = await error.response.json()
      return { success: false, message, errors: null }
    }
    return {
      success: false,
      message: 'Unexpected error. Try again later',
      errors: null,
    }
  }

  return {
    success: true,
    message: 'Successfully create project',
    errors: null,
  }
}
