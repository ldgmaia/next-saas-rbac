import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { createSlug } from '@/utils/create-slug'

import { BadRequestError } from '../_errors/bad-request-error'

export async function createOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations',
      {
        schema: {
          tags: ['Organizations'],
          summary: 'Create an organization',
          security: [{ apiKey: [] }],
          body: z.object({
            name: z.string(),
            domain: z
              .string()
              .nullish()
              .transform((value) => (value === '' ? null : value)),
            shouldAttachUsersByDomain: z.boolean().optional(),
          }),
          response: {
            201: z.object({
              organizationId: z.string().uuid(),
            }),
            401: z.object({
              error: z.string().uuid(),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()
        const { name, domain, shouldAttachUsersByDomain } = request.body

        if (domain) {
          const organizationByDomain = await prisma.organization.findUnique({
            where: { domain },
          })

          if (organizationByDomain) {
            throw new BadRequestError(
              'Another organization is using this domain'
            )
          }
        }

        // const organizationNameExists = await prisma.organization.findFirst({
        //   where: { name },
        // })

        // if (organizationNameExists) {
        //   throw new BadRequestError('Another organization is using this name')
        // }

        const organization = await prisma.organization.create({
          data: {
            name,
            slug: createSlug(name),
            domain,
            shouldAttachUsersByDomain,
            ownerId: userId,
            members: {
              create: {
                userId,
                role: 'ADMIN',
              },
            },
          },
        })

        return reply.status(201).send({ organizationId: organization.id })
      }
    )
}
