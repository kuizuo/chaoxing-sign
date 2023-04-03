import { acceptHMRUpdate, skipHydrate } from 'pinia'

export const useAccountStore = defineStore('account', () => {
  const accounts = useLocalStorage<API.Account[]>('account', []) // ref<API.Account[]>([])

  const selectAccounts = computed(() => accounts.value.filter(a => a.selected === true))

  const loading = ref(false)
  const message = useMessage()

  const { log } = useLogStore()

  function getAccount(uid: string) {
    const account = accounts.value.find(a => a.uid === uid)

    if (!account) {
      message.error('账号不存在')
      throw new Error('账号不存在')
    }

    return account
  }

  async function syncAccounts() {
    const { data } = await request('/api/user/accounts')
    accounts.value = data as unknown as API.Account[]
    log('同步成功', { type: 'success' })
  }

  async function login(form: API.LoginForm) {
    if (accounts.value.some(a => a.username === form.username)) {
      message.warning('账号已存在,无需添加')
      return
    }

    loading.value = true

    try {
      const { code, message, data } = await request('/api/cx/login', { method: 'POST', body: form })
      if (code === 200) {
        log(`${data?.info?.username} ${message}`, { type: 'success' })

        accounts.value.push(data as unknown as API.Account)
      }
      else {
        log(`${form.username} ${message}`, { type: 'error' })
      }

      return data
    }
    catch (error) {
    }
    finally {
      loading.value = false
    }
  }

  async function logout(uid: string) {
    const account = getAccount(uid)
    accounts.value = accounts.value.filter(a => a.uid !== uid)

    await request('/api/cx/logout', { method: 'POST', body: { uid } })

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
      log(`${course.name} 无签到活动`, { type: 'warning' })
    }
    else {
      message.success(`${course.name} 共有${data.length}个正在的签到活动`)
      data.forEach(d => log(`${course?.name} ${d.activity.nameOne} ${d.result}`, { type: d.result === '签到成功' ? 'success' : 'error' }))
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

    log(`${course?.name} ${activity.nameOne} ${data.result}`, { type: 'success' })
    return data
  }

  /*
    二维码签到
  */
  async function signByQrCode(uid: string, link: string) {
    // 提取 activityId 和 enc
    // https://mobilelearn.chaoxing.com/widget/sign/e?id=8000063022220&c=529773&enc=A5BC081D895B41540E129437F6B4180F&DB_STRATEGY=PRIMARY_KEY&STRATEGY_PARA=id

    const activityId = link.match(/id=(\d+)/)?.[1]
    const enc = link.match(/enc=(\w+)/)?.[1]

    const { data } = await request('/api/cx/sign_by_qrcode', {
      method: 'POST',
      body: { uid, activityId, enc },
    })

    log(`二维码签到结果: ${data.result}`, { type: data.result === '签到成功' ? 'success' : 'error' })

    return data
  }
  /*
    一键签到
  */
  async function oneClickSign(uid: string) {
    const account = getAccount(uid)

    const { data } = await request('/api/cx/sign_all', {
      method: 'POST',
      body: { uid },
    })

    message.success(`${account.info.realname} 共有${data.length}个正在的签到活动`)
    data.forEach(d => log(`${d.activity.course?.name ?? ''} ${d.activity.nameOne} ${d.result}`, { type: d.result === '签到成功' ? 'success' : 'error' }))

    return data
  }

  return {
    accounts: skipHydrate(accounts),
    selectAccounts,
    loading,
    login,
    logout,
    syncAccounts,
    getAccount,
    getCourses,
    getActivityList,
    signByCourse,
    signByActivity,
    signByQrCode,
    oneClickSign,
  }
})

if (import.meta.hot) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  import.meta.hot.accept(acceptHMRUpdate(useAccountStore, import.meta.hot))
}
