import CredentialsProvider from 'next-auth/providers/credentials'
import { NuxtAuthHandler } from '#auth'
import { prisma } from '~~/server/utils/db'

interface Credentials {
  username: string
  password: string
}

export default NuxtAuthHandler({
  secret: process.env.NUXT_SECRET,
  callbacks: {
    jwt: async ({ token, user }) => {
      const isSignIn = !!user
      if (isSignIn) {
        const { access_token, id, role } = user as any
        token.jwt = access_token || ''
        token.id = id || ''
        token.role = role || ''
      }
      return Promise.resolve(token)
    },
    session: async ({ session, token }) => {
      (session as any).role = token.role;
      (session as any).uid = token.id
      return Promise.resolve(session)
    },
  },
  providers: [
    // @ts-expect-error Import is exported on .default during SSR, so we need to call it this way. May be fixed via Vite at some point
    CredentialsProvider.default({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: Credentials) {
        const user = await prisma.user.findFirst({
          where: {
            name: credentials.username,
            password: credentials.password,
          },
        })

        if (!user) {
          throw createError({
            statusCode: 403,
            statusMessage: 'Invalid credentials',
          })
        }

        return user
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
})
