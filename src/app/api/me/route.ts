import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json(null)
  }

  const dbUser = await prisma.user.findUnique({
    where: { authId: user.id },
    select: { id: true, name: true, avatarUrl: true, bio: true, title: true },
  })

  return NextResponse.json(dbUser)
}
