# msfish

## overview 
replace the Wbstatbot with a discord bot

## dev-log

- [x] gather the list of current squad members from wb.io
- [x] update the current list from wb.io to the Msfish database
- [x] display the current list in the Msfish
- [x] get a snapshot of each of the member's stats
- [x] display a list of most recent medals for all members
- [x] version release move to war fish server
- [ ] display last snapshot for a member
- [ ] set members discord id
- [ ] last N - display kills last N days, kd change, brw, cw
- [ ] get medal details from hover pop up
- [ ] cron job for snapshots added  https://crontab.guru/#56_7,11,15,19,23_*_*_*
- [ ] run as service on termux
- [ ] display charts ideas: 
    - return an html file as attchment
    - post data to a jsfiddle and return link
    - vpn tunnel into server and link to webpage
    - get a real server to host webpage
        - that server is not a discord bot but just gets db updates pushed to it
        - updates could be a series of sql inserts to mirror the same ones or it could be a whole db, if it - 
        - maybe there is a sqlite rsync package


- [ ] export to Csv

## stack

- Node
- Eslint
- Discord.js
- Grammarly Code OSS ext  ension
- Axios
- Sqlite

