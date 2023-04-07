interface Body {
  uid: string
  signType: number[]
}

export default defineEventHandler(async (event) => {
  const { signType } = await readBody<Body>(event)

  const result = await event.context.cx.oneClickSign(signType)

  return ResOp.success(result)
})
