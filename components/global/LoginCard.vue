<script setup lang='ts'>
import { createDiscreteApi } from 'naive-ui'
import type { FormInst, FormItemRule, FormRules } from 'naive-ui/lib/form'

const emit = defineEmits<{
  (e: 'success'): void
}>()

const { message } = createDiscreteApi(['message'])
const { signIn } = useAuth()

const loading = ref(false)

const signInFormRef = ref<FormInst | null>(null)
const signInModel = ref({
  email: '',
  password: '',
})

const signInRules: FormRules = {
  email: [
    {
      required: true,
      validator(rule: FormItemRule, value: string) {
        if (!isEmail(value))
          return new Error('请输入正确的邮箱')

        return true
      },
      trigger: ['input', 'blur'],
    },
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
    },
  ],
}

async function signInWithPassword() {
  await signInFormRef.value?.validate()

  try {
    loading.value = true

    const { error, url } = await signIn('credentials', {
      ...signInModel.value,
      redirect: false,
    })

    if (error)
      return message.error(error)

    message.success('登录成功')

    emit('success')
    return navigateTo(url, { external: true })
  }
  finally {
    loading.value = false
  }
}

const signUpFormRef = ref<FormInst | null>(null)
const signUpModel = ref({
  email: '',
  password: '',
  reenteredPassword: '',
  privatePolicy: false,
  // code: '',
})

const signUpRules: FormRules = {
  email: [
    {
      required: true,
      validator(rule: FormItemRule, value: string) {
        if (!isEmail(value))
          return new Error('请输入正确的邮箱')

        return true
      },
      trigger: ['input', 'blur'],
    },
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
    },
  ],
  reenteredPassword: [
    {
      required: true,
      message: '请再次输入密码',
      trigger: ['input', 'blur'],
    },
    {
      validator: (rule: FormItemRule, value: string) => {
        return (
          !!signUpModel.value.password && signUpModel.value.password.startsWith(value) && signUpModel.value.password.length >= value.length
        )
      },

      message: '两次密码输入不一致',
      trigger: 'input',
    },
    {
      validator: (rule: FormItemRule, value: string) => {
        return value === signUpModel.value.password
      },
      message: '两次密码输入不一致',
      trigger: ['blur', 'password-input'],
    },
  ],
  privatePolicy: [
    {
      required: true,
      message: '请同意隐私条款',
      validator: (rule: FormItemRule, value: string) => {
        return Boolean(value)
      },
    },
  ],
}
async function signUp() {
  await signUpFormRef.value?.validate()

  try {
    loading.value = true

    const { data } = await request('/api/auth/signUp', {
      method: 'POST',
      body: {
        ...signUpModel.value,
      },
    })

    message.success('注册成功')
  }
  finally {
    loading.value = false
  }
}

async function signInWithGithub() {
  try {
    loading.value = true
    const { data, error } = await signIn('github')

    if (error)
      return message.error(error.message)
  }
  finally {
    loading.value = false
  }
}

async function goToResetPassword() {
  await navigateTo('/auth/reset-password', { external: true })
  emit('success')
}
</script>

