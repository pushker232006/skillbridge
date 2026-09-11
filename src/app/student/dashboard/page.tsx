import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, CheckCircle2, AlertCircle, Clock, Briefcase } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

export default async function StudentDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let readiness = 0
  let verifiedSkillsCount = 0
  let applicationsCount = 0
  let profileCompletion = 15 // Base profile completion
  let userName = "Student"

  if (user) {
    userName = user.user_metadata?.full_name?.split(' ')[0] || "Student"

    // 1. Fetch latest assessment for Readiness Score
    const { data: assessments } = await supabase
      .from('assessments')
      .select('score')
      .eq('student_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
    
    if (assessments && assessments.length > 0) {
      readiness = assessments[0].score || 0
    }

    // 2. Fetch Verified Skills count
    const { count: skillsCount } = await supabase
      .from('student_skills')
      .select('*', { count: 'exact', head: true })
      .eq('student_id', user.id)
    
    if (skillsCount) {
      verifiedSkillsCount = skillsCount
      profileCompletion += 35 // Add to profile completion if they have skills
    }

    // 3. Fetch Applications count
    const { count: appsCount } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .eq('student_id', user.id)
    
    if (appsCount) applicationsCount = appsCount

    // 4. Check if they have an assessment done to boost profile completion
    if (readiness > 0) profileCompletion += 50
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Good morning, {userName}</h1>
        <p className="text-slate-500 mt-2">Here is an overview of your skill readiness and opportunities.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Skill Readiness</CardTitle>
            <CheckCircle2 className={`h-4 w-4 ${readiness > 0 ? 'text-emerald-500' : 'text-slate-300'}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{readiness}%</div>
            <Progress value={readiness} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Skills</CardTitle>
            <Badge variant="secondary">{verifiedSkillsCount} Total</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{verifiedSkillsCount}</div>
            <p className="text-xs text-slate-500 mt-2">{verifiedSkillsCount > 0 ? "From your assessments" : "Take an assessment to verify skills"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <Clock className={`h-4 w-4 ${applicationsCount > 0 ? 'text-blue-500' : 'text-slate-300'}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applicationsCount}</div>
            <p className="text-xs text-slate-500 mt-2">Active applications</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile</CardTitle>
            <Badge variant="outline">{profileCompletion}%</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profileCompletion}%</div>
            <Progress value={profileCompletion} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Skill Gaps & Focus Areas</CardTitle>
            <CardDescription>Areas to improve for your targeted roles</CardDescription>
          </CardHeader>
          <CardContent>
            {readiness === 0 ? (
               <div className="flex flex-col items-center justify-center p-6 text-center space-y-4">
                 <AlertCircle className="h-8 w-8 text-slate-300" />
                 <p className="text-slate-500">Take an assessment to see your skill gaps.</p>
                 <Link href="/student/assessment">
                   <Button variant="outline" size="sm">Start Assessment</Button>
                 </Link>
               </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    <span className="font-medium">Git</span>
                  </div>
                  <Badge variant="outline" className="text-amber-600 bg-amber-50">Needs improvement</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    <span className="font-medium">AWS</span>
                  </div>
                  <Badge variant="outline" className="text-amber-600 bg-amber-50">Beginner</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-slate-300" />
                    <span className="font-medium text-slate-600">System Design</span>
                  </div>
                  <Badge variant="outline" className="text-slate-600 bg-slate-50">Intermediate</Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommended for you</CardTitle>
            <CardDescription>
                {readiness > 0 ? `Based on your ${readiness}% skill readiness` : "Complete your profile to see tailored matches"}
            </CardDescription>
          </CardHeader>
          <CardContent>
             {readiness === 0 ? (
               <div className="flex flex-col items-center justify-center p-6 text-center space-y-4">
                 <Briefcase className="h-8 w-8 text-slate-300" />
                 <p className="text-slate-500">No recommendations yet.</p>
                 <Link href="/student/opportunities">
                   <Button variant="outline" size="sm">Browse Opportunities</Button>
                 </Link>
               </div>
             ) : (
                <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-4">
                    <div>
                        <p className="font-medium">Frontend Developer Intern</p>
                        <p className="text-sm text-slate-500">TechCorp India • Bangalore</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">{Math.min(98, readiness + 10)}% Match</Badge>
                        <Link href="/student/opportunities">
                            <Button variant="link" size="sm" className="h-auto p-0">View <ArrowRight className="ml-1 h-3 w-3" /></Button>
                        </Link>
                    </div>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                    <div>
                        <p className="font-medium">React Developer</p>
                        <p className="text-sm text-slate-500">StartupX • Remote</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50">{Math.min(95, readiness + 5)}% Match</Badge>
                        <Link href="/student/opportunities">
                            <Button variant="link" size="sm" className="h-auto p-0">View <ArrowRight className="ml-1 h-3 w-3" /></Button>
                        </Link>
                    </div>
                    </div>
                </div>
             )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
