import { SignMode } from '~~/constants/cx'

interface Body {
  uid: string
  setting: CX.Setting
}

export default defineEventHandler(async (event) => {
  const { setting } = await readBody<Body>(event)

  const signResults = await event.context.cx.oneClickSign(setting)

  for (const data of signResults) {
    const { activity, result } = data

    await event.context.prisma.signLog.create({
      data: {
        activityId: String(activity.id),
        activityName: activity.name,
        type: Number(activity.otherId),
        result,
        time: new Date(),
        mode: SignMode.Manual,
        accountId: event.context.cx.user.uid,
      },
    })
  }

  return ResOp.success(signResults)
})
