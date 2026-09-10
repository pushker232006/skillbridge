import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BookOpen, PlayCircle } from 'lucide-react'

export default function LearningPage() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Learning Programs</h1>
        <p className="text-slate-500 mt-2">Recommended courses and workshops to bridge your skill gaps.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start mb-2">
              <Badge variant="outline" className="text-amber-600 bg-amber-50 border-amber-200">Addresses your Git gap</Badge>
            </div>
            <CardTitle>Git & GitHub Essentials</CardTitle>
            <CardDescription>Master version control for industry teams.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center text-sm text-slate-500">
              <BookOpen className="h-4 w-4 mr-2" />
              4 Modules • 2 Hours
            </div>
            <Button className="w-full">
              <PlayCircle className="mr-2 h-4 w-4" />
              Start Learning
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start mb-2">
              <Badge variant="outline" className="text-amber-600 bg-amber-50 border-amber-200">Addresses your AWS gap</Badge>
            </div>
            <CardTitle>AWS Cloud Fundamentals</CardTitle>
            <CardDescription>Deploy and manage scalable web applications.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center text-sm text-slate-500">
              <BookOpen className="h-4 w-4 mr-2" />
              8 Modules • 5 Hours
            </div>
            <Button className="w-full">
              <PlayCircle className="mr-2 h-4 w-4" />
              Start Learning
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start mb-2">
              <Badge variant="secondary">Skill Enhancement</Badge>
            </div>
            <CardTitle>Advanced React Patterns</CardTitle>
            <CardDescription>Take your frontend skills to the next level.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center text-sm text-slate-500">
              <BookOpen className="h-4 w-4 mr-2" />
              6 Modules • 4 Hours
            </div>
            <Button className="w-full" variant="outline">
              <PlayCircle className="mr-2 h-4 w-4" />
              Enroll
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
