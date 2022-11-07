# msfish

## overview 
replace the Wbstatbot with a discord bot

## charts
https://ddupas.github.io/msfish/

## dev-log

- [x] gather the list of current squad members from wb.io
- [x] update the current list from wb.io to the Msfish database
- [x] display the current list in the Msfish
- [x] get a snapshot of each of the member's stats
- [x] display a list of most recent medals for all members
- [x] version release move to war fish server
- [x] last N - display kills last N days, kd change, brw, cmw
- [x] github keys no password for push
- [x] git push after updates - check diff settings
- [x] display charts
- [ ] update active - just update the players that have played in the 
	  last Xactive-spanX day
	  - set more freq schedule for update active
	  - have multiple active-spans to detect currently playing and funnel
	  - activity bins- active-span - cron freq correlation
	  - ie all the players ||that have played in the last year should be updated monthly, all the players that have played in the last month should be updated weekly, all the players that week|| should be updated daily, all the players that have played in the last day should be updated every 3 hours, every player that has played in the last 3 hours should be updated hourly, all the players that have played in the last hour should be updated every 15 minutes the end
	  - last active function, detect the last time had a change
- [ ] display last snapshot for a member
- [ ] delete duplicates, if there are 3 snapshots in a row that are identical, delete the middle one
- [ ] set members discord id
- [ ] get medal details from hover pop up
- [ ] cron job for snapshots
 	- https://crontab.guru/#56_7,11,15,19,23_*_*_*
	- once update active is running could lower
- [ ] run as service on termux
- [ ] export to Csv

## technology stack with explaination 

- ### Node
	A javascript runtime on my server at home. It runs a discord bot that
	interacts with users, but also fetches the data from stats.warbrokers.io
	and sends the data to a public repository where
- ### Eslint
	A code problem detector, not sure if its working
- ### Discord.js
	Discord bot based on the tutorial almost straight copy. the config.json 
	file is .gitignored so, the secret keys are not in the repo
- Grammarly Code OSS ext  ension
	Fixes spelling mistakes in Code - OSS text editor
- Axios
	Could almost eliminate this dependancy since fetch is not hard.
	this just fetches web pages, a wget for js
- jsdom
	A DOM document is a tree representation of a web page in memory
	made of nodes. Loading a page into JSDOM allows searching using
	xpath. xpath is a path into a dom just like a directory path leads
	to a location on your web server.
- git / github
	Not sure if I am abusing github tos by uploading my database to
	the development repo, but here we are!!!
- Sqlite, a-was/node-sql, sql.js
	Some overlap in functionality with various methods of accessing 
	sqlite3, simply because I started with barebones, realized needed
	to promisify it, found that, but then realized i also need an
	in browser library for client side stuff. had i realized it was
	all heading toward needing sql.js, i would of started there
- highcharts.com for the chart
	still digging into props but sofar its been interesting, should
	mention this is fairly dependent on moment.js still chewing
- http-server for testing index.html
	index.html is the charts page hosted by github using fetch to get
	db also from github and sql.js to query, however, a live server is
	needed for testing, this one is better than the one in code-oss

## history

variations of this bot have been around but
ultimately failed. Good bye firebase.

this bot was created to answer the question
of who is active and who is winning medals
on warbrokers. 
