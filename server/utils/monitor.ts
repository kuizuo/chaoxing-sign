import { sleep } from '@kuizuo/utils'
import type { CxAccount } from '@prisma/client'
import type { EasemobChat } from 'easemob-websdk'
import { ActivityTypeEnum, SignMode } from '~/constants/cx'
import { Cx } from '~~/server/protocol/cx'

import { IMConnectionMap, createIMConnection } from '~~/server/protocol/easemob'

export async function handleMessage(message: EasemobChat.TextMsgBody, cx: Cx) {
  if (!message?.ext?.attachment)
    return

  const chatCourse = message.ext.attachment?.att_chat_course as CX.AttChatCourse

  // 如果是签到任务，则进行处理
  if (chatCourse.atype === ActivityTypeEnum.Sign) {
    const activity = await cx.getActivityDetail(chatCourse.aid)
    // const activity = { id: chatCourse.aid }
    const course = {
      courseId: chatCourse.courseInfo.courseid,
      classId: chatCourse.courseInfo.classid,
      name: chatCourse.courseInfo.coursename,
      image: chatCourse.courseInfo.imageUrl,
      teacher: chatCourse.courseInfo.teacherfactor,
    } as any

    await sleep(cx.setting?.delay || Math.floor(Math.random() * (8000 - 3000 + 1) + 3000))

    const result = await cx.handleSign(course, activity, cx.setting)

    console.log(`课程: ${course.name} 活动: ${activity.name} 签到结果: ${result}`)

    await prisma.signLog.create({
      data: {
        activityId: String(activity.id),
        activityName: activity.name,
        type: activity.otherId,
        result,
        time: new Date(),
        mode: SignMode.Auto,
        accountId: cx.user.uid,
      },
    })
  }
}

export async function handleListen(client: EasemobChat.Connection, cx: Cx, account: CxAccount): Promise<void> {
  await new Promise((resolve, reject) => {
    client.listen({
      onOpened: async () => {
        console.log(cx.user.username, account.setting)
        await prisma.cxAccount.update({
          where: {
            uid: cx.user.uid,
          },
          data: {
            setting: {
              ...(account.setting as any),
              monitor: true,
            },
          },
        })
        IMConnectionMap.set(cx.user.uid, client)
        resolve(true)
      },
      onClosed: async () => {
        // retry connect
        // 如果用户在监听中更改设置后，然后在关闭监听时会导致 account 获取的是未设置前的数据
        // 因此这里重新从数据库中获取 新的 account 信息
        const account = await prisma.cxAccount.findUnique({
          where: {
            uid: cx.user.uid,
          },
        })

        try {
          await handleListen(client, cx, account)
        }
        catch (error) {
          await prisma.cxAccount.update({
            where: {
              uid: cx.user.uid,
            },
            data: {
              setting: {
                ...(account.setting as any),
                monitor: false,
              },
            },
          })
          IMConnectionMap.delete(cx.user.uid)
        }
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
        path: ['monitor'],
        equals: true,
      },
    },
  })

  for await (const account of toMonitorAccounts) {
    const cx = new Cx({ username: account.username, password: account.password })

    await cx.login()

    await prisma.cxAccount.update({
      where: {
        uid: cx.user.uid,
      },
      data: {
        lastLoginTime: new Date(),
      },
    })

    const { uid, token } = await cx.getWebIM()

    const client = await createIMConnection()
    await client.open({
      user: uid,
      accessToken: token,
    })

    await handleListen(client, cx, account)
  }

  return toMonitorAccounts
}
