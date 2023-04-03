<script setup lang="ts">
const accountStore = useAccountStore()

const accountList = computedAsync(() => accountStore.accounts)

const showModal = ref(false)
const form = reactive({
  username: '',
  password: '',
})

const isSyncing = ref(false)

async function handleSync() {
  if (isSyncing.value)
    return

  isSyncing.value = true
  accountStore.syncAccounts().finally(() => {
    isSyncing.value = false
  })
}

async function addAccount() {
  const data = await accountStore.login(form)

  if (!data)
    return

  showModal.value = false
}

async function selectAccount(account: API.Account) {
  account.selected = !account.selected
}
</script>

<template>
  <div>
    <n-divider dashed>
      <span class="space-x-2">
        <span>账号列表</span>
        <n-tooltip trigger="hover">
          <template #trigger>
            <Icon
              name="material-symbols:cloud-sync-outline-rounded"
              class="cursor-pointer"
              :class="{ 'animate-spin': isSyncing }"
              @click="handleSync()"
            />
          </template>
          同步账号
        </n-tooltip>
      </span>
    </n-divider>

    <template v-if="accountList?.length! > 0">
      <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        <AccountItem v-for="account in accountList" v-bind="account" :key="account.uid" @click="selectAccount(account)" />
        <n-card>
          <div class="cursor-pointer flex justify-center items-center h-full" @click="showModal = true">
            <Icon name="ic:outline-add-box" size="30" />
          </div>
        </n-card>
      </div>
    </template>
    <template v-else>
      <div class="space-y-2">
        <n-empty description="暂无账号" size="small" />
        <n-button @click="showModal = true">
          添加账号
        </n-button>
      </div>
    </template>
    <n-modal
      v-model:show="showModal"
      :mask-closable="true"
      preset="card"
      size="large"
      :bordered="false"
      :closable="false"
      :style="{ 'max-width': '300px' }"
      transform-origin="center"
    >
      <n-spin :show="accountStore.loading">
        <n-form ref="formRef" :model="form" :show-label="false">
          <div text="center sm gray-400" mt-3 mb-6>
            — Cx Login —
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
              :disabled="accountStore.loading"
              @keyup.enter="addAccount()"
            >
              <template #prefix>
                <i i-ri:lock-2-line />
              </template>
            </n-input>
          </n-form-item>
          <n-form-item>
            <n-button type="primary" w-full :loading="accountStore.loading" @click="addAccount()">
              登录
            </n-button>
          </n-form-item>
        </n-form>
      </n-spin>
    </n-modal>
  </div>
</template>

