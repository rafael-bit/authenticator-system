import { auth } from "@/services/auth"
import UserInfo from "@/app/app/_components/user-info"

export default async function App() {
	const session = await auth()

	return (
		<main className="flex items-center justify-center h-screen">
			<UserInfo user={session?.user} />
		</main>
	)
}