<template>
  <div>
    <AppNav />
    <div class="max-w-4xl px-4 py-10 mx-auto dark:bg-gray-800 bg-white sm:px-8 sm:shadowsm:rounded md:max-w-6xl lg:max-w-7xl">
      <main class="prose prose-gray dark:prose-invert max-w-none">
        <slot />
      </main>
    </div>
    <AppFooter />
  </div>
</template>

<style>
.prose {
   max-width: 100%;
}

.prose h2 a,
.prose h3 a {
  --at-apply: "no-underline";
}

.prose h2 a:hover,
.prose h3 a:hover {
  --at-apply: "border-b border-neutral-600 dark:border-neutral-300";
}
</style>
