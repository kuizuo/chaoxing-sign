<template>
  <div>
    <Suspense>
      <template #fallback>
        <div op50 italic>
          <span animate-pulse>Loading...</span>
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