<template>
  <n-card>
    <template #header>
      <h2 class="text-center text-xl">
        某星签到
      </h2>
    </template>
    <NSpin :show="loading">
      <div class="flex flex-col gap-2 justify-center items-center mx-auto px-4 text-left relative">
        <NTabs default-value="signin" size="large" justify-content="space-evenly">
          <NTabPane name="signin" tab="登录" display-directive="show">
            <NForm ref="signInFormRef" :model="signInModel" :show-label="false" :rules="signInRules">
              <NFormItem label="邮箱" path="email">
                <NInput v-model:value="signInModel.email" placeholder="邮箱">
                  <template #prefix>
                    <Icon name="ri:mail-line" size="16" class="text-gray-400" />
                  </template>
                </NInput>
              </NFormItem>
              <NFormItem label="密码" path="password">
                <NInput
                  v-model:value="signInModel.password" type="password" show-password-on="mousedown" placeholder="密码"
                  :maxlength="16" @keyup.enter="signInWithPassword()"
                >
                  <template #prefix>
                    <Icon name="ri:lock-2-line" size="16" class="text-gray-400" />
                  </template>
                </NInput>
              </NFormItem>
              <NFormItem>
                <NSpace justify="space-between" class="w-full">
                  <NCheckbox class="text-sm">
                    记住我
                  </NCheckbox>
                  <NButton text tag="a" type="primary" @click="goToResetPassword()">
                    忘记密码
                  </NButton>
                </NSpace>
              </NFormItem>
              <NFormItem>
                <NButton type="primary" class="w-full" @click="signInWithPassword()">
                  登录
                </NButton>
              </NFormItem>
            </NForm>
            <div
              class="w-full flex mb-4 -mt-2 h-4 text-center truncate
            before:content-[''] before:relative before:top-1/2 before:w-1/2 before:translate-y-1/2 before:h-0 before:border-t-[1px] before:border-gray-200 before:dark:border-gray-700
            after:content-[''] after:relative after:top-1/2 after:w-1/2 after:translate-y-1/2 after:h-0 after:border-t-[1px] after:border-gray-200 after:dark:border-gray-700"
            >
              <span class="px-2 text-gray-4 text-sm">或者</span>
            </div>

            <div class="space-y-4 w-full">
              <NButton class="w-full flex" color="#2f3337" @click="signInWithGithub()">
                <template #icon>
                  <Icon name="ri:github-line" />
                </template>
                使用 Github 登录
              </NButton>
            </div>
          </NTabPane>
          <NTabPane name="signup" tab="注册" display-directive="show">
            <NForm ref="signUpFormRef" :model="signUpModel" :show-label="false" :rules="signUpRules">
              <NFormItem label="用户名" path="email">
                <NInput v-model:value="signUpModel.email" placeholder="邮箱">
                  <template #prefix>
                    <Icon name="ri:mail-line" size="16" class="text-gray-400" />
                  </template>
                </NInput>
              </NFormItem>
              <NFormItem label="密码" path="password">
                <NInput
                  v-model:value="signUpModel.password" type="password" show-password-on="mousedown" placeholder="请输入密码"
                  :minlength="6"
                  :maxlength="16"
                >
                  <template #prefix>
                    <Icon name="ri:lock-2-line" size="16" class="text-gray-400" />
                  </template>
                </NInput>
              </NFormItem>
              <NFormItem label="密码" path="reenteredPassword">
                <NInput
                  v-model:value="signUpModel.reenteredPassword" type="password" show-password-on="mousedown" placeholder="请再次输入密码"
                  :minlength="6"
                  :maxlength="16"
                >
                  <template #prefix>
                    <Icon name="ri:lock-2-line" size="16" class="text-gray-400" />
                  </template>
                </NInput>
              </NFormItem>
              <!-- <NFormItem label="验证码" path="form.code">
              <NInput
                v-model:value="form.code" placeholder="验证码"
                :maxlength="4"
              >
                <template #prefix>
                  <Icon name="material-symbols:123" size="16" class="text-gray-400" />
                </template>
              </NInput>
            </NFormItem> -->
              <NFormItem path="privatePolicy">
                <NSpace justify="space-between" class="w-full">
                  <NCheckbox v-model:checked="signUpModel.privatePolicy" class="text-sm">
                    我同意隐私条款
                  </NCheckbox>
                </NSpace>
              </NFormItem>
              <NFormItem>
                <div class="space-y-4 w-full">
                  <NButton type="primary" class="w-full" @click="signUp()">
                    注册
                  </NButton>
                </div>
              </NFormItem>
            </NForm>
          </NTabPane>
        </NTabs>
      </div>
    </NSpin>
  </n-card>
</template>
