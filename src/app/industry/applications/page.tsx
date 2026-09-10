import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { GraduationCap, Mail, Phone, ExternalLink, Calendar, Building2 } from 'lucide-react'
import { calculateMatchScore, Opportunity, StudentProfile, Skill } from '@/lib/matching/engine'
import { StatusActions } from './StatusActions'

export default async function IndustryApplicationsPage({ searchParams }: { searchParams: { opportunity?: string } }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    let query = supabase
        .from('applications')
        .select(`
            *,
            student:student_profiles(course, branch, year, user_id),
            profile:profiles!student_id(name, email, avatar_url, institution_id),
            institution:institutions(name),
            opportunity:opportunities!inner(*, opportunity_skills(required_level, skills(id, name)))
        `)
        .eq('opportunities.industry_id', user.id)

    if (searchParams.opportunity) {
        query = query.eq('opportunity_id', searchParams.opportunity)
    }

    const { data: applicationsRaw } = await query.order('applied_at', { ascending: false })

    // Filter out applications where opportunity didn't match the inner join criteria (Postgrest behavior)
    const applicationsValid = (applicationsRaw || []).filter(a => a.opportunity !== null)

    // Calculate match scores for all applications
    const enrichedApplications = await Promise.all(applicationsValid.map(async (app) => {
        // Fetch student skills
        const { data: stdSkills } = await supabase.from('student_skills').select('proficiency, skills(id, name)').eq('student_id', app.student_id)
        
        const studentSkills: Skill[] = (stdSkills || []).map(s => ({
            id: (s.skills as any).id,
            name: (s.skills as any).name,
            proficiency: s.proficiency || 0
        }))

        const oppSkills: Skill[] = ((app.opportunity as any)?.opportunity_skills || []).map((os: any) => ({
            id: os.skills.id,
            name: os.skills.name,
            required_level: os.required_level
        }))

        const studentProfile: StudentProfile = {
            skills: studentSkills,
            career_interest: undefined,
            experience_months: 0,
            location_preference: undefined
        }

        const opportunity: Opportunity = {
            id: (app.opportunity as any).id,
            title: (app.opportunity as any).title,
            skills: oppSkills,
            type: (app.opportunity as any).type,
        }

        const score = calculateMatchScore(studentProfile, opportunity)

        return { ...app, matchScore: score, studentSkills }
    }))

    // Sort by match score
    enrichedApplications.sort((a, b) => b.matchScore - a.matchScore)

    return (
        <div className="space-y-6 max-w-6xl">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Review Applications</h1>
                <p className="text-slate-500 mt-2">Evaluate candidates and manage your recruitment pipeline.</p>
            </div>

            {enrichedApplications.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center text-slate-500">
                        No applications found for your opportunities.
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6">
                    {enrichedApplications.map(app => (
                        <Card key={app.id} className="overflow-hidden border-slate-200 shadow-sm">
                            <div className="flex flex-col md:flex-row">
                                <div className="p-6 md:w-1/3 bg-slate-50 border-r flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                                                {(app.profile as any)?.name?.charAt(0) || 'S'}
                                            </div>
                                            <Badge className={app.matchScore >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'} variant="outline">
                                                {app.matchScore}% Match
                                            </Badge>
                                        </div>
                                        <h3 className="text-xl font-bold">{(app.profile as any)?.name}</h3>
                                        <div className="text-sm text-slate-500 mt-1 flex flex-col space-y-1">
                                            <div className="flex items-center"><GraduationCap className="h-3 w-3 mr-2" /> {(app.student as any)?.course} - Year {(app.student as any)?.year}</div>
                                            <div className="flex items-center"><Building2 className="h-3 w-3 mr-2" /> {(app.institution as any)?.name || 'Unknown Institution'}</div>
                                            <div className="flex items-center"><Mail className="h-3 w-3 mr-2" /> {(app.profile as any)?.email}</div>
                                        </div>
                                    </div>
                                    <div className="mt-6 pt-4 border-t">
                                        <Button variant="outline" className="w-full text-sm" size="sm">
                                            <ExternalLink className="h-4 w-4 mr-2" />
                                            View Full Portfolio
                                        </Button>
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-center mb-4">
                                            <div>
                                                <p className="text-sm font-medium text-slate-500">Applied for</p>
                                                <h4 className="text-lg font-semibold">{(app.opportunity as any)?.title}</h4>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium text-slate-500">Applied on</p>
                                                <p className="text-sm">{new Date(app.applied_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <p className="text-sm font-medium text-slate-700 mb-2">Candidate Skills</p>
                                            <div className="flex flex-wrap gap-2">
                                                {app.studentSkills.map((s: any) => (
                                                    <Badge key={s.id} variant="secondary" className="bg-slate-100 font-normal">
                                                        {s.name} <span className="ml-1 text-slate-400">{s.proficiency}%</span>
                                                    </Badge>
                                                ))}
                                                {app.studentSkills.length === 0 && <span className="text-sm text-slate-400">No skills assessed yet.</span>}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="border-t pt-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <span className="text-sm text-slate-500 mr-3">Current Status:</span>
                                                <Badge variant="outline">{app.status}</Badge>
                                            </div>
                                            <StatusActions applicationId={app.id} currentStatus={app.status} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
