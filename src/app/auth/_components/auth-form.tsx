'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AlertCircle, Loader2, Github } from "lucide-react"
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
		setIsLoading(true)
		try {
			const res = await signIn('email', { email: data.email, redirect: false })
			if (res?.ok) {
				setSuccess(true)
				toast({
					title: 'Magic Link Sent',
					description: 'Check your email for the magic link to login'
				})
			} else {
				setError('There was a problem sending the magic link.')
			}
		} catch (err) {
			setError('Error occurred while sending the magic link.')
		} finally {
			setIsLoading(false)
		}
	})

	const handleProviderLogin = async (provider: string) => {
		setIsLoading(true)
		try {
			const result = await signIn(provider, { redirect: false })

			if (result?.error) {
				handleLoginError(result.error, provider)
			} else {
				toast({
					title: "Login successful",
					description: `You have successfully logged in with ${provider}.`,
				})
			}
		} catch (err) {
			toast({
				title: `Error occurred with ${provider} login`,
				description: "An unexpected error occurred. Please try again later.",
			})
		} finally {
			setIsLoading(false)
		}
	}

	const handleLoginError = (error: string, provider: string) => {
		if (error.includes("OAuthAccountNotLinked")) {
			toast({
				title: "Account not linked",
				description: `There is an existing account with the same email, but it's not linked to ${provider}. Please try logging in with the correct provider.`
			})
		} else if (error.includes("OAuthSignin")) {
			toast({
				title: "Failed to sign in",
				description: `Failed to sign in with ${provider}. Please try again later.`
			})
		} else if (error.includes("OAuthCallback")) {
			toast({
				title: "Authentication Error",
				description: `Something went wrong during the authentication callback with ${provider}.`
			})
		} else {
			toast({
				title: "Unknown Error",
				description: `An unknown error occurred during ${provider} login. Please try again later.`
			})
		}
	}

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-white via-gray-400 to-gray-900">
			<Card className='flex flex-col md:flex-row w-3/5 border-none shadow-2xl'>
				<div className=' md:p-16 flex flex-col justify-center relative z-20'>
					<CardHeader>
						<CardTitle className='text-2xl text-center'>Login</CardTitle>
						<CardDescription className='text-center'>Enter your email to sign in via Magic Link to use your account</CardDescription>
					</CardHeader>
					<CardContent>
						<div>
							<Button
								className="w-full mb-3 hover:bg-black hover:text-white"
								variant="outline"
								onClick={() => handleProviderLogin('github')}
								disabled={isLoading}
							>
								<Github className="mr-2 h-4 w-4" />
								Continue with GitHub
							</Button>
							<Button
								className="w-full hover:bg-black hover:text-white"
								variant="outline"
								onClick={() => handleProviderLogin('google')}
								disabled={isLoading}
							>
								<svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
									<path
										fill="currentColor"
										d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
									/>
									<path
										fill="currentColor"
										d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
									/>
									<path
										fill="currentColor"
										d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
									/>
									<path
										fill="currentColor"
										d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
									/>
								</svg>
								Continue with Google
							</Button>
						</div>
						<div className="relative my-5">
							<div className="absolute inset-0 flex items-center">
								<span className="w-full border-t"></span>
							</div>
							<div className="relative flex justify-center text-xs uppercase">
								<span className="bg-background px-2 text-muted-foreground">Or continue with</span>
							</div>
						</div>
						<form onSubmit={handleSubmit}>
							<div className="grid w-full items-center gap-4 mt-4">
								<div className="flex flex-col space-y-1.5">
									<Label htmlFor="email">Email</Label>
									<Input
										id="email"
										type="email"
										placeholder="Enter your email"
										{...form.register('email')}
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
				</div>
				<img alt="About image" width="1000" height="1000" className="w-[50%] min-[1800px]:min-w-[700px] max-[950px]:hidden object-cover rounded-r-lg z-20" src="/3d-background.png"/>
			</Card>
			<div className="w-6/12 -mt-2 bg-white opacity-65 shadow-lg p-4 rounded-b-lg z-10">
			</div>
			<div className="w-5/12 bg-white opacity-50 shadow-lg p-4 rounded-b-lg">
			</div>
		</div>
	)
}