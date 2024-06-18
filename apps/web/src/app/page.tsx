import { auth } from '@/auth/auth'

export default async function Home() {
  const { user } = await auth()
  return (
    <pre>{JSON.stringify(user, null, 2)}</pre>
    // <Button variant="link" className="w-full" size="sm" asChild>
    //   <Link href="/auth/sign-in">Sign In</Link>
    // </Button>
  )
}
