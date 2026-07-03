import dns from 'node:dns/promises'
import { betterAuth } from 'better-auth'
import { mongodbAdapter } from 'better-auth/adapters/mongodb'
import { MongoClient } from 'mongodb'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { nextCookies } from 'better-auth/next-js'

dns.setServers(['1.1.1.1', '8.8.8.8'])

const client = new MongoClient(process.env.MONGODB_URI!)
const db = client.db()

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      prompt: 'select_account',
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 3600,
    },
  },
  plugins: [
    nextCookies(), // MUST be the last plugin in the array
  ],
})

export const getSession = async () => {
  const result = await auth.api.getSession({
    headers: await headers(),
  })

  return result
}

export const signOut = async () => {
  const result = await auth.api.signOut({
    headers: await headers(),
  })

  if (result.success) {
    redirect('/sign-in')
  }
}
