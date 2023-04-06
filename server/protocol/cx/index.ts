import { qsParse, qsStringify, timestamp } from '@kuizuo/utils'
import { mapLimit } from 'async'
import type { Got } from 'got'
import { CookieJar } from 'tough-cookie'
import * as cheerio from 'cheerio'
import got from 'got'

export enum ActivityStatusEnum {
  Doing = 1,
  Done = 2,
}

export enum ActivityTypeEnum {
  Sign = 2, // 签到
  Answer = 4, // 抢答
  Talk = 5, // 主题谈论
  Question = 6, // 投票
  Pick = 11, // 选人
  Homework = 19, // 作业
}

export enum SignTypeEnum {
  General = 0, // 普通签到/拍照签到
  QrCode = 2, // 二维码签到
  Gesture = 3, // 手势签到
  Location = 4, // 位置签到
  Code = 5, // 签到码签到
}

export class Cx {
  public http: Got
  public cookieJar: CookieJar
  public currentUrl = ''

  public user: CX.AccountInfo
  public courseList: CX.Course[] = []

  constructor(user: Partial<CX.AccountInfo>) {
    this.cookieJar = new CookieJar()

    this.http = got.extend({
      responseType: 'json',
      cookieJar: this.cookieJar,
      hooks: {
        afterResponse: [
          (response) => {
            this.currentUrl = response.url
            return response
          },
        ],
      },
    })

    this.user = user as CX.AccountInfo
    return this
  }

  getCookie<T extends 'json' | 'string' = 'string'>(key?: string, type?: T, url?: string): T | string {
    if (this.cookieJar && (url || this.currentUrl)) {
      if (key) {
        const cookies = this.cookieJar.getCookiesSync(url || this.currentUrl).find(c => c.key === key)
        return cookies ? cookies.value : '' as string
      }

      if (type === 'json') {
        const cookies = this.cookieJar.getCookiesSync(url || this.currentUrl)
        return cookies as unknown as any
      }

      else {
        const cookieString = this.cookieJar.getCookieStringSync(url || this.currentUrl)
        return cookieString
      }
    }

    return ''
  }

  setCookie(cookie: string, url?: string) {
    if (this.cookieJar && cookie)
      this.cookieJar.setCookieSync(cookie, url || this.currentUrl)
  }

  async login(): Promise<string | null> {
    if (/^1[3-9]\d{9}$/.test(this.user.username)) {
      const { body: data } = await this.http.get<CX.LoginResult>('https://passport2.chaoxing.com/api/login', {
        searchParams: {
          name: this.user.username,
          pwd: encodeURIComponent(this.user.password),
          schoolid: '',
          verify: '',
        },
      })

      if (!data.result)
        return data.errorMsg

      await this.parseUserInfo(data)
      this.user.logged = true
      return '登录成功'
    }
    else {
      return '账号密码格式不正确'
    }
  }

  async logout() {
    this.user = {} as CX.AccountInfo
    this.courseList = []
    this.cookieJar.removeAllCookiesSync()
  }

  async parseUserInfo(data: CX.LoginResult) {
    this.user = {
      ...this.user,
      ...data,
      uid: String(data.uid),
    } as unknown as CX.AccountInfo

    const { body: html } = await this.http.get(`http://i.chaoxing.com/base?t=${timestamp()}`, { responseType: 'text' })

    const $ = cheerio.load(html)
    this.user.avatar = `${$('.head-img').attr('src')! + this.user.uid}_80`
    this.user.siteName = $('#siteName').attr('title')
  }

  async getCourseList(): Promise<CX.Course[]> {
    interface CourseBody {
      courseType: string
      courseFolderId: string
      courseFolderSize: string
    }

    const body: CourseBody = { courseType: '1', courseFolderId: '0', courseFolderSize: '0' }
    const html = await this.http.post(
      'http://mooc1-1.chaoxing.com/visit/courselistdata',
      {
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body: qsStringify(body as any),
        responseType: 'text',
      },
    ).text()

    const $ = cheerio.load(html)

    const courseList = $('.course').map((i, el) => {
      const image = $(el).find('img').attr('src')!
      const href = $(el).find('.course-info a').attr('href')!
      const name = $(el).find('.course-name').attr('title')!
      const { courseid, clazzid, cpi } = qsParse(href.substring(href.indexOf('?') + 1))!

      return {
        name,
        courseId: courseid,
        classId: clazzid,
        cpi,
        image,
        link: href,
      }
    }).get() as CX.Course[]

    this.courseList = courseList
    return courseList
  }

  async getActivityList(course: CX.Course) {
    const { body: data } = await this.http.get<CX.ActivityListResponse>('https://mobilelearn.chaoxing.com/v2/apis/active/student/activelist', {
      searchParams: {
        fid: this.user.schoolid,
        courseId: course.courseId,
        classId: course.classId,
        _: timestamp(),
      },
    })

    return data.data.activeList ?? []
  }

  /*
    根据 aid 获取活动详情
  */
  async getActiveInfo(activeId: string | number) {
    const { body: data } = await this.http.get<CX.Response<CX.Activity>>('https://mobilelearn.chaoxing.com/v2/apis/active/getPPTActiveInfo', {
      searchParams: {
        activeId,
      },
    })

    return data.data
  }

  /*
    需要先发送预签到请求 才能够正常记录签到记录
  */
  async preSign(course: CX.Course, activity: CX.Activity) {
    const { body: data } = await this.http.get('https://mobilelearn.chaoxing.com/newsign/preSign', {
      searchParams: {
        courseId: course.courseId,
        classId: course.classId,
        activePrimaryId: activity.id,
        general: '1',
        sys: '1',
        ls: '1',
        appType: '15',
        tid: '',
        uid: this.user.uid,
        ut: 's',
      },
      responseType: 'text',
    })
    return data
  }

