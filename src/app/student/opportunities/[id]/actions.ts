'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function applyForOpportunity(opportunityId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: "Unauthorized" }

  const { error } = await supabase.from('applications').insert([
    { student_id: user.id, opportunity_id: opportunityId, status: 'Applied' }
  ])

  if (error) {
    if (error.code === '23505') {
        return { error: "You have already applied for this opportunity." }
    }
    return { error: error.message }
  }

  revalidatePath('/student/opportunities')
  revalidatePath(`/student/opportunities/${opportunityId}`)
  revalidatePath('/student/applications')
  
  return { success: true }
}
