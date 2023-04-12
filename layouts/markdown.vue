<template>
  <div>
    <AppNav />
    <div class="max-w-2xl px-4 py-4 my-2 mx-auto bg-white sm:px-8 sm:shadow dark:bg-gray-800 sm:rounded">
      <main class="prose prose-gray dark:prose-invert">
        <slot />
      </main>
    </div>
    <AppFooter />
  </div>
</template>

