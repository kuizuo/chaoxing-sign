<script setup lang="ts">
const router = useRouter()

definePageMeta({
  auth: false,
})
</script>

<template>
  <main p="x4 y10" text="center teal-700 dark:gray-200">
    <n-result status="404" title="404 资源不存在" description="生活总归带点荒谬">
      <template #footer>
        <n-space justify="center">
          <n-button @click="router.back()">
            Back
          </n-button>
          <n-button @click="router.push('/')">
            Home
          </n-button>
        </n-space>
      </template>
    </n-result>
  </main>
</template>
