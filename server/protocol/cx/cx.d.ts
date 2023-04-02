
declare namespace CX {
  interface Account {
    uid: string
    username: string
    password: string
    info: AccountInfo
    cookies: Record<string, any>[]
    lastLoginTime: string
    courses: Course[]
    activities: Activity[]
  }

  interface AccountWithoutPassword extends Omit<Account, 'password'> { }

  interface AccountInfo {
    username: string
    password: string
    logged?: boolean
    school?: string
    realname?: string
    uid: string
    schoolid?: string
    avatar?: string
    siteName?: string
  }

  interface LoginResult {
    // sucess
    uname: string;
    roleid: string;
    opacPwd: boolean;
    realname: string;
    result: boolean;
    uid: number;
    dxfid: number;
    phone: string;
    schoolid: number;
    cxid: number;
    email: string;
    isCertify: number;
    status: string;

    // error
    errorMsg: string
  }

  interface Course {
    name: string
    courseId: string
    classId: string
    cpi: string
    image: string
    link: string
  }

  interface Activity {
    activityList: any
    userStatus: number
    nameTwo: string
    otherId: string
    groupId: number
    source: number
    isLook: number
    type: number
    releaseNum: number
    attendNum: number
    activeType: number
    logo: string
    nameOne: string
    startTime: number
    id: number
    endTime: number
    status: number
    nameFour: string
  }


  interface SignLocation {
    latitude: string
    longitude: string
  }

  interface ActivityResponse {
    result: number
    msg: any
    data: {
      ext: {
        _from_: string
      }
      readingDuration: number
      activeList: Activity[]
    }
    errorMsg: any
  }
}
