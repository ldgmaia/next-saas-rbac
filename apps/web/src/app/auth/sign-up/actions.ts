'use server'

import { HTTPError } from 'ky'
import { z } from 'zod'

import { signUp } from '@/http/sign-up'

const signInSchema = z
  .object({
    name: z.string().refine((value) => value.split(' ').length > 1, {
      message: 'Please, enter your full name',
    }),
    email: z.string().email('Invalid e-mail address'),
    password: z.string().min(6, 'Password must have at least 6 characters'),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Password confirmation must match',
    path: ['password_confirmation'],
  })

export async function signUpAction(
  // _previousState: unknown,
  data: FormData
) {
  const result = signInSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors
    return { success: false, message: null, errors }
  }

  const { name, email, password } = result.data

  // await new Promise((resolve) => setTimeout(resolve, 2000))

  try {
    await signUp({
      name,
      email,
      password,
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

  return { success: true, message: null, errors: null }
}
