export interface Account {
  uid: string
  username: string
  password: string
  info: CX.User
  cookies: Record<string, any>[]
  setting: Setting
  lastLoginTime: string
  courses: CX.Course[]
  activities: Activity[]
  selected: boolean
}

export interface Setting extends CX.Setting {

}

export interface Course extends CX.Course {
  isSigning?: boolean
  isLoadActivity?: boolean
}

export interface Activity extends CX.ActivityDetail {
  result?: string
}

export interface History {
  id: stringÏ
  activityName: string
  type: number
}
