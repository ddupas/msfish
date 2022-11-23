/*
select * from
(select name,date,kills, count(kills) as dupcount from snapshots
group by kills, name)
where dupcount>2
as t1
join 
select row_id from snapshots
as t2
on t1.kills=t2.kills
*/
select * from (
select pid, kills, count(kills) as dupcount from snapshots 
group by kills, pid )
as a
/*
JOIN
snapshots as b
on
a.pid = b.pid
*/
