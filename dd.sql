/*
select pid, kills, count(kills) as ck, max(date) as maxd ,min(date) as mind
from snapshots
group by pid,kills
*/



delete from snapshots where rowid in
(
select rowid from (
select * from (

select * from
(select pid, kills, count(kills) as ck, max(date) as maxd ,min(date) as mind
from snapshots
group by pid,kills
having
ck>2) as s1
join
(select date,pid,kills,rowid from snapshots)
as s3
on s1.pid=s3.pid and s1.kills=s3.kills
)
where
date<>maxd and date<>mind
)
);
vacuum;


/*

select pid, kills, count(kills), max(date),min(date) from (


	select * from
	(select * from (

		select pid,kills,count(kills) as ck
		from snapshots
		group by pid,kills
	)
	where (ck>2))
	as a
	join

	(select pid,kills,date from snapshots)
	as b

	on
	a.pid = b.pid and a.kills = b.kills
)
group by kills





select * from
(select name,date,kills, count(kills) as dupcount from snapshots
group by kills, name)
where dupcount>2
as t1
join 
select row_id from snapshots
as t2
on t1.kills=t2.kills

DELETE FROM table t1
WHERE t1.recordDate <>
  (SELECT MAX(recordDate)
   FROM table t2
   WHERE t2.CaseKey = t1.CaseKey)


select name,kills from snapshots s1
where s1.date <>
(select  from snapshots s2
where s1.kills=s2.kills)
group by pid
*/

/*

select  max(date) as maxd, min(date) as mind, kills, pid from
( select * from (
select * from (
select pid, kills, count(kills) as dupcount from snapshots 
group by kills, pid )
as a
where (dupcount > 2)
) as c
join
(select rowid, date, kills, pid  from snapshots) as b
on
c.kills = b.kills and c.pid = b.pid)
group by kills,pid
order by kills

where maxd = date
*/
/*

SELECT SupplierName
FROM Suppliers
WHERE EXISTS (SELECT ProductName FROM Products
WHERE Products.SupplierID = Suppliers.supplierID AND Price < 20);
JOIN
snapshots as b
on
a.pid = b.pid


select a.pid, a.Kills from snapshots as a
JOIN
snapshots as b
on
a.pid = b.pid

SELECT
    ID AS NON_MAX_VALUES, (SELECT MAX(ID) FROM TABLE ) AS MAX_VALUE
FROM
    TABLE
GROUP BY
    ID
HAVING
    COUNT(*)>1
    AND
    ID NOT IN (SELECT MAX(ID) FROM TABLE)


*/
