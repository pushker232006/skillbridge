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
  
  // Use admin client to bypass the 3/hour email limit completely
  const { createClient: createAdminClient } = require('@supabase/supabase-js')
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string
  const role = formData.get('role') as string

  // Force create the user as pre-confirmed, bypassing all SMTP limits
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (error) {
    return { error: error.message }
  }

  if (data.user) {
    // Insert into profiles
    const { error: profileError } = await supabaseAdmin.from('profiles').insert([
      { id: data.user.id, email, name, role }
    ])

    if (profileError) {
        return { error: profileError.message }
    }

    // Role specific profiles
    if (role === 'student') {
        await supabaseAdmin.from('student_profiles').insert([{ user_id: data.user.id }])
    } else if (role === 'industry') {
        await supabaseAdmin.from('industry_profiles').insert([{ user_id: data.user.id, company_name: name }])
    } else if (role === 'academician') {
        await supabaseAdmin.from('faculty_profiles').insert([{ user_id: data.user.id }])
    }
  }

  // Log the user in on the client side now that the account is created
  await supabase.auth.signInWithPassword({ email, password })

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
}
