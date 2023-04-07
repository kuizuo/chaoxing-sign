import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
  const cx = event.context.cx
  const session = await getServerSession(event)

  const exist = await event.context.prisma.cxAccount.findFirst({
    where: {
      uid: cx.user.uid,
      userId: session?.uid,
    },
  })

  if (!exist)
    return ResOp.error(201, '账号不存在')

  const account = await event.context.prisma.cxAccount.update({
    where: {
      uid: cx.user.uid,
    },
    data: {
      setting: defaultSetting as any,
    },
  })

  return ResOp.success(account.setting)
})
