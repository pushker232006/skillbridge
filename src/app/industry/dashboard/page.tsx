import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Briefcase, FileText, UserCheck, Users } from 'lucide-react'
import Link from 'next/link'

export default async function IndustryDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: companyProfile } = await supabase
    .from('industry_profiles')
    .select('company_name')
    .eq('user_id', user.id)
    .single()

  // Fetch metrics — first get this industry's opportunity IDs, then filter applications
  const { data: myOpps } = await supabase
    .from('opportunities')
    .select('id')
    .eq('industry_id', user.id)

  const myOppIds = (myOpps || []).map(o => o.id)
  const oppCount = myOpps?.length || 0

  const { data: applications } = myOppIds.length > 0
    ? await supabase.from('applications').select('status').in('opportunity_id', myOppIds)
    : { data: [] }
  
  const appCount = applications?.length || 0
  const shortlistedCount = applications?.filter(a => a.status === 'Shortlisted').length || 0
  const selectedCount = applications?.filter(a => a.status === 'Selected').length || 0

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome, {companyProfile?.company_name}</h1>
        <p className="text-slate-500 mt-2">Manage your opportunities and review candidate applications.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Opportunities</CardTitle>
            <Briefcase className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{oppCount || 0}</div>
            <Link href="/industry/opportunities" className="text-xs text-primary hover:underline mt-2 inline-block">View all</Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appCount}</div>
            <Link href="/industry/applications" className="text-xs text-primary hover:underline mt-2 inline-block">Review pipeline</Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shortlisted</CardTitle>
            <Users className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{shortlistedCount}</div>
            <p className="text-xs text-slate-500 mt-2">Awaiting interview</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Selected</CardTitle>
            <UserCheck className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{selectedCount}</div>
            <p className="text-xs text-slate-500 mt-2">Hired candidates</p>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline visualization could go here */}
      <Card>
          <CardHeader>
              <CardTitle>Application Pipeline</CardTitle>
              <CardDescription>Visual breakdown of candidate statuses</CardDescription>
          </CardHeader>
          <CardContent>
              <div className="flex items-center justify-between mt-4 relative">
                  <div className="absolute left-0 top-1/2 w-full h-1 bg-slate-100 -z-10 -translate-y-1/2"></div>
                  
                  {['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected'].map((stage, idx) => {
                      const count = applications?.filter(a => a.status === stage).length || 0
                      return (
                          <div key={idx} className="flex flex-col items-center bg-slate-50 p-2 rounded-lg">
                              <div className="bg-white border-2 border-primary text-primary h-10 w-10 rounded-full flex items-center justify-center font-bold mb-2 shadow-sm">
                                  {count}
                              </div>
                              <span className="text-xs font-medium text-slate-600 uppercase tracking-wider">{stage}</span>
                          </div>
                      )
                  })}
              </div>
          </CardContent>
      </Card>
    </div>
  )
}
