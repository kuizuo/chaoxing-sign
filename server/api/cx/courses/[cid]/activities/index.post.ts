import type { Course } from '~/types/account'

interface Body {
  course: Course
  uid: string
}

export default defineEventHandler(async (event) => {
  const { course } = await readBody<Body>(event)

  const result = await event.context.cx.getActivityList(course)

  return ResOp.success(result)
})
