<script setup lang="ts">
const router = useRouter()

const { status } = useSession()

if (status.value === 'authenticated')
  router.push({ path: '/' })

definePageMeta({
  auth: false,
})
</script>

<template>
  <div>
    <LoginForm />
  </div>
</template>
