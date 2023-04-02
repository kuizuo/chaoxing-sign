interface Body {
  course: API.Course
  uid: string
}

export default defineEventHandler(async (event) => {
  const { course } = await readBody<Body>(event)

  const data = await event.context.cx.signByCourse(course)

  if (data.length > 0) {
    await event.context.prisma.signLog.createMany({
      data: data.map(item => ({
        id: `${item.activity.id}_${event.context.cx.user.uid}`,
        activityId: String(item.activity.id),
        isSigned: item.result === '签到成功',
        result: item.result,
        time: new Date(),
        accountId: event.context.cx.user.uid,
      })),
      skipDuplicates: true,
    })
  }

  return ResOp.success(data)
})

