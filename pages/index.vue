<script lang="ts" setup>
const accountStore = useAccountStore()

onMounted(() => {
  nextTick(() => {
    accountStore.syncAccounts()
  })
})
</script>

<template>
  <div>
    <Suspense>
      <template #fallback>
        <div class="op50 italic">
          <span class="animate-pulse">Loading...</span>
        </div>
      </template>
      <div class="flex justify-center">
        <div class="w-1024px">
          <Hero />
          <AccountList />
          <Operation />
          <Log />
        </div>
      </div>
    </Suspense>
  </div>
</template>
