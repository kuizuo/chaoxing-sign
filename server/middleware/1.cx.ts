import { Cookie } from 'tough-cookie'
import { CXMap, Cx } from '~~/server/protocol/cx'
import { prisma } from '~~/server/utils/db'

declare module 'h3' {
  interface H3EventContext {
    cx: Cx
  }
}

const exclude = ['/api/cx/login']

export default eventHandler(async (event) => {
  const { context, node: { req } } = event
  try {
    if (!req.url?.startsWith('/api/cx'))
      return

    if (exclude.includes(req.url))
      return

    const uid = (context.params?.uid || getQuery(event)?.uid || (await readBody(event))?.uid) as string

    if (!uid)
      return createError({ statusCode: 400, message: '请求账号不存在' })

    const cx = CXMap.get(uid)
    if (cx) {
      context.cx = cx
    }
    else {
      const account = await prisma.cxAccount.findUnique({ where: { uid } })

      const cx = new Cx(account!.info as unknown as CX.AccountInfo)
      for (const cookieStr of account!.cookies) {
        const cookie = Cookie.fromJSON(cookieStr as object)
        if (cookie) {
          const domain = `https://${cookie.domain}`
          await cx.cookieJar.setCookie(cookie!, domain)
        }
      }

      CXMap.set(uid, cx)
      context.cx = cx
    }
  }
  catch (error) {
    console.log(error)
    return createError({ statusCode: 400, message: '请求账号不存在' })
  }
})
