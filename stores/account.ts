import { acceptHMRUpdate, skipHydrate } from 'pinia'
import { signTypeMap } from '~~/constants/cx'

export const useAccountStore = defineStore('account', () => {
  const accounts = ref<API.Account[]>([])

  const selectAccounts = computed(() => accounts.value.filter(a => a.selected === true))

  const loading = ref(false)
  const ms = useMessage()

  const { log } = useLogStore()

  function getAccount(uid: string) {
    const account = accounts.value.find(a => a.uid === uid)

    if (!account) {
      ms.error('账号不存在')
      throw new Error('账号不存在')
    }

    return account
  }

  function setAccount(uid: string, setting: API.Setting) {
    const index = accounts.value.findIndex(a => a.uid === uid)
    if (index !== -1)
      accounts.value[index].setting = setting
  }

  async function syncAccounts() {
    const { data } = await request('/api/user/accounts')
    accounts.value = data as unknown as API.Account[]

    // log('同步成功', { type: 'success' })
  }

  async function login(form: API.LoginForm) {
    try {
      const { code, message, data } = await request('/api/cx/login', { method: 'POST', body: form })
      if (code === 200) {
        log(`${data?.info?.username} ${message}`, { type: 'success' })

        accounts.value.push({
          ...data,
          courses: [],
          selected: true,
        } as unknown as API.Account)
      }
      else {
        log(`${form.username} ${message}`, { type: 'error' })
      }

      return data
    }
    catch (error) {
    }
  }

  async function logout(uid: string) {
    const account = getAccount(uid)

    await request('/api/cx/logout', { method: 'POST', body: { uid } })

    accounts.value = accounts.value.filter(a => a.uid !== uid)

    log(`${account.info.realname} 退出成功`, { type: 'success' })
  }

  /*
    获取指定账号的所有课程
  */
  async function getCourses(uid: string) {
    const account = getAccount(uid)

    const { data } = await request('/api/cx/courses', { method: 'GET', params: { uid } })

    account.courses = data

    log(`${account.info.realname} 课程获取成功`, { type: 'success' })
    return data
  }

  /*
    获取指定课程的所有活动
  */
  async function getActivityList(uid: string, course: API.Course) {
    const { data } = await request(`/api/cx/courses/${course.courseId}/activities`, {
      method: 'POST',
      body: { uid, course },
    })

    return data
  }

  /*
    根据课程签到
  */
  async function signByCourse(uid: string, course: API.Course) {
    const { data } = await request(`/api/cx/courses/${course.courseId}/sign`, {
      method: 'POST',
      body: { uid, course },
    })

    if (data.length === 0) {
      log(`课程: ${course.name} 无签到活动`, { type: 'warning' })
    }
    else {
      ms.success(`${course.name} 共有${data.length}个正在的签到活动`)
      data.forEach(({ activity, result }) => {
        const signType = signTypeMap[activity.otherId] ?? '未知'
        const activityName = activity.name || signType
        log(`课程: ${course?.name} 活动: ${activityName} [${signType}]结果: ${result}`, { type: result === '签到成功' ? 'success' : 'error' })
      })
    }

    return data
  }

  /*
    根据指定(签到)活动签到
   */
  async function signByActivity(uid: string, course: API.Course, activity: API.Activity) {
    const { data } = await request(`/api/cx/courses/${course.courseId}/activities/${activity.id}/sign`, {
      method: 'POST',
      body: { uid, course, activity },
    })

    const signType = signTypeMap[activity.otherId] ?? '未知'
    const activityName = activity.name || signType
    log(`课程: ${course.name} 活动: ${activityName} [${signType}]结果: ${data?.result || ms}`, { type: data?.result === '签到成功' ? 'success' : 'error' })

    return data
  }

  /*
    签到码签到
  */
  async function signByCode(uid: string, activityId: string, signCode: string) {
    const { data } = await request(`/api/cx/account/${uid}/sign_by_code`, {
      method: 'POST',
      body: { uid, activityId, signCode },
    })

    const { activity } = data!
    const signType = signTypeMap[activity.otherId] ?? '未知'
    const activityName = activity.name || signType
    log(`活动: ${activityName} [${signType}]结果: ${data?.result || ms}`, { type: data?.result === '签到成功' ? 'success' : 'error' })

    return data
  }

  /*
    手势签到
  */
  async function signByGesture(uid: string, activityId: string, signCode: string) {
    const { data } = await request(`/api/cx/account/${uid}/sign_by_gesture`, {
      method: 'POST',
      body: { uid, activityId, signCode },
    })

    const { activity } = data!
    const signType = signTypeMap[activity.otherId] ?? '未知'
    const activityName = activity.name || signType
    log(`活动: ${activityName} [${signType}]结果: ${data?.result || ms}`, { type: data?.result === '签到成功' ? 'success' : 'error' })

    return data
  }

  /*
    二维码签到
  */
  async function signByQrCode(uid: string, link: string) {
    // 提取 activityId 和 enc
    // https://mobilelearn.chaoxing.com/widget/sign/e?id=8000063022220&c=529773&enc=A5BC081D895B41540E129437F6B4180F&DB_STRATEGY=PRIMARY_KEY&STRATEGY_PARA=id

    const activityId = link.match(/id=(\w+)\&/)?.[1]
    const code = link.match(/&c=(\w+)\&/)?.[1]
    const enc = link.match(/enc=(\w+)/)?.[1]

    const { data } = await request(`/api/cx/account/${uid}/sign_by_qrcode`, {
      method: 'POST',
      body: { uid, activityId, enc, code, url: link },
    })

    const { activity } = data!
    const signType = signTypeMap[activity.otherId] ?? '未知'
    const activityName = activity.name || signType
    log(`活动: ${activityName} [${signType}]结果: ${data?.result || ms}`, { type: data?.result === '签到成功' ? 'success' : 'error' })

    return data
  }

  /*
    一键签到
  */
  async function oneClickSign(uid: string) {
    const account = getAccount(uid)

    const { data } = await request(`/api/cx/account/${uid}/sign_all`, {
      method: 'POST',
      body: {
        uid,
        setting: account.setting,
      },
    })

    ms.success(`${account.info.realname} 共有${data.length}个正在的签到活动`, { type: 'warning' })
    data.forEach(({ activity, result }) => {
      const signType = signTypeMap[activity.otherId] ?? '未知'
      const activityName = activity.name || signType

      log(`课程: ${activity.course?.name} 活动: ${activityName} [${signType}]结果: ${result}`,
        { type: result === '签到成功' ? 'success' : 'error' })
    })

    return data
  }

  /*
    添加监听账号
  */
  async function monitorAccount(uid: string) {
    const account = getAccount(uid)
    const { data } = await request(`/api/cx/account/${uid}/monitor`, {
      method: 'POST',
      body: { uid },
    })

    if (data.data?.isOpened)
      log(`${account.info.realname} 监听成功`, { type: 'success' })

    else
      log(`${account.info.realname} 监听失败`, { type: 'error' })
  }

  /*
    移除监听账号
  */
  async function unMonitorAccount(uid: string) {
    const account = getAccount(uid)
    const { data } = await request(`/api/cx/account/${uid}/unmonitor`, {
      method: 'POST',
      body: { uid },
    })

    if (!data.data?.isOpened)
      log(`${account.info.realname} 取消监听成功`, { type: 'success' })

    else
      log(`${account.info.realname} 取消监听失败`, { type: 'error' })
  }

  async function updateSetting(uid: string, setting: API.Setting) {
    const account = getAccount(uid)

    const { data } = await request(`/api/cx/account/${uid}/update_setting`, {
      method: 'POST',
      body: { uid, setting },
    })

    log(`${account.info.realname} 保存成功`, { type: 'success' })

    const index = accounts.value.findIndex(a => a.uid === uid)
    accounts.value[index].setting = data!
  }

  watch(accounts, (accounts) => {
    localStorage.setItem('accounts', JSON.stringify(accounts))
  })

  return {
    accounts: skipHydrate(accounts),
    selectAccounts,
    loading,
    login,
    logout,
    syncAccounts,
    getAccount,
    setAccount,
    getCourses,
    getActivityList,
    signByCourse,
    signByActivity,
    signByCode,
    signByGesture,
    signByQrCode,
    oneClickSign,
    monitorAccount,
    unMonitorAccount,
    updateSetting,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useAccountStore, import.meta.hot))
