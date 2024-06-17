import Link from 'next/link'

import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <Button variant="link" className="w-full" size="sm" asChild>
      <Link href="/auth/sign-in">Sign In</Link>
    </Button>
  )
}
