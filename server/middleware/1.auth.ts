import { getServerSession } from '#auth'

export default eventHandler(async (event) => {
  const { context, node: { req } } = event

  if (!req.url?.startsWith('/api/cx'))
    return

  const session = await getServerSession(event)
  if (!session)
    throw createError({ statusCode: 401, message: '登录已过期,请重新登录' })
})
