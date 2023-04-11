declare namespace CX {
  interface User {
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

  interface Setting {
    signType: (string | number)[]
    // courseIds: string[]
    location: {
      latitude: string
      longitude: string
    }
    monitor: boolean
    delay: number
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

  interface Time {
    date: number;
    day: number;
    hours: number;
    minutes: number;
    month: number;
    seconds: number;
    time: number;
    timezoneOffset: number;
    year: number;
  }

  interface ActivityDetail {
    activeSort: number;
    activeType: number;
    activityTranMode: number;
    attendNum: number;
    bsid: number;
    chartId: string;
    clazzId: number;
    configJson: string;
    content: string;
    courseId: string;
    createTime: Time;
    createUid: string;
    createxxuid: string;
    credit: string;
    currentVersion: number;
    currentstatus: number;
    dpurl: string;
    editconfig: string;
    endTime: Time;
    endtimes: string;
    groupType: number;
    id: number;
    ifGetRange: number;
    ifPhoto: number;
    ifRefreshEwm: number;
    ifSendMessage: number;
    ifaveraged: number;
    ifcommit: number;
    iphoneContent: string;
    isAnony: number;
    isBegins: number;
    isClone: number;
    isDelete: number;
    isResult: number;
    isbackfill: number;
    isnorm: number;
    isold: number;
    jurl: string;
    jwCourseId: string;
    latitude: number;
    longitude: number;
    name: string;
    newOld: number;
    normScore: string;
    otherId: number;
    parentId: number;
    pptPlanId: number;
    pptnum: number;
    releaseNum: number;
    setEndTimeNull: number;
    sfdp: number;
    sffxs: number;
    showhide: number;
    signCode: string;
    source: number;
    startTime: Time;
    starttimes: string;
    status: number;
    sxs: number;
    timeLong: number;
    updateTime: null;
    url: string;
    viewPicPath: string;
    zhjsid: number;
    enc: string
    code: string
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

  interface ActivityItem extends ActivityDetail{
    userStatus: number;
    name: string;
    nameTwo: string;
    otherId: number;
    groupId: number;
    source: number;
    isLook: number;
    type: number;
    releaseNum: number;
    attendNum: number;
    activeType: number;
    logo: string;
    nameOne: string;
    id: number;
    status: number;
    nameFour: string;
  }

  interface ActivityListResponse extends Response<{
    ext: {
      _from_: string
    }
    readingDuration: number
    activeList: ActivityItem[]
  }> { }

  interface YunPanFile {
    disableOpt: boolean;
    resid: number;
    crc: string;
    puid: number;
    isfile: boolean;
    pantype: string;
    size: number;
    name: string;
    objectId: string;
    restype: string;
    uploadDate: number;
    modifyDate: number;
    uploadDateFormat: string;
    residstr: string;
    suffix: string;
    preview: string;
    thumbnail: string;
    creator: number;
    duration: number;
    filetype: string;
    filepath: string;
    sort: number;
    topsort: number;
    resTypeValue: number;
    extinfo: string;
    }
    
  interface Response<T> {
    result: number
    msg: any
    data: T
    errorMsg: any
  }
}
