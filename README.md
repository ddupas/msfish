# msfish

## overview
Msfish is a statistics bot for the War Fish War Brokers squad. This bot collects stats from
stats.warbrokers.io and displays some charts and medals. It
is also a discord bot. Msfish was created to answer the question
of who is active and who is winning medals on warbrokers.

## gains
At the start of the project DB Browser for Sqlite was
indispensable but as I got more comfortable the less I needed it. Now, 
I prefer to cat a file into sqlite3.

```sh
> cat test.sql | sqlite3 msfish.db -markdown
```
IDE Tools: Gnome-builder, Git Desktop, Chrome DevTools
Debuging node with Chrome DevTools requires running node --inspect, then
opening chrome://inspect.

## charts
https://ddupas.github.io/msfish/

## todo

- [ ] delete duplicates, delete the middle of 3 or more duplicates, keeping each end.
- [ ] set the members' discord id
- [    ] get medal details from the hover pop up
- [ ] run as service on termux / systemd
- [ ] begginer install links (node,sqlite,git) and sample config.json

## technology stack with an explanation 

- ### Node
	A javascript runtime on my server at home. It runs a discord bot that
	interacts with users, but also fetches the data from stats.warbrokers.io
	and sends the data to a public repository
- ### Eslint
	A code problem detector
- ### Discord.js
	Discord bot based on the tutorial almost straight copy. the config.json 
	file is .gitignored so, the secret keys are not in the repo
- ### jsdom
	A DOM document is a tree representation of a web page in memory
	made of nodes. Loading a page into JSDOM allows searching using
	XPath. XPath is a path into a dom just like a directory path that 
	leads to a location on your web server.
- ### git / GitHub Desktop
	Not sure if I am abusing GitHub's terms of service by uploading my database to
	the development repo, but here we are!!! Also, GitHub desktop is better
	than git built into CodeOSS or gnome-builder. Cron's job relies on 
	keys without passwords.
- ### Sqlite, a-was/node-sql, sql.js
	We have some overlap in functionality with various methods of accessing 
	sqlite3, because I started with bare-bones, realized needed
	to promisify it, and finally realized I also need an
	in-browser library for client-side. 
- ### sql.js
	A sqlite3 library that can run client-side in-browser or on a node
	server. Installation is not trivial for either. On the server, npm 
	did not grab the files needed. The 
    solution is to go to their GitHub page, find releases and unzip.
	On the front end we use a CDN: see index.html for the
    2 step initialization code.
- ### highcharts.com for the chart
	We are still digging into the properties, but so far it's been interesting. 
	Highcharts are heavily dependent on Moment.js.
- ### node-schedule
- ### http-server for testing index.html
	index.html is the charts page hosted by GitHub.
	It uses fetch to get the msfish.db database (also located on GitHub).
	A live server like npx http-server is only needed for testing
- ### bulma, bulmaswatch
	css layout and styles 

