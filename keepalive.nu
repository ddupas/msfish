clear
print (ansi white)
print white
print (ansi red)
print red
print ===========
loop {
	try { 
		print ===========
		http get https://msfish.onrender.com 
		print -n (ansi white)
	} catch { 
		print -n (ansi red)
	} 
	
	print -n (random chars --length 5) 
	
	
	[ ((random int) mod 60) ,
	((random int) mod 60),
	((random int) mod 60),
	((random int) mod 60) ,
	((random int) mod 60) ] | each {|r|
		print -n $" ($r) "
		sleep ( $"($r)sec" | into duration )
	}
} 
