<script setup lang="ts">
const accountStore = useAccountStore()
const logStore = useLogStore()

const accounts = toRef(accountStore, 'accounts')
const selectAccounts = toRef(accountStore, 'selectAccounts')

const isAllChecked = ref(false)
const indeterminate = computed(() => {
  return selectAccounts.value.length > 0 && selectAccounts.value.length < accounts.value.length
})

function handleCheckedChange() {
  accountStore.accounts.forEach((account) => {
    account.selected = isAllChecked.value
  })
}

onMounted(() => {
  isAllChecked.value = selectAccounts.value.length === accounts.value.length && accounts.value.length > 0
})

watch(selectAccounts, () => {
  isAllChecked.value = selectAccounts.value.length === accounts.value.length && accounts.value.length > 0
})

const loading = ref(false)
const showQrCodeModal = ref(false)
const toSignUids = computed(() => selectAccounts.value.map(account => account.uid))

async function handleSignAll() {
  const toAccounts = unref(selectAccounts)

  logStore.log(`共 ${toAccounts.length} 个账号正在签到`, 'loading')

  await Promise.allSettled(
    toAccounts.map((account) => {
      return accountStore.oneClickSign(account.uid)
    }),
  )

  logStore.log(`共 ${toAccounts.length} 个账号签到完成`, 'success')
}
</script>

<template>
  <n-card class="my-4 text-left">
    <n-checkbox v-model:checked="isAllChecked" :indeterminate="indeterminate" size="large" label="账号全选" @update:checked="handleCheckedChange" />

    <n-space :size="20" class="ml-4 !inline-flex">
      <n-tooltip trigger="hover">
        <template #trigger>
          <Icon v-if="loading" name="line-md:loading-loop" />
          <Icon v-else name="material-symbols:swipe-up-outline" @click="handleSignAll()" />
        </template>
        一键全部签到
      </n-tooltip>

      <n-tooltip trigger="hover">
        <template #trigger>
          <Icon name="mdi:qrcode-scan" class="hover:scale-125" @click="showQrCodeModal = true" />
        </template>
        全部二维码扫码签到
      </n-tooltip>
    </n-space>
    <QrCodeSignModal v-model:show="showQrCodeModal" :uids="toSignUids" />
  </n-card>
</template>

<style scoped>
.icon{
  --at-apply: cursor-pointer transition hover:text-red-4
}
</style>
