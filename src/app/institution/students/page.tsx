import { Card, CardContent } from '@/components/ui/card'
import { Users } from 'lucide-react'

export default function InstitutionStudentsPage() {
    return (
        <div className="space-y-6 max-w-5xl">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Student Directory</h1>
                <p className="text-slate-500 mt-2">Manage your enrolled students and track their progress.</p>
            </div>

            <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                    <div className="bg-primary/10 p-4 rounded-full mb-4">
                        <Users className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Student Directory Coming Soon</h2>
                    <p className="text-slate-500">The student management portal is currently under construction.</p>
                </CardContent>
            </Card>
        </div>
    )
}
