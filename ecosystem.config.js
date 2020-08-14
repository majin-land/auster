module.exports = {
  apps: [
    {
      name: 'auster',
      cwd: '/home/ec2-user/auster/current/packages/server',
      script: 'index.js',
      wait_ready: true,
      listen_timeout: 3000,
      kill_timeout: 3000,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 4010,
      },
    },
  ],

  deploy: {
    prod: {
      user: 'ec2-user',
      host: 'imajin-inven',
      ref: 'origin/master',
      repo: 'git@github.com:imajin-land/auster.git',
      path: '/home/ec2-user/auster',
      'post-deploy': 'yarn install --production && cp ../.env ./.env && pm2 reload ecosystem.config.js --only auster --env production',
    },
  },
}
