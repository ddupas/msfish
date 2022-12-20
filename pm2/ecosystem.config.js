/*
install command:
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u darrell --hp /home/darrell/msfish/
start command:
pm2 start ecosystem.config.js
pm2 save
*/

module.exports = {
  apps : [{
    cwd: '/home/darrell/msfish/',
    script: 'index.js',
  }, {
    cwd: '/home/darrell/msfish/',
    script: '/home/darrell/msfish/test-cron.js',
  },{
      cwd: '/home/darrell/fruitfish/',
      script: 'index.js',
    }
  ]
};