  /*
    群聊预签到
  */
  async preSign_chat(activity: CX.Activity) {
    const { body: data } = await this.http.get(
      'https://mobilelearn.chaoxing.com/sign/preStuSign',
      {
        searchParams: {
          activeId: activity.id,
          code: '',
          uid: this.user.uid,
          courseId: null,
          classId: '0',
          general: '0',
          // chatId: activity.chatId,
          appType: '0',
          tid: '',
          atype: null,
          sys: '0',
        },
      },
    )
    return data
  }

  /*
    签到请求
  */
  async stuSign(query: string) {
    const { body: data } = await this.http.get('https://mobilelearn.chaoxing.com/pptSign/stuSignajax', {
      searchParams: query,
      responseType: 'text',
    })

    if (data === 'success' || data === '您已签到过了')
      return '签到成功'
    else if (data === 'success2')
      return '签到已过期'

    return data
  }

  async signGeneral(activity: CX.Activity) {
    const query = qsStringify({
      activeId: activity.id,
      uid: this.user.uid,
      clientip: '',
      latitude: '-1',
      longitude: '-1',
      appType: '15',
      fid: this.user.schoolid,
      name: this.user.realname,
    }, '', '', { encodeURIComponent: s => s })

    return this.stuSign(query)
  }

  async signLocation(activity: CX.Activity,
    location: CX.SignLocation = {
      latitude: '-1',
      longitude: '-1',
    }) {
    // 位置 https://api.map.baidu.com/lbsapi/getpoint/index.html
    const query = qsStringify({
      activeId: activity.id,
      address: '',
      uid: this.user.uid,
      clientip: '',
      latitude: location.latitude,
      longitude: location.longitude,
      appType: '15',
      fid: this.user.schoolid,
      name: this.user.realname,
      ifTiJiao: 1,
    }, '', '', { encodeURIComponent: s => s })

    return this.stuSign(query)
  }

  async signQrCode(activity: CX.Activity, enc: string) {
    const query = qsStringify({
      enc,
      activeId: activity.id,
      uid: this.user.uid,
      clientip: '',
      useragent: '',
      latitude: '-1',
      longitude: '-1',
      fid: this.user.schoolid,
      appType: '15',
      name: this.user.realname,
    }, '', '', { encodeURIComponent: s => s })

    return this.stuSign(query)
  }

  async getAllActivity(type?: ActivityTypeEnum, status?: ActivityStatusEnum) {
    const courseList = await this.getCourseList()

    const activityArr = await mapLimit(courseList, 5, async (course: CX.Course) => (await this.getActivityList(course)).map(a => ({ course, ...a })))

    return activityArr.flat(1)
      .filter((activity: { type: number; status: number }) => (type ? activity.type === type : true) && (status ? activity.status === status : true))
  }

  async signByCourse(course: CX.Course) {
    const activityList = await this.getActivityList(course)

    const signActivityList = activityList.filter(activity => activity.type === ActivityTypeEnum.Sign && activity.status === ActivityStatusEnum.Doing)

    const signResult: { activity: CX.Activity; result: string }[] = []

    for await (const activity of signActivityList) {
      if (activity.type === ActivityTypeEnum.Sign) {
        const result = await this.handleSign(course, activity)

        console.log(`课程: ${course.name} 签到结果: ${result}`)

        signResult.push({
          activity,
          result,
        })
      }
    }

    return signResult
  }

  async signByActivity(course: CX.Course, activity: CX.Activity) {
    if (!(activity.type === ActivityTypeEnum.Sign && activity.status === ActivityStatusEnum.Doing)) {
      return {
        activity,
        result: '不是签到活动或活动已结束',
      }
    }
    const result = await this.handleSign(course, activity)

    console.log(`课程: ${course.name} 签到结果: ${result}`)

    return {
      activity,
      result,
    }
  }

  /*
  * 一键签到 (检测所有课程, 所有签到活动, 比较耗时)
  */
  async oneClickSign() {
    const signActivityList = await this.getAllActivity(ActivityTypeEnum.Sign, ActivityStatusEnum.Doing)

    const signResult = []
    for await (const activity of signActivityList) {
      if (activity.type === ActivityTypeEnum.Sign) {
        const result = await this.handleSign(activity.course, activity)

        signResult.push({
          activity,
          result,
        })
      }
    }
    return signResult
  }

  async handleSign(course: CX.Course, activity: CX.Activity) {
    await this.preSign(course, activity)

    switch (activity.otherId) {
      case SignTypeEnum.General:
      case SignTypeEnum.Gesture:
      case SignTypeEnum.Code:
        return await this.signGeneral(activity)

      case SignTypeEnum.Location:
        return await this.signLocation(activity)

      case SignTypeEnum.QrCode:
        return '请扫码签到'

      default:
        return '未知签到类型'
    }
  }

  async getWebIM() {
    const { body: html } = await this.http.get('https://im.chaoxing.com/webim/me', {
      responseType: 'text',
    })

    const $ = cheerio.load(html)

    return {
      token: $('#myToken').text(),
      uid: $('#myTuid').text(),
      name: $('#myName').text(),
    }
  }
}

export const CXMap = new Map<string | number, Cx>()

export const getCx = (uid: string | number) => CXMap.get(uid)

export const setCx = (uid: string | number, cx: Cx) => CXMap.set(uid, cx)
