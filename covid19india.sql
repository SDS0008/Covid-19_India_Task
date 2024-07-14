//District Table...
 
CREATE TABLE district (districtId INTEGER  PRIMARY KEY AUTOINCREMENT,
district_name TEXT,
state_id  INTEGER,
cases	INTEGER,
cured	INTEGER,
active	INTEGER,
deaths	INTEGER,
FOREIGN KEY(state_id) REFERENCES state(state_id) ON DELETE CASCADE);


DROP TABLE district;

INSERT INTO district(

district_name ,
state_id ,
cases	,
cured	,
active,	
deaths
) 
VALUES
 ("DIST.1",1,1234,1000,225,9),
 ("DIST.2",1,2345,2000,325,19),
 ("DIST.3",1,4505,4105,385,15),
 ("DIST.1",2,5634,5300,275,25),
 ("DIST.2",2,234,200,230,5),
 ("DIST.1",3,6410,6100,295,5),
 ("DIST.2",3,900,800,90,10),
 
 ("DIST.1",4,8410,8100,295,5),
 ("DIST.2",4,9100,8800,280,20);




INSERT INTO district(

district_name ,
state_id ,
cases	,
cured	,
active,	
deaths
) 
VALUES
 ("DIST.8",8,1234,1000,225,9);

 
 SELECT * FROM district;



 //State Table...

CREATE TABLE state (
state_id	INTEGER PRIMARY KEY,
state_name	TEXT,
population	INTEGER
);

SELECT * FROM state;

INSERT INTO state(
state_id,
state_name,
population
) 
VALUES
 (1,"STATE.1",300000),
 (2,"STATE.2",500000),
 (3,"STATE.3",800000);

INSERT INTO state(
state_id,
state_name,
population
) 
VALUES
 (4,"STATE.4",500000);

//natural joins....
SELECT 
district_id,
district_name ,
state_id ,
state.state_name,
cases	,
cured	,
active,	
deaths
            FROM
             district NATURAL join state
              WHERE state_id = 1;

              
SELECT 
 SUM(cases) AS totalCases,
 SUM(cured) AS totalCured,
 SUM(active) AS totalActive,
 SUM(deaths) AS totalDeaths
            FROM
             district NATURAL join state
              WHERE state_id = 1;
