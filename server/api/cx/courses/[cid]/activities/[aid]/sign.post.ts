import type { Activity, Course } from '~/types/account'

interface Body {
  course: Course
  activity: Activity
  uid: string
}

export default defineEventHandler(async (event) => {
  const { course, activity } = await readBody<Body>(event)

  const data = await event.context.cx.signByActivity(course, activity)

  return ResOp.success(data)
})
