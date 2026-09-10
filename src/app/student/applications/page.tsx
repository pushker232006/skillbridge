import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Building2, Calendar, FileText } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function ApplicationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: applications } = await supabase
    .from('applications')
    .select(`
      *,
      opportunity:opportunities(
        title,
        type,
        location,
        industry:industry_profiles(company_name)
      )
    `)
    .eq('student_id', user.id)
    .order('applied_at', { ascending: false })

  const getStatusColor = (status: string) => {
      switch (status) {
          case 'Applied': return 'bg-blue-50 text-blue-700 hover:bg-blue-100'
          case 'Under Review': return 'bg-amber-50 text-amber-700 hover:bg-amber-100'
          case 'Shortlisted': return 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
          case 'Interview': return 'bg-purple-50 text-purple-700 hover:bg-purple-100'
          case 'Selected': return 'bg-emerald-500 text-white hover:bg-emerald-600'
          case 'Rejected': return 'bg-rose-50 text-rose-700 hover:bg-rose-100'
          default: return 'bg-slate-50 text-slate-700'
      }
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Applications</h1>
        <p className="text-slate-500 mt-2">Track the status of your opportunity applications.</p>
      </div>

      {!applications || applications.length === 0 ? (
        <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                    <FileText className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-xl font-semibold mb-2">You haven't applied to any opportunities yet.</h2>
                <p className="text-slate-500 mb-6">Explore the marketplace to find internships and jobs that match your skills.</p>
                <Link href="/student/opportunities">
                    <Button>Explore Opportunities</Button>
                </Link>
            </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
            {applications.map((app) => (
                <Card key={app.id}>
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="space-y-1">
                                <Link href={`/student/opportunities/${app.opportunity_id}`} className="text-xl font-semibold hover:underline">
                                    {(app.opportunity as any)?.title}
                                </Link>
                                <div className="flex items-center text-slate-500 text-sm">
                                    <Building2 className="h-4 w-4 mr-1" />
                                    <span>{((app.opportunity as any)?.industry as any)?.company_name}</span>
                                    <span className="mx-2">•</span>
                                    <span>{(app.opportunity as any)?.location || 'Remote'}</span>
                                    <span className="mx-2">•</span>
                                    <span>{(app.opportunity as any)?.type}</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-start md:items-end gap-2">
                                <Badge className={`px-3 py-1 ${getStatusColor(app.status)}`} variant="outline">
                                    {app.status}
                                </Badge>
                                <div className="flex items-center text-xs text-slate-400">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    Applied {new Date(app.applied_at).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
      )}
    </div>
  )
}
