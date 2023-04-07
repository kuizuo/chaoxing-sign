<script setup lang="ts">
const router = useRouter()
const route = useRoute()

const accountStore = useAccountStore()

const account = computed(() => accountStore.accounts.find(account => account.uid === route.params.uid))

function handleBack() {
  router.back()
}
</script>

<template>
  <n-card class="max-w-6xl mx-auto">
    <n-page-header @back="handleBack">
      <template #avatar>
        <n-avatar
          :src="account?.info.avatar"
        />
      </template>
      <template #title>
        {{ account?.info.siteName }} {{ account?.info.realname }}
      </template>
    </n-page-header>
    <div>
      <CourseList :account="account" :courses="account?.courses" />
    </div>
  </n-card>
</template>
