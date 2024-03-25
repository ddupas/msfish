
module.exports = {
  apps : [{
    script: 'discord-bot/bot.mjs',
    node_args: '--no-warnings',
    cron_restart: '20,40,59 * * * *',
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
  }

  ]
};
