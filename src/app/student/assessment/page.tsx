'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getAssessmentQuestions, submitAssessment } from './actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'

type Question = {
  id: string
  question: string
  options: string[]
  skill_id: string
  skills: { name: string }
}

export default function AssessmentPage() {
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    getAssessmentQuestions().then((res) => {
      if (res.questions) {
        setQuestions(res.questions as any)
      }
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Skill Assessment</CardTitle>
          <CardDescription>No questions available at the moment. Please try again later.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const currentQuestion = questions[currentIndex]
  const progress = ((currentIndex) / questions.length) * 100

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    const result = await submitAssessment(answers)
    if (result.success) {
      router.push('/student/skills?completed=true')
    } else {
      setSubmitting(false)
      alert("Failed to submit assessment")
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Skill Assessment</h1>
        <p className="text-slate-500 mt-2">Evaluate your technical and soft skills to improve your match rates.</p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm text-slate-500">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <span>{Math.round(progress)}% Completed</span>
        </div>
        <Progress value={progress} />
      </div>

      <Card className="mt-8">
        <CardHeader>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
              {currentQuestion.skills?.name || 'General'}
            </span>
          </div>
          <CardTitle className="text-xl leading-relaxed">{currentQuestion.question}</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={answers[currentQuestion.id]?.toString()} 
            onValueChange={(val) => setAnswers(prev => ({ ...prev, [currentQuestion.id]: parseInt(val) }))}
            className="space-y-3"
          >
            {currentQuestion.options.map((opt, idx) => (
              <div key={idx} className="flex items-center space-x-3 space-y-0 p-4 border rounded-lg transition-colors hover:bg-slate-50 cursor-pointer [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5">
                <RadioGroupItem value={idx.toString()} id={`opt-${idx}`} />
                <Label htmlFor={`opt-${idx}`} className="font-normal cursor-pointer flex-1 text-base">{opt}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <Button variant="outline" onClick={handlePrevious} disabled={currentIndex === 0 || submitting}>
            Previous
          </Button>
          
          {currentIndex === questions.length - 1 ? (
            <Button 
                onClick={handleSubmit} 
                disabled={answers[currentQuestion.id] === undefined || submitting}
            >
              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Submit Assessment
            </Button>
          ) : (
            <Button onClick={handleNext} disabled={answers[currentQuestion.id] === undefined}>
              Next
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
