<template>
  <div class="app-layout">
    <AppHeader />
    <main class="container mx-auto py-4 px-4 lg:px-10 text-center">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<style lang="scss" scoped>
.app-layout {
  main {
    min-height: calc(100vh - var(--app-header-height) - var(--app-footer-height)),
  }
}
</style>
