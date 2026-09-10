import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, GraduationCap, Briefcase, TrendingUp, CheckCircle2 } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

export default async function InstitutionDashboard() {
  const supabase = await createClient()
  
  // For MVP demo, aggregate institution data (mocking the aggregation query for simplicity or relying on raw fetching)
  // In a real scenario, we would use Supabase RPC or group by queries
  
  const { data: students } = await supabase.from('profiles').select('id').eq('role', 'student')
  const studentCount = students?.length || 0

  // Mocking analytics numbers for the SIH demo flow to look populated
  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Institution Dashboard</h1>
        <p className="text-slate-500 mt-2">Overview of student readiness, placements, and industry collaborations.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentCount > 0 ? studentCount : 452}</div>
            <p className="text-xs text-slate-500 mt-2">Enrolled on platform</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Skill Readiness</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <Progress value={78} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Internships</CardTitle>
            <Briefcase className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <p className="text-xs text-slate-500 mt-2">Students currently working</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Placement Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">84%</div>
            <p className="text-xs text-slate-500 mt-2">Final year students</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>Top Skill Demands vs Readiness</CardTitle>
                <CardDescription>Industry demand compared to your students' average proficiency</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="font-medium">React / Next.js</span>
                        <span className="text-emerald-600 font-medium">85% Ready</span>
                    </div>
                    <Progress value={85} className="h-2" />
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="font-medium">Python & Data Science</span>
                        <span className="text-amber-600 font-medium">62% Ready</span>
                    </div>
                    <Progress value={62} className="h-2" />
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="font-medium">Cloud (AWS/Azure)</span>
                        <span className="text-rose-600 font-medium">45% Ready (Gap)</span>
                    </div>
                    <Progress value={45} className="h-2" />
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="font-medium">Communication</span>
                        <span className="text-emerald-600 font-medium">88% Ready</span>
                    </div>
                    <Progress value={88} className="h-2" />
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Recent Placements</CardTitle>
                <CardDescription>Latest students who secured opportunities</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                            <div>
                                <p className="font-medium">Student {i}</p>
                                <p className="text-sm text-slate-500">B.Tech Computer Science</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-semibold text-primary">Software Engineer</p>
                                <p className="text-xs text-slate-500">TechCorp India</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
