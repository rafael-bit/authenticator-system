import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Nodemailer from "next-auth/providers/nodemailer"
import { prisma } from "../database"

export const {handlers: { GET, POST }, auth, } = NextAuth({
	
	adapter: PrismaAdapter(prisma),
	providers: [
		Nodemailer({
			server: process.env.EMAIL_SERVER,
			from: process.env.EMAIL_FROM,
		}),
	],
	secret: process.env.NEXTAUTH_SECRET,
})