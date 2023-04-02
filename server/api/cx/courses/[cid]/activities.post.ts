interface Body {
  course: API.Course
  uid: string
}

export default defineEventHandler(async (event) => {
  const { course } = await readBody<Body>(event)

  const result = await event.context.cx.getActivity(course)

  return {
    code: 200,
    message: 'success',
    data: result,
  }
})

