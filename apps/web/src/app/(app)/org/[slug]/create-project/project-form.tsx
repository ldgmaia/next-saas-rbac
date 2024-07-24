'use client'

import { AlertTriangle, Loader2 } from 'lucide-react'

// import { useRouter } from 'next/navigation'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useFormState } from '@/hooks/use-form-state'

import { createProjectAction } from './actions'

export function ProjectForm() {
  // const router = useRouter()

  const [{ success, message, errors }, handleSubmit, isPending] = useFormState(
    createProjectAction
    // () => {
    //   router.push('/auth/sign-in')
    // }
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success === false && message && (
        <Alert
          variant="destructive"
          className="border-red-500 text-red-500 dark:border-red-400 dark:text-red-400 [&>svg]:text-red-500 dark:[&>svg]:text-red-400"
        >
          <AlertTriangle className="size-4" />
          <AlertTitle>Save project failed!</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}

      {success && message && (
        <Alert
          variant="default"
          className="border-green-500 text-green-500 dark:border-green-400 dark:text-green-400 [&>svg]:text-green-500 dark:[&>svg]:text-green-400"
        >
          <AlertTriangle className="size-4" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-1">
        <Label htmlFor="name">Project name</Label>
        <Input name="name" type="text" id="name" />

        {errors?.name && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.name[0]}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="description">Description</Label>
        <Textarea name="description" id="description" />

        {errors?.description && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.description[0]}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          'Save project'
        )}
      </Button>
    </form>
  )
}
