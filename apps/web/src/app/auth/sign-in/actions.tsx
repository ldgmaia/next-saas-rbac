'use server'

import { HTTPError } from 'ky'
import { cookies } from 'next/headers'
import { z } from 'zod'

import { SignInWithPassword } from '@/http/sign-in-with-password'

const signInSchema = z.object({
  email: z.string().email('Invalid e-mail address'),
  password: z.string().min(6, 'Must have at least 6 characters'),
})

export async function signInWithEmailAndPassword(
  // _previousState: unknown,
  data: FormData
) {
  const result = signInSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors
    return { success: false, message: null, errors }
  }

  const { email, password } = result.data

  // await new Promise((resolve) => setTimeout(resolve, 2000))

  try {
    const { token } = await SignInWithPassword({
      email,
      password,
    })

    cookies().set('token', token, {
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/', // route that will have access to cookies
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
