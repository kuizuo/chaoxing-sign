import { sleep } from '@kuizuo/utils'
import type { EasemobChat } from 'easemob-websdk'
import { ActivityTypeEnum } from '~~/constants/cx'
import { Cx } from '~~/server/protocol/cx'

import { IMConnectionMap, createIMConnection } from '~~/server/protocol/easemob'

export const handleMessage = async (message: EasemobChat.TextMsgBody, cx: Cx) => {
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

    await sleep(cx.setting?.delay || Math.floor(Math.random() * (8000 - 3000 + 1) + 3000))

    const result = await cx.handleSign(course, activity, cx.setting?.signType.map(t => Number(t)))

    console.log(`课程: ${course.name} 活动: ${activity.name} 签到结果: ${result}`)

    await prisma.signLog.create({
      data: {
        activityId: String(activity.id),
        activityName: activity.name,
        type: activity.otherId,
        result,
        time: new Date(),
        mode: SignMode.Manual,
        accountId: cx.user.uid,
      },
    })
  }
}

export const handleListen = async (client: EasemobChat.Connection, cx: Cx): Promise<void> => {
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

export async function initIMConnection() {
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

    const client = await createIMConnection()
    await client.open({
      user: uid,
      accessToken: token,
    })

    await handleListen(client, cx)
  }
}

const previousGlobalThis: any = { ...globalThis }
initIMConnection().then(() => {
  Object.keys(global).forEach((k) => {
    if (previousGlobalThis[k])
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      global[k] = previousGlobalThis[k]
  })
})
