interface Body {
  course: API.Course
  activity: API.Activity
  uid: string
}

export default defineEventHandler(async (event) => {
  const { course, activity } = await readBody<Body>(event)

  const data = await event.context.cx.signByActivity(course, activity)

  return ResOp.success(data)
})

