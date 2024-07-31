'use server'

import { HTTPError } from 'ky'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'

import { getCurrentOrganization } from '@/auth/auth'
import { createOrganization } from '@/http/create-organization'
import { updateOrganization } from '@/http/update-organization'

const organizationSchema = z
  .object({
    name: z
      .string()
      .min(4, { message: 'Name must have at least 4 characters' }),
    domain: z
      .string()
      .nullable()
      .refine(
        (value) => {
          if (value) {
            const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-_]+\.)+[a-zA-Z]{2,}$/

            return domainRegex.test(value)
          }
          return true
        },
        { message: 'Please enter a valid domain' }
      ),
    shouldAttachUsersByDomain: z
      .union([z.literal('on'), z.literal('off'), z.boolean()])
      .transform((value) => value === true || value === 'on')
      .default(false),
  })
  .refine(
    (data) => {
      if (data.shouldAttachUsersByDomain === true && !data.domain) {
        return false
      }
      return true
    },
    {
      message: 'Domain is required when auto join is enabled',
      path: ['domain'],
    }
  )

export type OrganizationSchema = z.infer<typeof organizationSchema>

export async function createOrganizationAction(
  // _previousState: unknown,
  data: FormData
) {
  const result = organizationSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors
    return { success: false, message: null, errors }
  }

  const { name, domain, shouldAttachUsersByDomain } = result.data

  // await new Promise((resolve) => setTimeout(resolve, 2000))

  try {
    await createOrganization({
      name,
      domain,
      shouldAttachUsersByDomain,
    })

    revalidateTag('organizations')
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
    message: 'Successfully created organization',
    errors: null,
  }
}

export async function updateOrganizationAction(
  // _previousState: unknown,
  data: FormData
) {
  const currentOrg = getCurrentOrganization()
  const result = organizationSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors
    return { success: false, message: null, errors }
  }

  const { name, domain, shouldAttachUsersByDomain } = result.data

  // await new Promise((resolve) => setTimeout(resolve, 2000))

  try {
    await updateOrganization({
      org: currentOrg!,
      name,
      domain,
      shouldAttachUsersByDomain,
    })

    revalidateTag('organizations')
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
    message: 'Successfully updated organization',
    errors: null,
  }
}
