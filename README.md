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
- [x] git push after updates
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

## stack

- Node
- Eslint
- Discord.js
- Grammarly Code OSS ext  ension
- Axios
- jsdom
- git / github
- Sqlite

## history

variations of this bot have been around but
ultimately failed. Good bye firebase and we
are now going to ramp this shit up with
a combination of a discord bot and some
in browser magic.

this bot was created to answer the question
of who is active and who is winning medals
on warbrokers. 
