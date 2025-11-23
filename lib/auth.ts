import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { prisma } from './db'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('אימייל וסיסמה נדרשים')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            batches: {
              include: {
                batch: true,
              },
            },
          },
        })

        if (!user) {
          throw new Error('משתמש לא נמצא')
        }

        const isValid = await compare(credentials.password, user.passwordHash)

        if (!isValid) {
          throw new Error('סיסמה שגויה')
        }

        // Auto-associate with default batch if not already
        let batchId = user.batches[0]?.batchId
        if (!batchId) {
          try {
            const defaultBatch = await prisma.batch.findFirst({
              where: { id: 'hadera-2003' },
            })
            if (defaultBatch) {
              await prisma.userBatch.create({
                data: {
                  userId: user.id,
                  batchId: defaultBatch.id,
                },
              })
              batchId = defaultBatch.id
            }
          } catch (e) {
            // Batch association already exists or other error
            console.log('Batch association error:', e)
          }
        }

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          firstName: user.firstName,
          lastName: user.lastName,
          batchId: batchId || 'hadera-2003',
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.firstName = user.firstName
        token.lastName = user.lastName
        token.batchId = user.batchId
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.firstName = token.firstName as string
        session.user.lastName = token.lastName as string
        session.user.batchId = token.batchId as string | null
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}
