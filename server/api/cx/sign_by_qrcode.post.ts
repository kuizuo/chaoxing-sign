interface Body {
  uid: string
  activityId: number
  enc: string
}

export default defineEventHandler(async (event) => {
  const { activityId, enc } = await readBody<Body>(event)

  const result = await event.context.cx.signQrCode({ id: activityId } as CX.Activity, enc)

  return ResOp.success({
    result,
  })
})

