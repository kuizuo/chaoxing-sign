import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)

  const accounts = await event.context.prisma.cxAccount.findMany({
    where: {
      User: {
        id: session!.uid,
      },
    },
    select: {
      uid: true,
      username: true,
      info: true,
      courses: true,
      setting: true,
      lastLoginTime: true,
      signlogs: true,
    },
  })

  return ResOp.success(accounts)
})
