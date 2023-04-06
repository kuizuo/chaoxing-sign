<script setup lang="ts">
const emit = defineEmits(['success'])

const message = useMessage()
const accountStore = useAccountStore()
const loading = ref(false)

const form = reactive({
  username: '',
  password: '',
})

async function addAccount() {
  if (accountStore.accounts.some(a => a.username === form.username)) {
    message.warning('账号已存在,无需添加')
    return
  }

  loading.value = true
  try {
    const data = await accountStore.login(form)

    if (!data)
      return

    emit('success')
  }
  catch (error) {

  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <n-modal
    :mask-closable="true"
    preset="card"
    size="large"
    :bordered="false"
    :closable="false"
    content-style="padding: 4px 20px;"
    :style="{ 'max-width': '300px' }"
    transform-origin="center"
  >
    <n-spin :show="loading">
      <n-form ref="formRef" :model="form" :show-label="false">
        <div class="text-sm text-gray-400 my-4 flex justify-center">
          <img src="/img/cx.png" alt="cx">
        </div>
        <n-form-item label="账号" path="form.username">
          <n-input v-model:value="form.username" placeholder="账号">
            <template #prefix>
              <i i-ri:user-3-line />
            </template>
          </n-input>
        </n-form-item>
        <n-form-item label="密码" path="form.password">
          <n-input
            v-model:value="form.password"
            type="password"
            show-password-on="mousedown"
            placeholder="密码"
            :maxlength="16"
            :disabled="loading"
            @keyup.enter="addAccount()"
          >
            <template #prefix>
              <i i-ri:lock-2-line />
            </template>
          </n-input>
        </n-form-item>
        <n-form-item>
          <n-button type="primary" class="!w-full" :loading="loading" @click="addAccount()">
            登录
          </n-button>
        </n-form-item>
      </n-form>
    </n-spin>
  </n-modal>
</template>

