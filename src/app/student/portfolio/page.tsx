import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, Code, FileText, Download } from 'lucide-react'
import Link from 'next/link'

export default async function PortfolioPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  const { data: student } = await supabase.from('student_profiles').select('*').eq('user_id', user.id).single()
  
  const { data: studentSkillsData } = await supabase
    .from('student_skills')
    .select('proficiency, skills(name)')
    .eq('student_id', user.id)

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-end">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Digital Portfolio</h1>
            <p className="text-slate-500 mt-2">Your verifiable profile shared with recruiters.</p>
        </div>
        <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export Resume
        </Button>
      </div>

      <Card>
        <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="h-32 w-32 rounded-full bg-slate-100 flex items-center justify-center text-4xl font-bold text-primary shrink-0">
                    {profile?.name?.charAt(0)}
                </div>
                <div className="flex-1 space-y-4">
                    <div>
                        <h2 className="text-3xl font-bold">{profile?.name}</h2>
                        <p className="text-lg text-slate-500">{student?.course} {student?.branch ? `- ${student.branch}` : ''}</p>
                    </div>
                    <div className="prose prose-sm text-slate-600">
                        <p>{student?.bio || 'An enthusiastic student looking for opportunities to grow and apply technical skills in real-world projects.'}</p>
                    </div>
                    <div className="flex gap-4">
                        <Button variant="outline" size="sm">
                            <Code className="mr-2 h-4 w-4" /> GitHub
                        </Button>
                        <Button variant="outline" size="sm">
                            <ExternalLink className="mr-2 h-4 w-4" /> LinkedIn
                        </Button>
                    </div>
                </div>
            </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
          <Card>
              <CardHeader>
                  <CardTitle>Verified Skills</CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="flex flex-wrap gap-2">
                      {studentSkillsData?.map((s: any, idx: number) => (
                          <Badge key={idx} variant="secondary" className="px-3 py-1 bg-slate-100 font-normal text-sm">
                              {s.skills.name} <span className="ml-1 text-slate-400">{s.proficiency}%</span>
                          </Badge>
                      ))}
                      {(!studentSkillsData || studentSkillsData.length === 0) && (
                          <p className="text-sm text-slate-500">Take an assessment to display skills.</p>
                      )}
                  </div>
              </CardContent>
          </Card>

          <Card>
              <CardHeader>
                  <CardTitle>Academic Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                  <div className="flex justify-between border-b pb-2">
                      <span className="text-slate-500">Degree</span>
                      <span className="font-medium">{student?.course || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                      <span className="text-slate-500">Year of Study</span>
                      <span className="font-medium">Year {student?.year || 1}</span>
                  </div>
                  <div className="flex justify-between">
                      <span className="text-slate-500">CGPA</span>
                      <span className="font-medium">{student?.cgpa || 'N/A'}</span>
                  </div>
              </CardContent>
          </Card>
      </div>

      <Card>
          <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Projects</CardTitle>
                <CardDescription>Showcase your hands-on experience</CardDescription>
              </div>
              <Button size="sm" variant="outline">Add Project</Button>
          </CardHeader>
          <CardContent>
              <div className="text-center py-8 text-slate-500 border-2 border-dashed rounded-lg">
                  <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No projects added yet.</p>
              </div>
          </CardContent>
      </Card>
    </div>
  )
}
