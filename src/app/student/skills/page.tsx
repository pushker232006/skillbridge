import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function SkillsPage({ searchParams }: { searchParams: { completed?: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch student skills
  const { data: studentSkills } = await supabase
    .from('student_skills')
    .select('*, skills(name, category)')
    .eq('student_id', user.id)
    .order('proficiency', { ascending: false })

  // Fetch latest assessment score
  const { data: latestAssessment } = await supabase
    .from('assessments')
    .select('score')
    .eq('student_id', user.id)
    .order('completed_at', { ascending: false })
    .limit(1)
    .single()

  const overallScore = latestAssessment?.score || 0
  const hasSkills = studentSkills && studentSkills.length > 0

  const technicalSkills = studentSkills?.filter(s => s.skills?.category === 'Technical') || []
  const softSkills = studentSkills?.filter(s => s.skills?.category === 'Soft') || []

  // Simple mock gap analysis based on 80% baseline
  const strengths = studentSkills?.filter(s => (s.proficiency || 0) >= 80) || []
  const gaps = studentSkills?.filter(s => (s.proficiency || 0) < 80) || []

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Skills</h1>
          <p className="text-slate-500 mt-2">Your skill profile generated from assessments.</p>
        </div>
        <Link href="/student/assessment">
            <Button>Take New Assessment</Button>
        </Link>
      </div>

      {searchParams?.completed === 'true' && (
          <div className="bg-emerald-50 text-emerald-900 border border-emerald-200 p-4 rounded-lg flex items-center">
              <CheckCircle2 className="h-5 w-5 mr-3 text-emerald-600" />
              <div>
                  <p className="font-medium">Assessment Completed Successfully!</p>
                  <p className="text-sm opacity-90">Your skill profile and recommendations have been updated.</p>
              </div>
          </div>
      )}

      {!hasSkills ? (
        <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                    <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-xl font-semibold mb-2">No Skills Verified Yet</h2>
                <p className="text-slate-500 mb-6 max-w-md">Take your first skill assessment to generate your profile, identify gaps, and get matched with opportunities.</p>
                <Link href="/student/assessment">
                    <Button size="lg">Start Assessment</Button>
                </Link>
            </CardContent>
        </Card>
      ) : (
        <>
            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-1 bg-slate-900 text-slate-50">
                    <CardHeader>
                        <CardTitle className="text-slate-100">Overall Readiness</CardTitle>
                        <CardDescription className="text-slate-400">Industry benchmark</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center py-6">
                        <div className="relative flex items-center justify-center h-32 w-32 rounded-full border-8 border-primary border-t-emerald-500 transform rotate-45">
                            <div className="absolute transform -rotate-45 text-4xl font-bold">{overallScore}%</div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Skill Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h4 className="text-sm font-medium mb-3 text-slate-500 uppercase tracking-wider">Technical Skills</h4>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {technicalSkills.map((s: any) => (
                                    <div key={s.id} className="space-y-1">
                                        <div className="flex justify-between text-sm">
                                            <span className="font-medium">{s.skills.name}</span>
                                            <span className="text-slate-500">{s.proficiency}%</span>
                                        </div>
                                        <Progress value={s.proficiency} className="h-2" />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium mb-3 text-slate-500 uppercase tracking-wider">Soft Skills</h4>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {softSkills.map((s: any) => (
                                    <div key={s.id} className="space-y-1">
                                        <div className="flex justify-between text-sm">
                                            <span className="font-medium">{s.skills.name}</span>
                                            <span className="text-slate-500">{s.proficiency}%</span>
                                        </div>
                                        <Progress value={s.proficiency} className="h-2" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <div className="flex items-center space-x-2">
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                            <CardTitle>Your Strongest Skills</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {strengths.map((s: any) => (
                                <Badge key={s.id} variant="secondary" className="px-3 py-1 text-sm bg-emerald-50 text-emerald-700 hover:bg-emerald-100">
                                    {s.skills.name}
                                </Badge>
                            ))}
                            {strengths.length === 0 && <p className="text-slate-500 text-sm">Keep practicing to build your strengths!</p>}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center space-x-2">
                            <AlertCircle className="h-5 w-5 text-amber-500" />
                            <CardTitle>Skills to Improve</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2 mb-6">
                            {gaps.map((s: any) => (
                                <Badge key={s.id} variant="outline" className="px-3 py-1 text-sm text-amber-700 border-amber-200 bg-amber-50">
                                    {s.skills.name}
                                </Badge>
                            ))}
                            {gaps.length === 0 && <p className="text-slate-500 text-sm">No significant skill gaps identified!</p>}
                        </div>
                        
                        {gaps.length > 0 && (
                            <Link href="/student/learning">
                                <Button variant="outline" className="w-full text-primary border-primary/20 hover:bg-primary/5">
                                    View Recommended Learning Programs
                                </Button>
                            </Link>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
      )}
    </div>
  )
}
