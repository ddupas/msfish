CREATE VIEW playerstatus AS
SELECT name, pid,            
STRFTIME('%s','now') * 1000 - MIN(date) AS miliago,
STRFTIME('%s','now') * 1000 - MAX(date) AS lsmiliago
FROM (
SELECT * FROM (
SELECT pid, MAX(date), name, kills
FROM snapshots GROUP BY pid) AS a
JOIN snapshots AS b ON
a.pid = b.pid AND a.kills = b.kills)  
GROUP BY pid ORDER BY miliago

/*
Step by step:

1. Start at line 7

SELECT pid, MAX(date), name, kills
FROM snapshots GROUP BY pid) AS a

grab the last snapshot date and the kills at that time for each player

label the result a

2. At line 9 we use result a, and join it with the entire snapshot set, but only
take the snapshots with the same kill count because we are only interested
in thier last kill count which we found in step 1,

3. Lines 2,3,4,11

with all the data snapshots for all the last killcounts, we can group them
by player, showing the min and the max, which means, when was the first
time that killcount showed up ( ie the player last played ) and when was
the last time that killcount showed up ( ie the last time msfish checked)

4. strftime - the values from step 3 subtracted from the current time to
make them ago instead of dates

5. order by miliago
sort the players by when they last played


*/
