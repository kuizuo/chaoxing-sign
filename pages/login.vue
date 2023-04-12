<script setup lang="ts">
const router = useRouter()

const { status } = useAuth()

if (status.value === 'authenticated')
  router.push({ path: '/' })

const accountStore = useAccountStore()

async function handleSuccess() {
  await accountStore.syncAccounts()
}

definePageMeta({
  auth: false,
})
</script>

<template>
  <div>
    <LoginForm @success="handleSuccess" />
  </div>
</template>
