'use client'

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Session } from "next-auth"
import { signOut } from "next-auth/react"

type Props = {
	user: Session['user']
}

export default function UserInfo({ user }: Props) {
	if (!user) { return <h1>User Not Found</h1> }

	return (
		<div className="flex flex-col items-center justify-center space-y-4">
			<Avatar>
				<AvatarFallback>
					CN
				</AvatarFallback>
			</Avatar>
			<span>{user?.email}</span>
			<Button onClick={() => signOut()}>Sign Out</Button>
		</div>
	)
}