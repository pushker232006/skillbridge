'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { updateApplicationStatus } from '../opportunities/actions'
import { Loader2 } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'

export function StatusActions({ applicationId, currentStatus }: { applicationId: string, currentStatus: string }) {
    const [loading, setLoading] = useState(false)

    const handleUpdate = async (newStatus: string) => {
        setLoading(true)
        const result = await updateApplicationStatus(applicationId, newStatus)
        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success(`Candidate marked as ${newStatus}`)
        }
        setLoading(false)
    }

    if (loading) {
        return <Button disabled size="sm" variant="outline"><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Updating...</Button>
    }

    if (currentStatus === 'Applied') {
        return (
            <div className="space-x-2">
                <Button size="sm" variant="destructive" onClick={() => handleUpdate('Rejected')}>Reject</Button>
                <Button size="sm" onClick={() => handleUpdate('Under Review')}>Review Application</Button>
            </div>
        )
    }

    if (currentStatus === 'Under Review') {
        return (
            <div className="space-x-2">
                <Button size="sm" variant="destructive" onClick={() => handleUpdate('Rejected')}>Reject</Button>
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => handleUpdate('Shortlisted')}>Shortlist</Button>
            </div>
        )
    }

    if (currentStatus === 'Shortlisted') {
        return (
            <div className="space-x-2">
                <Button size="sm" variant="destructive" onClick={() => handleUpdate('Rejected')}>Reject</Button>
                <Button size="sm" variant="outline" onClick={() => handleUpdate('Interview')}>Schedule Interview</Button>
            </div>
        )
    }

    if (currentStatus === 'Interview') {
        return (
            <div className="space-x-2">
                <Button size="sm" variant="destructive" onClick={() => handleUpdate('Rejected')}>Reject</Button>
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => handleUpdate('Selected')}>Select Candidate</Button>
            </div>
        )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3">
                Update Status
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleUpdate('Under Review')}>Under Review</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleUpdate('Shortlisted')}>Shortlisted</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleUpdate('Interview')}>Interview</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleUpdate('Selected')}>Selected</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleUpdate('Rejected')} className="text-rose-600">Rejected</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
