'use server'

import { SignInWithPassword } from '@/http/sign-in-with-password'

export async function signInWithEmailAndPassword(
  previousState: unknown,
  data: FormData
) {
  const { email, password } = Object.fromEntries(data)

  console.log('previousState ', previousState)

  await new Promise((resolve) => setTimeout(resolve, 2000))

  const result = await SignInWithPassword({
    email: String(email),
    password: String(password),
  })

  console.log(result)

  return 'string'
}
