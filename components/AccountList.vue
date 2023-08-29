<script setup lang="ts">
import { pick } from 'lodash'

const accountStore = useAccountStore()

const isSyncing = ref(false)
const showLoginModal = ref(false)

async function handleSync() {
  if (isSyncing.value)
    return

  isSyncing.value = true
  await accountStore.syncAccounts().finally(() => {
    isSyncing.value = false
  })
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

    <ClientOnly>
      <template #fallback>
        <div class="text-left grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          <n-card v-for="i in 3" :key="i">
            <template #header>
              <n-space :size="10">
                <n-skeleton height="40px" width="40px" />
                <n-skeleton height="40px" width="120px" />
              </n-space>
            </template>
            <n-skeleton text :repeat="1" />
            <template #action>
              <n-space :size="20">
                <n-skeleton height="20px" width="20px" />
                <n-skeleton height="20px" width="20px" />
                <n-skeleton height="20px" width="20px" />
                <n-skeleton height="20px" width="20px" />
              </n-space>
            </template>
          </n-card>
        </div>
      </template>
      <template v-if=" accountStore.accounts?.length! > 0">
        <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          <AccountItem v-for="account in accountStore.accounts" v-bind="pick(account, ['uid', 'info', 'lastLoginTime', 'selected', 'setting'])" :key="account.uid" @click="selectAccount(account)" />
          <n-card
            cursor-pointer
            @click="showLoginModal = true"
          >
            <div class="flex justify-center items-center h-full">
              <Icon name="ic:outline-add-box" size="30" />
            </div>
          </n-card>
        </div>
      </template>
      <template v-else>
        <div class="space-y-2">
          <n-empty description="暂无账号" size="small" />
          <n-button @click="showLoginModal = true">
            添加账号
          </n-button>
        </div>
      </template>
    </ClientOnly>
    <AccountLoginModal v-model:show="showLoginModal" @success="showLoginModal = false" />
  </div>
</template>
