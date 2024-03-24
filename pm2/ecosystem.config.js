
module.exports = {
  apps : [{
    script: 'test-discordlogin.js',
    node_args: '--no-warnings',
    cron_restart: '20,40,59 * * * *',
  },
  {
    script: 'test-updateplayers.js',
    node_args: '--no-warnings',
    cron_restart: '21 11 * * *',
  },
  {
    script: 'test-next.js',
    node_args: '--no-warnings',
  },
  {
    name: 'gitpushdb',
    node_args: '--no-warnings',
    script: 'test-gitpushdb.js',
  },
  {
    script: 'test-deletedup.js',
    node_args: '--no-warnings',
    cron_restart: '15 10 * * *',
  },
  {
    name: 'http-server',
    script: 'node_modules/http-server/bin/http-server',
    args: '-o -c-1 -p 8080',
  }

  ]
};
