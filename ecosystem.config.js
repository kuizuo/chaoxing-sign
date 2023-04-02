module.exports = {
  apps: [
    {
      name: 'Chaoxing-sign',
      script: './.output/server/index.mjs',
      exec_mode: 'cluster',
      instances: '1',
      instance_var: 'INSTANCE_ID',
      env: {
        PORT: 8010,
        HOST: 'localhost',
        NODE_ENV: 'production',
      },
    },
  ],
}
