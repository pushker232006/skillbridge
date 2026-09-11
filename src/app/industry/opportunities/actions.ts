'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createOpportunity(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: "Unauthorized" }

  const title = formData.get('title') as string
  const type = formData.get('type') as string
  const location = formData.get('location') as string
  const remote = formData.get('remote') === 'on'
  const stipend = formData.get('stipend') as string
  const duration = formData.get('duration') as string
  const description = formData.get('description') as string
  
  // For MVP, we will handle skills as a comma-separated string to easily seed/input
  const skillsInput = formData.get('skills') as string

  const { data: opp, error } = await supabase.from('opportunities').insert([
    {
        industry_id: user.id,
        title,
        type,
        location,
        remote,
        stipend,
        duration,
        description,
        status: 'Open'
    }
  ]).select().single()

  if (error || !opp) {
      return { error: error?.message || "Failed to create opportunity" }
  }

  // Handle skills
  if (skillsInput) {
      const skillNames = skillsInput.split(',').map(s => s.trim()).filter(Boolean)
      
      for (const skillName of skillNames) {
          // Find or create skill
          let skillId = null
          const { data: existingSkill } = await supabase.from('skills').select('id').ilike('name', skillName).single()
          
          if (existingSkill) {
              skillId = existingSkill.id
          } else {
              const { data: newSkill } = await supabase.from('skills').insert([{ name: skillName, category: 'Technical' }]).select('id').single()
              if (newSkill) skillId = newSkill.id
          }

          if (skillId) {
              await supabase.from('opportunity_skills').insert([{
                  opportunity_id: opp.id,
                  skill_id: skillId,
                  required_level: 50 // Default required level for MVP
              }])
          }
      }
  }

  revalidatePath('/industry/opportunities')
  revalidatePath('/industry/dashboard')
  redirect('/industry/opportunities')
}

export async function updateApplicationStatus(applicationId: string, newStatus: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
  
    if (!user) return { error: "Unauthorized" }

    // RLS policy ensures only the owning industry can update this
    const { error } = await supabase.from('applications').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', applicationId)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/industry/applications')
    revalidatePath('/industry/dashboard')
    
    return { success: true }
}

export async function deleteOpportunity(opportunityId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
  
    if (!user) return { error: "Unauthorized" }

    // Verify ownership first
    const { data: opp } = await supabase.from('opportunities').select('id').eq('id', opportunityId).eq('industry_id', user.id).single()
    
    if (!opp) {
        return { error: "Opportunity not found or unauthorized" }
    }

    // Manually delete related records first in case ON DELETE CASCADE is missing in the database
    await supabase.from('opportunity_skills').delete().eq('opportunity_id', opportunityId)
    await supabase.from('applications').delete().eq('opportunity_id', opportunityId)

    const { error } = await supabase.from('opportunities').delete().eq('id', opportunityId).eq('industry_id', user.id)

    if (error) {
        console.error("Failed to delete opportunity:", error)
        return { error: error.message }
    }

    revalidatePath('/industry/opportunities')
    revalidatePath('/industry/dashboard')
    
    return { success: true }
}

