import { Sidebar } from '@/components/layout/Sidebar'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function IndustryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Verify role
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'industry') {
      redirect('/')
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar role="industry" />
      <main className="flex-1 bg-slate-50 overflow-y-auto">
        <div className="p-8">
            {children}
        </div>
      </main>
    </div>
  )
}
