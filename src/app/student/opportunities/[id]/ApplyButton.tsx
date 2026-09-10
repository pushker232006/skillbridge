'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { applyForOpportunity } from './actions'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export function ApplyButton({ opportunityId, matchScore }: { opportunityId: string, matchScore: number }) {
    const [loading, setLoading] = useState(false)

    const handleApply = async () => {
        setLoading(true)
        const result = await applyForOpportunity(opportunityId)
        
        if (result.error) {
            toast.error(result.error)
            setLoading(false)
        } else {
            toast.success("Application submitted successfully!")
            // The page will revalidate and show the "Applied" status card
        }
    }

    return (
        <div className="flex flex-col items-center gap-2">
            <Button size="lg" className="w-full md:w-48 text-base" onClick={handleApply} disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Apply Now
            </Button>
            {matchScore < 50 && (
                <span className="text-xs text-slate-500 text-center max-w-[200px]">
                    Your match score is low. Consider improving your skills first.
                </span>
            )}
        </div>
    )
}
