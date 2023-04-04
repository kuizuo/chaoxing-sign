<script setup lang="ts">
const emit = defineEmits(['success'])

const accountStore = useAccountStore()
const loading = ref(false)

const form = reactive({
  username: '',
  password: '',
})

async function addAccount() {
  const data = await accountStore.login(form)

  if (!data)
    return

  emit('success')
}
</script>

<template>
  <n-modal
    :mask-closable="true"
    preset="card"
    size="large"
    :bordered="false"
    :closable="false"
    :style="{ 'max-width': '300px' }"
    transform-origin="center"
  >
    <n-spin :show="loading">
      <n-form ref="formRef" :model="form" :show-label="false">
        <div class="text-center text-sm text-gray-400 mt-3 mb-6">
          Cx Login
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

