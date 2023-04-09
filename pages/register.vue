<script setup lang="ts">
import { c, createDiscreteApi } from 'naive-ui'

const router = useRouter()

const { status } = useSession()

if (status.value === 'authenticated')
  router.push({ path: '/' })

const { message: ms } = createDiscreteApi(['message'])

const loading = ref(false)
const form = ref({
  email: '',
  password: '',
  // code: '',
})

async function register() {
  try {
    loading.value = true
    await request('/api/auth/register', {
      method: 'POST',
      body: {
        ...form.value,
      },
    })

    ms.success('注册成功')

    return navigateTo('/login')
  }
  catch (error: any) {
    ms.error(error.message)
  }
  finally {
    loading.value = false
  }
}

definePageMeta({
  auth: false,
})
</script>

<template>
  <div class="text-left">
    <n-spin :show="loading">
      <template #icon>
        <Icon name="line-md:loading-loop" />
      </template>
      <div class="flex bg-cover">
        <div class="flex flex-col gap-2 justify-center items-center mx-auto">
          <div class="text-center text-2xl font-semibold mb-4">
            注册
          </div>
          <n-form ref="formRef" :model="form" :show-label="false">
            <n-form-item label="账号/邮箱" path="form.email">
              <n-input v-model:value="form.email" placeholder="账号">
                <template #prefix>
                  <Icon name="ri:user-3-line" size="16" />
                </template>
              </n-input>
            </n-form-item>
            <n-form-item label="密码" path="form.password">
              <n-input
                v-model:value="form.password" type="password" show-password-on="mousedown" placeholder="密码"
                :maxlength="16" @keyup.enter="register()"
              >
                <template #prefix>
                  <Icon name="ri:lock-2-line" size="16" />
                </template>
              </n-input>
            </n-form-item>
            <!-- <n-form-item label="验证码" path="form.code">
              <n-input
                v-model:value="form.code" placeholder="验证码"
                :maxlength="4"
              >
                <template #prefix>
                  <Icon name="material-symbols:123" size="16" />
                </template>
              </n-input>
            </n-form-item> -->
            <n-form-item>
              <n-button type="primary" w-full @click="register()">
                注册
              </n-button>
            </n-form-item>
          </n-form>
        </div>
      </div>
    </n-spin>
  </div>
</template>
