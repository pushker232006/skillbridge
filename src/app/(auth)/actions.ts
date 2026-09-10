'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/') // Middleware will intercept and send to correct dashboard
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string
  const role = formData.get('role') as string

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  if (data.user) {
    // Insert into profiles
    const { error: profileError } = await supabase.from('profiles').insert([
      { id: data.user.id, email, name, role }
    ])

    if (profileError) {
        return { error: profileError.message }
    }

    // Role specific profiles
    if (role === 'student') {
        await supabase.from('student_profiles').insert([{ user_id: data.user.id }])
    } else if (role === 'industry') {
        await supabase.from('industry_profiles').insert([{ user_id: data.user.id, company_name: name }])
    } else if (role === 'academician') {
        await supabase.from('faculty_profiles').insert([{ user_id: data.user.id }])
    }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
}
