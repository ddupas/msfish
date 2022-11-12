# msfish

## overview 
A statistics bot for War Fish War Brokers squad. This bot collects stats from
stats.warbrokers.io so that it is able to display some charts and medals. It
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

- [ ] display last snapshot for a member
- [ ] delete duplicates, if there are 3 snapshots in a row that are identical, delete the middle one
- [ ] set members discord id
- [ ] get medal details from hover pop up
- [ ] run as service on termux / systemd

## technology stack with explanation 

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
	xpath. xpath is a path into a dom just like a directory path leads
	to a location on your web server.
- ### git / github desktop
	Not sure if I am abusing github tos by uploading my database to
	the development repo, but here we are!!! Also, github desktop is better
	than git built into codeoss or gnome-builder. Cron job relies on 
	keys without passwords.
- ### Sqlite, a-was/node-sql, sql.js
	Some overlap in functionality with various methods of accessing 
	sqlite3, simply because I started with bare-bones, realized needed
	to promisify it, found that, but then realized i also need an
	in-browser library for client side stuff. had i realized it was
	all heading toward needing sql.js, i would of started there
- ### sql.js
    npm i does not download sql-wasm.js,
    solution is to go to github page, find releases and unzip in dist
    Also not trivial to use with cdn on front-end, see index.html for
    2 step initialization
- ### highcharts.com for the chart
	still digging into props but sofar its been interesting, should
	mention this is fairly dependent on moment.js still chewing
- ### node-schedule
- ### http-server for testing index.html
	index.html is the charts page hosted by github using fetch to get
	db also from github and sql.js to query, however, a live server is
	needed for testing, this one is better than the one in code-oss

