interface Body {
  uid: string
  setting: API.Setting
}

export default defineEventHandler(async (event) => {
  const { setting } = await readBody<Body>(event)

  const account = await event.context.prisma.cxAccount.findUnique({
    where: {
      uid: event.context.cx.user.uid,
    },
  })

  if (!account)
    return ResOp.error(204, '账号不存在')

  const result = await event.context.prisma.cxAccount.update({
    where: {
      uid: event.context.cx.user.uid,
    },
    data: {
      setting: setting as any,
    },
  })

  return ResOp.success(result.setting as unknown as API.Setting)
})
