'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createOpportunity } from '../actions'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CreateOpportunityPage() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setError(null)
        const result = await createOpportunity(formData)
        if (result?.error) {
            setError(result.error)
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center space-x-2 text-sm text-slate-500 mb-6">
                <Link href="/industry/opportunities" className="hover:underline">Opportunities</Link>
                <span>/</span>
                <span className="text-slate-900">Create New</span>
            </div>

            <div>
                <h1 className="text-3xl font-bold tracking-tight">Create Opportunity</h1>
                <p className="text-slate-500 mt-2">Publish a new internship or job opening for students.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Opportunity Details</CardTitle>
                    <CardDescription>Provide clear requirements to get the best candidate matches.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" name="title" placeholder="e.g. Frontend Developer Intern" required />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="type">Type</Label>
                                <Select name="type" required defaultValue="Internship">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Internship">Internship</SelectItem>
                                        <SelectItem value="Full-time">Full-time Job</SelectItem>
                                        <SelectItem value="Live Project">Live Project</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input id="location" name="location" placeholder="e.g. Bangalore" required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="stipend">Stipend / Salary</Label>
                                <Input id="stipend" name="stipend" placeholder="e.g. ₹15,000/month or Unpaid" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="duration">Duration</Label>
                                <Input id="duration" name="duration" placeholder="e.g. 6 Months" />
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 border p-4 rounded-lg bg-slate-50">
                            <input type="checkbox" id="remote" name="remote" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                            <Label htmlFor="remote" className="font-medium cursor-pointer">This is a remote opportunity</Label>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="skills">Required Skills (Comma separated)</Label>
                            <Input id="skills" name="skills" placeholder="e.g. React, Node.js, Git, Communication" />
                            <p className="text-xs text-slate-500">These skills will be used by our matching engine to recommend the best candidates.</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description & Responsibilities</Label>
                            <Textarea id="description" name="description" rows={5} placeholder="Describe the role, responsibilities, and what the student will learn..." required />
                        </div>

                        {error && <div className="text-sm font-medium text-destructive">{error}</div>}

                        <div className="flex justify-end space-x-4 border-t pt-4">
                            <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>Cancel</Button>
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Publish Opportunity
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
