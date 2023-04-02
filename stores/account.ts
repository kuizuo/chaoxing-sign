export const useAccountStore = defineStore('account', () => {
  const accounts = ref<CX.AccountWithoutPassword[]>([])

  const loading = ref(false)
  const message = useMessage()

  const logStore = useLogStore()

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
    accounts.value = data as unknown as CX.AccountWithoutPassword[]
    message.success('同步成功')
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
        logStore.log(`${data?.info?.username} ${message}`, 'success')

        accounts.value.push(data as unknown as CX.AccountWithoutPassword)
      }
      else {
        logStore.log(`${form.username} ${message}`, 'error')
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

    ; (await request('/api/cx/logout', { method: 'POST', body: { uid } }))

    logStore.log(`${account.info.realname} 退出成功`, 'success')
  }

  /*
    获取指定账号的所有课程
  */
  async function getCourses(uid: string) {
    const account = getAccount(uid)

    const { data } = await request('/api/cx/courses', { method: 'GET', params: { uid } })

    account.courses = data

    logStore.log(`${account.info.realname} 课程获取成功`, 'success')
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
      logStore.log(`${course.name} 无签到活动`, 'warning')
    }
    else {
      message.success(`${course.name} 共有${data.length}个正在的签到活动`)
      data.forEach(d => logStore.log(`${course?.name} ${d.activity.nameOne} ${d.result}`, d.result === '签到成功' ? 'success' : 'error'))
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

    logStore.log(`${course?.name} ${activity.nameOne} ${data.result}`, 'success')
    return data
  }

  /*
    一键签到
  */
  async function oneClickSign(uid: string) {
    const { data } = await request('/api/cx/sign_all', {
      method: 'POST',
      body: { uid },
    })

    message.success(`共有${data.length}个正在的签到活动`)
    data.forEach(d => logStore.log(`${d.activity.course?.name ?? ''} ${d.activity.nameOne} ${d.result}`, d.result === '签到成功' ? 'success' : 'error'))

    return data
  }

  return {
    accounts,
    loading,
    login,
    logout,
    syncAccounts,
    getAccount,
    getCourses,
    getActivityList,
    signByCourse,
    signByActivity,
    oneClickSign,
  }
}, {
  persist: {
    key: 'account',
    paths: ['accounts'],
  },
})

