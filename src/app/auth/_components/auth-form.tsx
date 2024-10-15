'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useForm } from 'react-hook-form'
import { signIn } from 'next-auth/react'
import { toast } from '@/hooks/use-toast'

export default function AuthForm() {
	const [email, setEmail] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')
	const [success, setSuccess] = useState(false)

	const form = useForm()

	const handleSubmit = form.handleSubmit(async (data) => {
		try {
			await signIn('email', { email: data.email, redirect: false })
			toast({
				title: 'Magic Link Sent',
				description: 'Check your email for the magic link to login'
			})
		} catch (err) {
			toast({
				title: 'Magic Link Error',
				description: 'Check your email for the magic link to login'
			})
		}

	})

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<Card className="w-[350px]">
				<CardHeader>
					<CardTitle>Sign In</CardTitle>
					<CardDescription>Use your email to sign in via Magic Link</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit}>
						<div className="grid w-full items-center gap-4">
							<div className="flex flex-col space-y-1.5">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="Enter your email"
									{... form.register('email')}
									required
								/>
							</div>
						</div>
					</form>
				</CardContent>
				<CardFooter className="flex flex-col">
					<Button
						className="w-full"
						onClick={handleSubmit}
						disabled={isLoading}
					>
						{isLoading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Sending Magic Link
							</>
						) : (
							'Send Magic Link'
						)}
					</Button>
					{error && (
						<Alert variant="destructive" className="mt-4">
							<AlertCircle className="h-4 w-4" />
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}
					{success && (
						<Alert className="mt-4">
							<AlertDescription>Magic link sent! Check your email.</AlertDescription>
						</Alert>
					)}
				</CardFooter>
			</Card>
		</div>
	)
}