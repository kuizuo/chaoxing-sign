<template>
  <div>
    <Suspense>
      <template #fallback>
        <div op50 italic>
          <span animate-pulse>Loading...</span>
        </div>
      </template>
      <div flex justify-center>
        <div min-w-sm>
          <Hero />
          <AccountList />
          <Operation />
          <Log />
        </div>
      </div>
    </Suspense>
  </div>
</template>
