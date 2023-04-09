import { SignMode } from '~~/constants/cx'

interface Body {
  uid: string
  signType: number[]
}

export default defineEventHandler(async (event) => {
  const { signType } = await readBody<Body>(event)

  const signResult = await event.context.cx.oneClickSign(signType)

  for (const data of signResult) {
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

  return ResOp.success(signResult)
})
