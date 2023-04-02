export default defineEventHandler(async (event) => {
  const result = await event.context.cx.oneClickSign()

  return ResOp.success(result)
})
