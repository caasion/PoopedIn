import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`)
  }

  const supabase = createClient()
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error || !data.user) {
    return NextResponse.redirect(`${origin}/login?error=auth_failed`)
  }

  const { user } = data

  // Upsert the user record in our DB using the Supabase auth ID
  await prisma.user.upsert({
    where: { authId: user.id },
    update: {
      name: user.user_metadata.full_name ?? user.email ?? 'Anonymous',
      avatarUrl:
        user.user_metadata.avatar_url ??
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`,
    },
    create: {
      authId: user.id,
      name: user.user_metadata.full_name ?? user.email ?? 'Anonymous',
      avatarUrl:
        user.user_metadata.avatar_url ??
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`,
      bio: '',
      title: '',
    },
  })

  return NextResponse.redirect(origin)
}
