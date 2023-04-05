
declare namespace CX {

  interface Setting {
    monitor: boolean
    // signType: Array<>
    longitude: string
    latitude: string
  }

  interface Account {
    uid: string
    username: string
    password: string
    info: AccountInfo
    cookies: Record<string, any>[]
    setting: Setting
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
    otherId: number | string
    groupId: number
    source: number
    isLook: number
    type: number
    releaseNum: number
    attendNum: number
    activeType: number
    logo: string
    name: string
    nameOne: string
    nameTwo: string
    nameFour: string
    startTime: number
    id: number
    endTime: number
    status: number
  }
  
  interface AttChatCourse {
    aid: number
    atype: number
    atypeName: string
    courseInfo: {
      bbsid: string
      classid: number
      courseid: string
      coursename: string
      imageUrl: string
      isthirdaq: string
      teacherfactor: string
    }
    logo: string
    msgStatus: number
    pcUrl: string
    subTitle: string
    title: string
    toolbarType: number
    type: number
    url: string
  }

  interface SignLocation {
    latitude: string
    longitude: string
  }

  interface ActivityListResponse extends Response<{
    ext: {
      _from_: string
    }
    readingDuration: number
    activeList: Activity[]
  }> {}

  interface Response<T> {
    result: number
    msg: any
    data: T
    errorMsg: any
  }
}
