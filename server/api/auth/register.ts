export default defineEventHandler(async (event) => {
  // const { email, password, code } = await readBody(event) as { email: string; password: string; code: string }
  const { email, password } = await readBody(event) as { email: string; password: string }

  if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email))
    return ResOp.error(400, '邮箱格式不正确')

  const exists = await prisma.user.findUnique({
    where: {
      email,
    },
  })
  if (exists)
    return ResOp.error(400, 'User already exists')

  const user = await event.context.prisma.user.create({
    data: {
      email,
      name: email,
      password,
    },
  })

  return ResOp.success(user)
})
