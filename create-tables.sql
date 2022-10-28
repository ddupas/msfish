CREATE TABLE "players" (
	"id"	TEXT NOT NULL,
	"name"	TEXT NOT NULL,
	"snapfreq"	TEXT NOT NULL,
	"lastsnap"	TEXT,
	"discord"	TEXT,
	"status"	TEXT,
	PRIMARY KEY("id")
);
INSERT INTO players (id,name,snapfreq,lastsnap,discord,status)
	VALUES 
	('234','Milanzzz','6','now','432#234','active'),
	('1234','azMilanzzz','6','now','432#234','active'),
	('2234','zazMilanzzz','6','now','432#234','active'),
	('3234','zzazMilanzzz','6','now','432#234','active')
	ON CONFLICT(id) DO UPDATE SET
	 name = excluded.name,
	 snapfreq = excluded.snapfreq,
	 lastsnap = excluded.lastsnap,
	 discord = excluded.discord,
	 status = excluded.status;
	