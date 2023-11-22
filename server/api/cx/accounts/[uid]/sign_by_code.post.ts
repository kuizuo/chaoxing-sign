import { ActivityStatusEnum, ActivityTypeEnum, SignMode } from '~/constants/cx'

interface Body {
  uid: string
  courseId: number
  activityId: number
  signCode: string
}

export default defineEventHandler(async (event) => {
  const { courseId, activityId, signCode } = await readBody<Body>(event)

  const activity = await event.context.cx.getActivityDetail(activityId)

  if (!activity)
    return ResOp.error(204, '活动不存在')

  if (!(activity.activeType === ActivityTypeEnum.Sign && activity.status === ActivityStatusEnum.Doing)) {
    return ResOp.success({
      activity,
      result: '不是签到活动或活动已结束',
    })
  }

  const course = {
    classId: activity.clazzId,
    courseId,
  }

  const status = await event.context.cx.preSign(course as unknown as CX.Course, activity)

  let result = ''
  if (status)
    result = status

  else
    result = await event.context.cx.signCode(activity, signCode)

  await event.context.prisma.signLog.create({
    data: {
      activityId: String(activity.id),
      activityName: activity.name,
      type: activity.otherId,
      mode: SignMode.Manual,
      result,
      time: new Date(),
      accountId: event.context.cx.user.uid,
    },
  })

  return ResOp.success({
    activity,
    result,
  })
})
