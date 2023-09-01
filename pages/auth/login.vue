<script lang="ts" setup>
definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/',
  },
})
</script>

<template>
  <div class="min-h-full max-w-md mx-auto flex flex-col justify-center py-4 sm:px-6 lg:px-8">
    <LoginCard />
  </div>
</template>
