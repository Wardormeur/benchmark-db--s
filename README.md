The goal of this repo is to figure a way to still make proper use of Relational DB in µservices
with the lowest read latency
So far :

[x] IN query with separated queries

[] IN query with consolidated data

[x] reference JOIN

[] cost of transport
  - small (id) vs large (context)

[] cross db join (dblink)

[] cost of transport (separate query µs, fdw)

[] separate caching for read (memcache, redis) with transformed data

To look into : 
pre-indexing to simulate real prod env
Save results into proper format
