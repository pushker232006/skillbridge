import { Card, CardContent } from '@/components/ui/card'
import { LineChart } from 'lucide-react'

export default function InstitutionAnalyticsPage() {
    return (
        <div className="space-y-6 max-w-5xl">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
                <p className="text-slate-500 mt-2">Monitor your institution's placement metrics and skill alignments.</p>
            </div>

            <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                    <div className="bg-primary/10 p-4 rounded-full mb-4">
                        <LineChart className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Analytics Coming Soon</h2>
                    <p className="text-slate-500">We are processing your students' data to bring you actionable insights.</p>
                </CardContent>
            </Card>
        </div>
    )
}
