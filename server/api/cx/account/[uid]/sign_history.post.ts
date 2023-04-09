export default defineEventHandler(async (event) => {
  const logs = await event.context.prisma.signLog.findMany({
    where: {
      accountId: event.context.cx.user.uid,
    },
  })

  return ResOp.success(logs)
})
