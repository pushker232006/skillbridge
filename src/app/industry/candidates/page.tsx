import { Card, CardContent } from '@/components/ui/card'
import { UserCircle } from 'lucide-react'

export default function IndustryCandidatesPage() {
    return (
        <div className="space-y-6 max-w-5xl">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Candidates Database</h1>
                <p className="text-slate-500 mt-2">Search and discover talented students based on their verified skills.</p>
            </div>

            <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                    <div className="bg-primary/10 p-4 rounded-full mb-4">
                        <UserCircle className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Candidate Search Coming Soon</h2>
                    <p className="text-slate-500">We are currently building out the intelligent candidate matching and search system.</p>
                </CardContent>
            </Card>
        </div>
    )
}
