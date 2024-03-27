
module.exports = {
  apps : [{
    script: 'discord-bot/manage-bot.mjs',
    node_args: '--no-warnings --expose-gc',
    cron_restart: '19,39,59 * * * *',
  },
  {
    script: 'msfish.mjs',
    node_args: '--no-warnings',
    cron_restart: '21 11 * * *',
  },
  {
    name: 'http-server',
    script: 'node_modules/http-server/bin/http-server',
    args: '-o -c-1 -p 8080',
  },
  {
    name: 'keepalive',
    script: 'keepalive.mjs',
  }]
};
