'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { login } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { GraduationCap } from 'lucide-react'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await login(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
            <Link href="/" className="flex items-center space-x-2">
                <div className="bg-primary text-primary-foreground p-2 rounded-xl">
                    <GraduationCap className="h-6 w-6" />
                </div>
                <span className="text-2xl font-bold tracking-tight text-slate-900">SkillBridge</span>
            </Link>
        </div>
        
        <Card className="shadow-lg border-slate-200">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-semibold tracking-tight">Welcome back</CardTitle>
            <CardDescription className="text-slate-500">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="m@example.com" required />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="#" className="text-sm text-primary hover:underline">Forgot password?</Link>
                </div>
                <Input id="password" name="password" type="password" required />
              </div>
              {error && <div className="text-sm font-medium text-destructive">{error}</div>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 text-center text-sm text-slate-500">
            <div>
              Don't have an account?{' '}
              <Link href="/register" className="font-semibold text-primary hover:underline">
                Sign up
              </Link>
            </div>
            <div className="text-xs text-slate-400">
                Demo Accounts:<br/>
                student@skillbridge.demo | industry@skillbridge.demo<br/>
                Password: password123
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
