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
