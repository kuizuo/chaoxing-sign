import CredentialsProvider from 'next-auth/providers/credentials'
import { NuxtAuthHandler } from '#auth'
import { prisma } from '~~/server/utils/db'

interface Credentials {
  email: string
  password: string
}

export default NuxtAuthHandler({
  secret: process.env.AUTH_SECRET || 'chaoxing-sing-123',
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
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: Credentials) {
        if (!credentials.email || !credentials.password) {
          throw createError({
            statusCode: 403,
            statusMessage: '账号或密码错误',
          })
        }

        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email,
            password: credentials.password,
          },
        })

        if (!user) {
          throw createError({
            statusCode: 403,
            statusMessage: '邮箱或密码错误',
          })
        }

        return user
      },
    }),
  ],
  pages: {
    signIn: '/auth/login',
  },
})
