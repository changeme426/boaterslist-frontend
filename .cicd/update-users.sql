create table auth0users (
    Id varchar(500) PRIMARY KEY,
    Email varchar(500)
);
load data local infile 'data/boaterslist-users.csv' into table auth0users
 fields terminated by ','
 enclosed by '"'
 lines terminated by '\n'
 (Id, Email);
UPDATE Locations L SET L.ownerAuthEmail = (SELECT distinct AU.Email FROM auth0users AU, Companies C WHERE
  AU.Email IS NOT NULL AND AU.Id = C.ownerAuthUserId AND C.ownerAuthUserId IS NOT NULL AND C.companyId = L.companyId);
