'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { logout } from '@/app/(auth)/actions'
import {
  LayoutDashboard,
  BrainCircuit,
  Award,
  Briefcase,
  FileText,
  BookOpen,
  UserCircle,
  Bell,
  Settings,
  LogOut,
  GraduationCap,
  LineChart,
  Users,
  Building2
} from 'lucide-react'

const studentNavItems = [
  { name: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
  { name: 'Skill Assessment', href: '/student/assessment', icon: BrainCircuit },
  { name: 'My Skills', href: '/student/skills', icon: Award },
  { name: 'Opportunities', href: '/student/opportunities', icon: Briefcase },
  { name: 'Applications', href: '/student/applications', icon: FileText },
  { name: 'Learning', href: '/student/learning', icon: BookOpen },
  { name: 'Portfolio', href: '/student/portfolio', icon: UserCircle },
]

const industryNavItems = [
  { name: 'Dashboard', href: '/industry/dashboard', icon: LayoutDashboard },
  { name: 'Opportunities', href: '/industry/opportunities', icon: Briefcase },
  { name: 'Applications', href: '/industry/applications', icon: FileText },
  { name: 'Candidates', href: '/industry/candidates', icon: UserCircle },
]

const institutionNavItems = [
  { name: 'Dashboard', href: '/institution/dashboard', icon: LayoutDashboard },
  { name: 'Analytics', href: '/institution/analytics', icon: LineChart },
  { name: 'Students', href: '/institution/students', icon: Users },
  { name: 'Industry Partners', href: '#', icon: Building2 },
]

export function Sidebar({ role = 'student' }: { role?: string }) {
  const pathname = usePathname()
  
  let navItems = studentNavItems
  if (role === 'industry') navItems = industryNavItems
  if (role === 'institution') navItems = institutionNavItems

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-slate-50">
      <div className="p-6">
        <Link href="/" className="flex items-center space-x-2">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
                <GraduationCap className="h-5 w-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">SkillBridge</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-4 text-sm font-medium">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-slate-500 transition-all hover:text-slate-900",
                  isActive ? "bg-slate-200 text-slate-900" : ""
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="p-4">
        <nav className="grid gap-1 text-sm font-medium">
          <Link
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-500 transition-all hover:text-slate-900"
          >
            <Bell className="h-4 w-4" />
            Notifications
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-500 transition-all hover:text-slate-900"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-slate-500 transition-all hover:text-slate-900"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </form>
        </nav>
      </div>
    </div>
  )
}
