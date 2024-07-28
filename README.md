# msfish

## overview
Msfish is a statistics bot for the War Fish War Brokers squad. This bot collects
stats from stats.warbrokers.io periodically based on when a player last played.
The charts show the time series, wheras the discord bot can be queried for
medals and some activity stats. Msfish was created to answer the question of
who is active and who is winning medals on Warbrokers.

## playerstatus query
```nu
> 'select * from playerstatus' | sqlite3 public/msfish.db -markdown
```

> ℹ️  Debuging node with Chrome DevTools requires running node with --inspect and
> then opening chrome://inspect to attach to the node process

## charts 
[msfish charts](https://darrelldupas.info/msfish/)

## todo
- [ ] get medal details from the hover pop up

## technology stack with an explanation 

- ### Node
	A javascript runtime on my server at home. It runs a discord bot that
	interacts with users, but also fetches the data from stats.warbrokers.io
	and sends the data to a public repository

- ### Discord.js
	Discord bot based on the tutorial almost straight copy. the config.mjs
	file is .gitignored so, the secret keys are not in the repo
	see config.example.mjs

- ### jsdom
	A DOM document is a tree representation of a web page in memory
	made of nodes. Loading a page into JSDOM allows searching using
	XPath. XPath is a path into a dom just like a directory path that 
	leads to a location on your web server.

- ### git / GitHub Desktop
	The database and the devel repo are always together, meaning updates to 
	the database are pushed to github 🪐
	We use Github Desktop, because multiple editors (micro,builder,vscode)
	node-shedule job, gitpushdb, relies on github ssh keys without passwords.

- ### Sqlite, a-was/node-sql, sql.js
	We have some overlap in functionality with various methods of accessing 
	sqlite3, because I started with bare-bones, realized needed
	to promisify it, and finally realized I also need an
	in-browser library for client-side. 

- ### sqlite3-wasm
	https://sqlite.org/wasm/doc/trunk/index.md for reference. This project 
	started using sql.js on the index.html (charts page), but has since
	switched to the wasm library from sqlite.org
	
- ### highcharts.com for the chart
	Highcharts are heavily dependent on Moment.js.

- ### node-schedule

- ### http-server
	A live server like npx http-server is only needed for testing

- ### bulma, bulmaswatch
	css layout and styles. the swatchpicker project is .gitincluded
	and github actions adjusted .github/workflows/static.yml 

- ### pm2
    used to create systemd service and very useful monitoring tool

- ### logind prevent suspend on laptop lid closed
```txt
# file: /etc/systemd/logind.conf
HandleLidSwitch=ignore
HandleLidSwitchExternalPower=ignore
HandleLidSwitchDocked=ignore
```
- ### systemd disable sleep / suspend 
```sh
sudo systemctl mask sleep.target suspend.target hibernate.target hybrid-sleep.target
```	
