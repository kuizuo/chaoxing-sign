module.exports = {
  apps: [
    {
      name: 'chaoxing-sign',
      port: '8050',
      exec_mode: 'cluster',
      instances: '1',
      script: './.output/server/index.mjs',
      instance_var: 'INSTANCE_ID',
      env: {
        NUXT_SECRET: 'chaoxing-sign',
        AUTH_ORIGIN: 'http://localhost:8050',
        NEXTAUTH_URL: 'http://localhost:8050',
        DATABASE_URL: 'postgresql://username:password@localhost:5432/chaoxing',
        NUXT_IM_INIT_CONNECT: true,
      },
    },
  ],
}
