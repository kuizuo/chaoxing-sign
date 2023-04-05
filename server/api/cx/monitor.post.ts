import type { EasemobChat } from 'easemob-websdk'
import { ActivityTypeEnum, Cx } from '~~/server/protocol/cx'

import { IMConnectionMap, createIMConnection } from '~~/server/protocol/easemob'

const handleMessage = async (message: EasemobChat.TextMsgBody, cx: Cx) => {
  console.log(message)

  if (!message?.ext?.attachment)
    return

  const chatCourse = message.ext.attachment?.att_chat_course as CX.AttChatCourse

  // 如果是签到任务，则进行处理
  if (chatCourse.atype === ActivityTypeEnum.Sign) {
    const activity = await cx.getActiveInfo(chatCourse.aid)
    // const activity = { id: chatCourse.aid }
    const course = {
      courseId: chatCourse.courseInfo.courseid,
      classId: chatCourse.courseInfo.classid,
      name: chatCourse.courseInfo.coursename,
      image: chatCourse.courseInfo.imageUrl,
      teacher: chatCourse.courseInfo.teacherfactor,
    } as any

    const result = await cx.handleSign(course, activity)

    console.log(`课程: ${course.name} 活动: ${activity.name} 签到结果: ${result}`)
  }
}

const handleListen = async (client: EasemobChat.Connection, cx: Cx): Promise<void> => {
  await new Promise((resolve, reject) => {
    client.listen({
      onOpened: async () => {
        await prisma.cxAccount.update({
          where: {
            uid: cx.user.uid,
          },
          data: {
            setting: {
              monitor: true,
            },
          },
        })
        IMConnectionMap.set(cx.user.uid, client)
        resolve(true)
      },
      onClosed: async () => {
        await prisma.cxAccount.update({
          where: {
            uid: cx.user.uid,
          },
          data: {
            setting: {
              monitor: false,
            },
          },
        })
        IMConnectionMap.delete(cx.user.uid)
      },
      onError: (error) => {
        reject(error)
      },
      onTextMessage: async (message) => {
        await handleMessage(message, cx)
      },
    })
  })
}

async function initIMConnection() {
  const toMonitorAccounts = await prisma.cxAccount.findMany({
    where: {
      setting: {
        equals: { monitor: true },
      },
    },
  })

  for await (const account of toMonitorAccounts) {
    const cx = new Cx({ username: account.username, password: account.password })

    await cx.login()

    const { uid, token } = await cx.getWebIM()

    const client = createIMConnection()
    await client.open({
      user: uid,
      accessToken: token,
    })

    await handleListen(client, cx)
  }
}

initIMConnection().then()

export default defineEventHandler(async (event) => {
  const hasMonitor = await event.context.prisma.cxAccount.findFirst({
    where: {
      uid: event.context.cx.user.uid,
      setting: {
        equals: {
          monitor: true,
        },
      },
    },
  })

  if (hasMonitor) {
    return ResOp.success({
      data: {
        isOpened: true,
      },
    }, '已监听')
  }

  const { uid, token } = await event.context.cx.getWebIM()

  const client = createIMConnection()

  await client.open({
    user: uid,
    accessToken: token,
  })

  await handleListen(client, event.context.cx)

  const isOpened = client.isOpened()

  return ResOp.success({
    data: {
      isOpened,
    },
  })
})
