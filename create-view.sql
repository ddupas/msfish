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