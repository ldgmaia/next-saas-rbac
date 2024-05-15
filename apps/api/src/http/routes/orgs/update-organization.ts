import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'
import { organizationSchema } from '@saas/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from '../_errors/bad-request-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function updateOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organizations/:slug',
      {
        schema: {
          tags: ['Organizations'],
          summary: 'Update an organization details',
          security: [{ apiKey: [] }],
          body: z.object({
            name: z.string(),
            domain: z.string().nullish(),
            shouldAttachUserByDomain: z.boolean().optional(),
          }),
          params: z.object({
            slug: z.string(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug } = await request.params
        const { membership, organization } =
          await request.getUserMembership(slug)
        const userId = await request.getCurrentUserId()

        const { name, domain, shouldAttachUserByDomain } = request.body

        const authOrganization = organizationSchema.parse(organization)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('update', authOrganization)) {
          throw new UnauthorizedError(
            'You are not allowed to update this organization'
          )
        }

        if (domain) {
          const organizationByDomain = await prisma.organization.findFirst({
            where: {
              domain,
              id: {
                not: organization.id,
              },
            },
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

        await prisma.organization.update({
          where: {
            id: organization.id,
          },
          data: {
            name,
            // slug: createSlug(name),
            domain,
            shouldAttachUserByDomain,
            // ownerId: userId,
            // members: {
            //   create: {
            //     userId,
            //     role: 'ADMIN',
            //   },
            // },
          },
        })

        return reply.status(204).send()
      }
    )
}
