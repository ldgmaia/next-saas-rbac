'use client'

import { useQuery } from '@tanstack/react-query'
import { ChevronsUpDown, PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { use } from 'react'

import { getProjects } from '@/http/get-projects'

import { Avatar, AvatarFallback } from './ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

export function ProjectSwitcher() {
  const { slug: organizationSlug } = useParams<{ slug: string }>()

  // const projects = use(getProjects(organizationSlug))
  // console.log('projects ', projects)

  const { data, isLoading } = useQuery({
    queryKey: [organizationSlug, 'projects'],
    queryFn: () => getProjects(organizationSlug),
    enabled: !!organizationSlug,
  })

  console.log('data ', data)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-[168px] items-center gap-2 rounded p-1 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-primary">
        {/* {currentProject ? (
          <>
            <Avatar className="mr-2 size-4">
              {currentProject.avatarUrl && (
                <AvatarImage src={currentProject.avatarUrl} />
              )}
              <AvatarFallback />
            </Avatar>
            <span className="truncate">{currentProject.name}</span>
          </>
        ) : ( */}
        <span className="text-muted-foreground">Select project</span>
        {/* )} */}

        <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={12}
        alignOffset={-16}
        className="w-[200px]"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>Projects</DropdownMenuLabel>
          {/* {organizations.map((organization) => {
            return ( */}
          <DropdownMenuItem /* key={organization.id} */ asChild>
            <Link href={``}>
              <Avatar className="mr-2 size-4">
                {/* {organization.avatarUrl && (
                  <AvatarImage src={organization.avatarUrl} />
                )} */}
                <AvatarFallback />
              </Avatar>
              <span className="line-clamp-1">Proj test</span>
            </Link>
          </DropdownMenuItem>
          {/* )
          })} */}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="">
            <PlusCircle className="mr-2 size-4" />
            Create new
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
