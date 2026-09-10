import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { calculateMatchScore, Opportunity, StudentProfile, Skill } from '@/lib/matching/engine'
import { MapPin, Briefcase, Clock, IndianRupee, Building2, Search } from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'

export default async function OpportunitiesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch student profile and skills for matching
  const { data: studentData } = await supabase
    .from('student_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const { data: studentSkillsData } = await supabase
    .from('student_skills')
    .select('proficiency, skills(id, name)')
    .eq('student_id', user.id)

  const studentSkills: Skill[] = (studentSkillsData || []).map(s => ({
    id: (s.skills as any).id,
    name: (s.skills as any).name,
    proficiency: s.proficiency || 0
  }))

  const studentProfile: StudentProfile = {
    skills: studentSkills,
    career_interest: studentData?.career_interest,
    experience_months: 0, // MVP simplifying
    location_preference: undefined,
  }

  // Fetch opportunities and their required skills
  const { data: opportunitiesData } = await supabase
    .from('opportunities')
    .select(`
      *,
      industry:profiles!industry_id(industry_profiles(company_name)),
      opportunity_skills(required_level, skills(id, name))
    `)
    .eq('status', 'Open')

  // Calculate scores and sort
  const scoredOpportunities = (opportunitiesData || []).map(opp => {
    const oppSkills: Skill[] = (opp.opportunity_skills || []).map((os: any) => ({
      id: os.skills.id,
      name: os.skills.name,
      required_level: os.required_level
    }))

    const matchOpportunity: Opportunity = {
      id: opp.id,
      title: opp.title,
      skills: oppSkills,
      type: opp.type,
      location: opp.location,
      remote: opp.remote,
      required_experience_months: 0
    }

    const score = calculateMatchScore(studentProfile, matchOpportunity)
    return { ...opp, matchScore: score, oppSkills }
  }).sort((a, b) => b.matchScore - a.matchScore)

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Opportunity Marketplace</h1>
        <p className="text-slate-500 mt-2">Find and apply for internships, jobs, and live projects.</p>
      </div>

      <div className="flex gap-4 mb-8">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input placeholder="Search roles, companies, or keywords..." className="pl-9" />
        </div>
        <Button variant="outline">Filters</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {scoredOpportunities.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500">
                No opportunities found at the moment.
            </div>
        )}
        {scoredOpportunities.map(opp => (
          <Card key={opp.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge variant={opp.type === 'Internship' ? 'default' : 'secondary'}>{opp.type}</Badge>
                <div className="flex items-center space-x-1 bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md text-sm font-semibold border border-emerald-100">
                    <span>{opp.matchScore}% Match</span>
                </div>
              </div>
              <CardTitle className="line-clamp-1">{opp.title}</CardTitle>
              <CardDescription className="flex items-center text-slate-600 mt-1">
                <Building2 className="h-4 w-4 mr-1 opacity-70" />
                {(opp.industry as any)?.industry_profiles?.company_name}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
                <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 opacity-70" />
                    <span className="truncate">{opp.remote ? 'Remote' : opp.location}</span>
                </div>
                <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 opacity-70" />
                    <span>{opp.duration || 'N/A'}</span>
                </div>
                <div className="flex items-center col-span-2">
                    <IndianRupee className="h-4 w-4 mr-2 opacity-70" />
                    <span>{opp.stipend || opp.salary || 'Unpaid'}</span>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">Required Skills</p>
                <div className="flex flex-wrap gap-1.5">
                    {opp.oppSkills.slice(0, 4).map((s: any) => (
                        <Badge key={s.id} variant="outline" className="text-xs font-normal bg-slate-50">
                            {s.name}
                        </Badge>
                    ))}
                    {opp.oppSkills.length > 4 && (
                        <Badge variant="outline" className="text-xs font-normal bg-slate-50">
                            +{opp.oppSkills.length - 4} more
                        </Badge>
                    )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-4 border-t mt-auto">
              <Link href={`/student/opportunities/${opp.id}`} className="w-full">
                  <Button className="w-full" variant={opp.matchScore > 80 ? "default" : "secondary"}>
                      View Details
                  </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
