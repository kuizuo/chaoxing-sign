declare namespace API {

  interface Account {
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

  interface Setting extends CX.Setting {

  }

  interface Course extends CX.Course {
    isSigning?: boolean
    isLoadActivity?: boolean
  }

  interface Activity extends CX.ActivityDetail {
    result?: string
  }

  interface History {
    id: string
    activityName: string
    type: number
  }
}
