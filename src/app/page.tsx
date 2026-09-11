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
          <Link className="text-sm font-medium hover:underline underline-offset-4 text-slate-600 hidden sm:block" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4 text-slate-600 hidden sm:block" href="#institutions">
            Institutions
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4 text-slate-600 hidden sm:block" href="#industry">
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

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-slate-50 border-t">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12 text-slate-900">Key Features</h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center text-center space-y-4 p-6 bg-white rounded-xl shadow-sm border border-slate-100">
                <div className="p-4 bg-primary/10 rounded-full">
                  <LineChart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Skill Mapping</h3>
                <p className="text-slate-500">AI-driven analysis to align student skills with current industry requirements.</p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4 p-6 bg-white rounded-xl shadow-sm border border-slate-100">
                <div className="p-4 bg-teal-600/10 rounded-full">
                  <Briefcase className="h-8 w-8 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Career Opportunities</h3>
                <p className="text-slate-500">Direct access to internships, projects, and full-time roles from top companies.</p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4 p-6 bg-white rounded-xl shadow-sm border border-slate-100">
                <div className="p-4 bg-blue-600/10 rounded-full">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Learning Programs</h3>
                <p className="text-slate-500">Industry-certified courses and workshops to bridge the knowledge gap.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Institutions Section */}
        <section id="institutions" className="w-full py-12 md:py-24 lg:py-32 bg-white border-t">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-slate-100 px-3 py-1 text-sm font-medium text-slate-900">For Institutions</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-slate-900">Empower your students for the modern workforce.</h2>
                <p className="text-slate-500 md:text-lg">
                  Partner with industry leaders to align your curriculum with market needs. Track student progress, manage placements, and foster meaningful corporate relations.
                </p>
                <Link href="/register?type=institution">
                  <Button className="mt-4">Register as Institution</Button>
                </Link>
              </div>
              <div className="mx-auto w-full max-w-[500px] h-[300px] bg-slate-50 rounded-xl flex items-center justify-center border border-slate-200">
                <GraduationCap className="h-24 w-24 text-slate-300" />
              </div>
            </div>
          </div>
        </section>

        {/* Industry Section */}
        <section id="industry" className="w-full py-12 md:py-24 lg:py-32 bg-slate-50 border-t">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="mx-auto w-full max-w-[500px] h-[300px] bg-white rounded-xl flex items-center justify-center border border-slate-200 lg:order-first order-last">
                <Briefcase className="h-24 w-24 text-slate-300" />
              </div>
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-teal-600/10 px-3 py-1 text-sm font-medium text-teal-700">For Industry</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-slate-900">Discover and train your future talent.</h2>
                <p className="text-slate-500 md:text-lg">
                  Access a verified pool of skilled students. Post projects, offer internships, and collaborate with institutions to shape the talent you need.
                </p>
                <Link href="/register?type=industry">
                  <Button className="mt-4 bg-teal-600 hover:bg-teal-700 text-white">Partner with Us</Button>
                </Link>
              </div>
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
