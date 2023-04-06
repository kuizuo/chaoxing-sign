interface Body {
  uid: string
  activityId: number
  enc: string
}

export default defineEventHandler(async (event) => {
  const { activityId, enc } = await readBody<Body>(event)

  const activity = await event.context.cx.getActiveInfo(activityId)

  if (!activity)
    return ResOp.error(204, '活动不存在')

  const course = {
    classId: activity.clazzid,
  }

  await event.context.cx.preSign(course as unknown as CX.Course, activity)
  const result = await event.context.cx.signQrCode(activity, enc)

  return ResOp.success({
    activity,
    result,
  })
})

