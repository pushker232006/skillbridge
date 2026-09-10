import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Briefcase, Clock, IndianRupee, Building2, Calendar, CheckCircle2, XCircle } from 'lucide-react'
import Link from 'next/link'
import { calculateMatchScore, generateSkillGapReport, Opportunity, StudentProfile, Skill } from '@/lib/matching/engine'
import { ApplyButton } from './ApplyButton'
import { notFound } from 'next/navigation'

export default async function OpportunityDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Fetch opportunity
  const { data: opp } = await supabase
    .from('opportunities')
    .select(`
      *,
      industry:profiles!industry_id(name, industry_profiles(company_name, description, website)),
      opportunity_skills(required_level, skills(id, name))
    `)
    .eq('id', params.id)
    .single()

  if (!opp) notFound()

  // Fetch student skills for match explanation
  const { data: studentSkillsData } = await supabase
    .from('student_skills')
    .select('proficiency, skills(id, name)')
    .eq('student_id', user.id)

  const studentSkills: Skill[] = (studentSkillsData || []).map(s => ({
    id: (s.skills as any).id,
    name: (s.skills as any).name,
    proficiency: s.proficiency || 0
  }))

  const oppSkills: Skill[] = (opp.opportunity_skills || []).map((os: any) => ({
    id: os.skills.id,
    name: os.skills.name,
    required_level: os.required_level
  }))

  const matchScore = calculateMatchScore({ skills: studentSkills }, { ...opp, skills: oppSkills } as Opportunity)
  const gapReport = generateSkillGapReport(studentSkills, oppSkills)

  // Check if already applied
  const { data: application } = await supabase
    .from('applications')
    .select('status, applied_at')
    .eq('opportunity_id', params.id)
    .eq('student_id', user.id)
    .single()

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center space-x-2 text-sm text-slate-500 mb-6">
          <Link href="/student/opportunities" className="hover:underline">Opportunities</Link>
          <span>/</span>
          <span className="text-slate-900 truncate">{opp.title}</span>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{opp.title}</h1>
            <div className="flex items-center text-slate-600 mt-2 text-lg">
                <Building2 className="h-5 w-5 mr-2" />
                {(opp.industry as any)?.industry_profiles?.company_name}
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4">
                <Badge>{opp.type}</Badge>
                {opp.remote && <Badge variant="secondary">Remote</Badge>}
            </div>
          </div>

          <div className="w-full md:w-auto">
              {application ? (
                  <Card className="bg-slate-50 border-slate-200">
                      <CardContent className="p-4 flex flex-col items-center">
                          <p className="text-sm font-medium text-slate-500 mb-1">Application Status</p>
                          <Badge className="text-base px-3 py-1" variant="outline">{application.status}</Badge>
                          <p className="text-xs text-slate-400 mt-2">Applied on {new Date(application.applied_at).toLocaleDateString()}</p>
                      </CardContent>
                  </Card>
              ) : (
                  <ApplyButton opportunityId={opp.id} matchScore={matchScore} />
              )}
          </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mt-8">
          <div className="md:col-span-2 space-y-8">
              <section>
                  <h2 className="text-xl font-semibold mb-4">About the Role</h2>
                  <div className="prose prose-slate max-w-none text-slate-600">
                      {opp.description?.split('\n').map((para: string, idx: number) => (
                          <p key={idx}>{para}</p>
                      ))}
                  </div>
              </section>

              <section>
                  <h2 className="text-xl font-semibold mb-4">Why you match ({matchScore}%)</h2>
                  <Card>
                      <CardContent className="p-0 divide-y">
                          {gapReport.map((report, idx) => (
                              <div key={idx} className="flex items-center justify-between p-4">
                                  <div className="flex items-center space-x-3">
                                      {report.ok ? (
                                          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                      ) : (
                                          <XCircle className="h-5 w-5 text-rose-500" />
                                      )}
                                      <span className="font-medium">{report.skill.name}</span>
                                  </div>
                                  <span className={`text-sm ${report.ok ? 'text-emerald-600' : 'text-rose-600'}`}>
                                      {report.status}
                                  </span>
                              </div>
                          ))}
                          {gapReport.length === 0 && (
                              <div className="p-4 text-slate-500">No specific skills required.</div>
                          )}
                      </CardContent>
                  </Card>
                  
                  {gapReport.some(r => !r.ok) && (
                      <div className="mt-4 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm border border-blue-100">
                          <strong>Pro Tip:</strong> You can improve your match score by taking learning programs for your skill gaps.
                      </div>
                  )}
              </section>
          </div>

          <div className="space-y-6">
              <Card>
                  <CardHeader>
                      <CardTitle className="text-lg">Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      <div className="flex items-center text-sm text-slate-600">
                          <MapPin className="h-4 w-4 mr-3 opacity-70" />
                          {opp.location || 'Not specified'}
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                          <Clock className="h-4 w-4 mr-3 opacity-70" />
                          {opp.duration || 'Not specified'}
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                          <IndianRupee className="h-4 w-4 mr-3 opacity-70" />
                          {opp.stipend || opp.salary || 'Unpaid'}
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                          <Calendar className="h-4 w-4 mr-3 opacity-70" />
                          Deadline: {opp.deadline ? new Date(opp.deadline).toLocaleDateString() : 'Rolling'}
                      </div>
                  </CardContent>
              </Card>

              <Card>
                  <CardHeader>
                      <CardTitle className="text-lg">About {(opp.industry as any)?.industry_profiles?.company_name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <p className="text-sm text-slate-600 mb-4 line-clamp-4">
                          {(opp.industry as any)?.industry_profiles?.description || 'No description provided.'}
                      </p>
                      {(opp.industry as any)?.industry_profiles?.website && (
                          <a href={(opp.industry as any).industry_profiles.website} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline">
                              Visit Website
                          </a>
                      )}
                  </CardContent>
              </Card>
          </div>
      </div>
    </div>
  )
}
