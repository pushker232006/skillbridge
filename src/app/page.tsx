import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { GraduationCap, ArrowRight, Briefcase, BookOpen, LineChart } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white">
        <Link className="flex items-center justify-center space-x-2" href="/">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="font-bold text-xl tracking-tight">SkillBridge</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link className="text-sm font-medium hover:underline underline-offset-4 text-slate-600 hidden sm:block" href="#">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4 text-slate-600 hidden sm:block" href="#">
            Institutions
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4 text-slate-600 hidden sm:block" href="#">
            Industry
          </Link>
          <Link href="/login">
            <Button variant="ghost" className="text-sm font-medium">Log in</Button>
          </Link>
          <Link href="/register">
            <Button className="text-sm font-medium">Get Started</Button>
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 flex items-center justify-center">
          <div className="container px-4 md:px-6 text-center max-w-4xl mx-auto space-y-8">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-slate-900">
              Bridge the gap between <span className="text-primary">academia</span> and <span className="text-teal-600">industry</span>.
            </h1>
            <p className="mx-auto max-w-[700px] text-slate-500 md:text-xl leading-relaxed">
              SkillBridge connects students, institutions, and industry through intelligent skill mapping, career opportunities, learning programs, and meaningful collaboration.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto text-base">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-base bg-white">
                  Explore Opportunities
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-white">
        <p className="text-xs text-slate-500">© 2024 SkillBridge. All rights reserved. SIH MVP.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4 text-slate-500" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4 text-slate-500" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}
