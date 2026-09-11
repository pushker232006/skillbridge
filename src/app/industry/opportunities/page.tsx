import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, Users, MapPin, Clock, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { deleteOpportunity } from './actions'

export default async function IndustryOpportunitiesPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: opportunities } = await supabase
        .from('opportunities')
        .select(`
            *,
            applications(count)
        `)
        .eq('industry_id', user.id)
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-6 max-w-5xl">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Manage Opportunities</h1>
                    <p className="text-slate-500 mt-2">View and manage your posted internships and jobs.</p>
                </div>
                <Link href="/industry/opportunities/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Opportunity
                    </Button>
                </Link>
            </div>

            {!opportunities || opportunities.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                        <div className="bg-primary/10 p-4 rounded-full mb-4">
                            <Briefcase className="h-8 w-8 text-primary" />
                        </div>
                        <h2 className="text-xl font-semibold mb-2">No opportunities posted</h2>
                        <p className="text-slate-500 mb-6">Create your first opportunity to start matching with talented students.</p>
                        <Link href="/industry/opportunities/create">
                            <Button>Create Opportunity</Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {opportunities.map(opp => (
                        <Card key={opp.id} className="flex flex-col">
                            <CardHeader>
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex gap-2">
                                        <Badge variant={opp.status === 'Open' ? 'default' : 'secondary'}>{opp.status}</Badge>
                                        <Badge variant="outline" className="bg-slate-50">{opp.type}</Badge>
                                    </div>
                                    <form action={deleteOpportunity.bind(null, opp.id)}>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-red-500 hover:bg-red-50" type="submit">
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">Delete</span>
                                        </Button>
                                    </form>
                                </div>
                                <CardTitle className="text-xl">{opp.title}</CardTitle>
                                <CardDescription className="text-xs text-slate-400">
                                    Posted on {new Date(opp.created_at).toLocaleDateString()}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 space-y-4">
                                <div className="flex flex-col space-y-2 text-sm text-slate-600">
                                    <div className="flex items-center">
                                        <MapPin className="h-4 w-4 mr-2 opacity-70" />
                                        <span>{opp.remote ? 'Remote' : opp.location}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Clock className="h-4 w-4 mr-2 opacity-70" />
                                        <span>{opp.duration || 'N/A'}</span>
                                    </div>
                                </div>
                                
                                <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 flex items-center justify-between">
                                    <div className="flex items-center text-sm font-medium">
                                        <Users className="h-4 w-4 mr-2 text-primary" />
                                        {(opp.applications as any)?.[0]?.count || 0} Applications
                                    </div>
                                    <Link href={`/industry/applications?opportunity=${opp.id}`}>
                                        <Button variant="link" size="sm" className="h-auto p-0">View Candidates</Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}

function Briefcase(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      <rect width="20" height="14" x="2" y="6" rx="2" />
    </svg>
  )
}
