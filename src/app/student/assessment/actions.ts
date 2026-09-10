'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getAssessmentQuestions() {
  const supabase = await createClient()
  
  // For the MVP demo, if there are no questions in DB, we could return fallback data.
  // But since we will seed the DB, we just fetch.
  const { data: questions, error } = await supabase
    .from('assessment_questions')
    .select('*, skills(name)')
    
  if (error || !questions) {
    return { error: 'Failed to load questions' }
  }
  
  return { questions }
}

export async function submitAssessment(answers: Record<string, number>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  // Fetch correct answers
  const { data: questions } = await supabase.from('assessment_questions').select('*')
  if (!questions) throw new Error("Questions not found")

  let totalScore = 0
  const skillScores: Record<string, { total: number, correct: number }> = {}

  questions.forEach(q => {
    if (!skillScores[q.skill_id]) {
      skillScores[q.skill_id] = { total: 0, correct: 0 }
    }
    skillScores[q.skill_id].total += 1
    
    if (answers[q.id] === q.correct_option) {
      totalScore += 1
      skillScores[q.skill_id].correct += 1
    }
  })

  const overallScore = Math.round((totalScore / questions.length) * 100) || 0

  // Save assessment
  const { data: assessment, error: assessmentError } = await supabase
    .from('assessments')
    .insert([{ student_id: user.id, score: overallScore }])
    .select()
    .single()

  if (assessmentError || !assessment) throw new Error("Failed to save assessment")

  // Save detailed results and update student_skills
  for (const [skillId, scores] of Object.entries(skillScores)) {
    const proficiency = Math.round((scores.correct / scores.total) * 100)
    
    await supabase.from('assessment_results').insert([
      { assessment_id: assessment.id, skill_id: skillId, score: proficiency }
    ])

    // Upsert into student_skills
    const { data: existingSkill } = await supabase
        .from('student_skills')
        .select('id')
        .eq('student_id', user.id)
        .eq('skill_id', skillId)
        .single()

    if (existingSkill) {
        await supabase.from('student_skills').update({ proficiency }).eq('id', existingSkill.id)
    } else {
        await supabase.from('student_skills').insert([{ student_id: user.id, skill_id: skillId, proficiency }])
    }
  }

  revalidatePath('/student/dashboard')
  revalidatePath('/student/skills')
  
  return { success: true, overallScore }
}
