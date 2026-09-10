import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, CheckCircle2, AlertCircle, Clock } from "lucide-react"
import Link from "next/link"

export default function StudentDashboard() {
  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Good morning, Student</h1>
        <p className="text-slate-500 mt-2">Here is an overview of your skill readiness and opportunities.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Skill Readiness</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">82%</div>
            <Progress value={82} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Skills</CardTitle>
            <Badge variant="secondary">12 Total</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-slate-500 mt-2">+2 from last assessment</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-slate-500 mt-2">2 under review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile</CardTitle>
            <Badge variant="outline">90%</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">90%</div>
            <Progress value={90} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Skill Gaps</CardTitle>
            <CardDescription>Areas to improve for your targeted roles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommended for you</CardTitle>
            <CardDescription>Based on your 82% skill readiness</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="font-medium">Frontend Developer Intern</p>
                <p className="text-sm text-slate-500">TechCorp India • Bangalore</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">92% Match</Badge>
                <Link href="/student/opportunities/1">
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
                <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50">88% Match</Badge>
                <Link href="/student/opportunities/2">
                    <Button variant="link" size="sm" className="h-auto p-0">View <ArrowRight className="ml-1 h-3 w-3" /></Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
