<script setup lang="ts">
import { createDiscreteApi } from 'naive-ui'

interface Emit {
  (e: 'success', url: string): void
}

const emit = defineEmits<Emit>()

const { signIn, getProviders } = useSession()

const providers = await getProviders()
const { message: ms } = createDiscreteApi(['message'])

const loading = ref(false)
const form = ref({
  username: '',
  password: '',
})

async function login() {
  loading.value = true
  const { error, url } = await signIn('credentials', {
    ...form.value,
    redirect: false,
  })
  loading.value = false

  if (error) {
    ms.error(error)
    return
  }

  ms.success('登录成功')

  if (url)
    navigateTo(url, { replace: true })

  else
    navigateTo('/', { replace: true })

  emit('success', url)
}
</script>

<template>
  <div class="text-left">
    <n-spin :show="loading">
      <div class="flex bg-cover">
        <div class="flex flex-col gap-2 justify-center items-center mx-auto">
          <div class="text-center text-2xl font-semibold mb-4">
            Login
          </div>
          <n-form ref="formRef" :model="form" :show-label="false">
            <n-form-item label="账号" path="form.username">
              <n-input v-model:value="form.username" placeholder="账号">
                <template #prefix>
                  <i i-ri:user-3-line />
                </template>
              </n-input>
            </n-form-item>
            <n-form-item label="密码" path="form.password">
              <n-input
                v-model:value="form.password" type="password" show-password-on="mousedown" placeholder="密码"
                :maxlength="16" @keyup.enter="login()"
              >
                <template #prefix>
                  <i i-ri:lock-2-line />
                </template>
              </n-input>
            </n-form-item>
            <n-form-item>
              <n-button type="primary" w-full @click="login()">
                登录
              </n-button>
            </n-form-item>
          </n-form>
          <div
            v-if="Object.keys(providers).length > 1"
            class="w-full flex my-2 -mt-4 text-center truncate before:(content-none relative top-50% w-50% translate-y-50% h-0 b-t-1 b-gray-2 dark:b-gray-7) after:(content-none relative top-50% w-50% translate-y-50% h-0 b-t-1 b-gray-2 dark:b-gray-7)"
          >
            <span px-2 text-gray-4 text-sm>or</span>
          </div>
          <div class="space-y-4 w-full">
            <n-button v-if="providers.github" class="w-full flex" @click="signIn('github')">
              <i i-ri-github-line text-lg mr-1 />
              Sign in with Github
            </n-button>
          </div>
        </div>
      </div>
    </n-spin>
  </div>
</template>
