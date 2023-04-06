export enum ActivityTypeEnum {
  Sign = 2, // 签到
  Answer = 4, // 抢答
  Talk = 5, // 主题谈论
  Question = 6, // 投票
  Pick = 11, // 选人
  Homework = 19, // 作业
}

export const activityTypeMap: Record<number, string> = {
  [ActivityTypeEnum.Sign]: '签到',
  [ActivityTypeEnum.Answer]: '抢答',
  [ActivityTypeEnum.Talk]: '主题谈论',
  [ActivityTypeEnum.Question]: '投票',
  [ActivityTypeEnum.Pick]: '选人',
  [ActivityTypeEnum.Homework]: '作业',
}

export enum ActivityStatusEnum {
  Doing = 1,
  Done = 2,
}

export enum SignTypeEnum {
  Normal = 0, // 普通签到
  QRCode = 2, // 二维码签到
  Gesture = 3, // 手势签到
  Location = 4, // 位置签到
  Code = 5, // 签到码签到
}

export const signTypeMap: Record<number, string> = {
  0: '普通签到',
  2: '二维码签到',
  3: '手势签到 ',
  4: '位置签到',
  5: '签到码签到',
} as const

