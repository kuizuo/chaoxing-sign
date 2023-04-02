<script setup lang="ts">
const { status, data, signOut, signIn } = useSession()

definePageMeta({
  auth: true,
})
</script>

<template>
  <div class="w-full max-w-5xl mx-auto  bg-white px-5 py-4">
    <div v-if="status === 'authenticated'" class="flex flex-col justify-center items-center gap-4">
      <img
        v-if="data?.user?.image"
        class="w-12 h-12 rounded-full"
        :src="data.user.image"
        alt="User Avatar"
      >
      <h1 class="text-lg">
        {{ data?.user?.name }}
      </h1>
      <h2>
        {{ data?.user?.email }}
      </h2>
    </div>
    <h1 v-else>
      Not logged in
    </h1>
  </div>
</template>
