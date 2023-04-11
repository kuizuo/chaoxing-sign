module.exports = {
  apps: [
    {
      name: 'chaoxing-sign',
      script: './.output/server/index.mjs',
      exec_mode: 'cluster',
      instances: '1',
      instance_var: 'INSTANCE_ID',
      env: {
        NITRO_PORT: 8050,
        NODE_ENV: 'production',
        NUXT_SECRET: 'chaoxing-sign',
        AUTH_ORIGIN: 'http://localhost:8050',
        DATABASE_URL: 'postgresql://username:password@localhost:5432/chaoxing',
        NUXT_IM_INIT_CONNECT: true,
      },
    },
  ],
}
