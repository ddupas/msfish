/*

miliago - last check ago
lsmiliago - last seen ago
300000 - 5 minutes in mili
55595258

unixepoch(now)
*/

select pid from (
select *, min(nextupdatein) from (
select pid, 
    miliago as lastplayedago, 
    lsmiliago as lastcheckedago, 
    miliago - lsmiliago as difference,
    miliago / 4 as updateinterval,
    miliago / 4 - lsmiliago nextupdatein
from playerstatus where lsmiliago > 300000 ))