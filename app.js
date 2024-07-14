const express = require("express");

const {open} = require("sqlite");

const sqlite3 = require("sqlite3");

const path = require("path");

const app = express();

const dbPath = path.join(__dirname,"covid19india.db");

app.use(express.json());

let db = null;

const initilaizeDbAndServer = async()=> {

    try {
        db = await open({
          filename: dbPath,
          driver: sqlite3.Database,
        });
        const port = 4200;
        app.listen(port, () => {
          console.log(`DB Connected\nServer Running at ${port}`);
        });
      } catch (e) {
        console.log(`DB Error: ${e.message}`);
        process.exit(1);
      }

};

initilaizeDbAndServer();

//table names are STATE and DISTRICT
//Add districts to Database Table...
app.post("/districts/", async(req,res) => {
try {
    const {
        district_name ,
        state_id ,
        cases	,
        cured	,
        active,	
        deaths} = req.body;

 const addDistrictQuery = `
INSERT INTO district(

district_name ,
state_id ,
cases	,
cured	,
active,	
deaths
) 
VALUES(
 '${district_name}',
 ${state_id},
 ${cases},
 ${cured},
 ${active},
 ${deaths});
 `;

        const district = await db.run(addDistrictQuery);

        res.status(201).json({
            message :`District added to the district Table `
        });


} catch (error) {
    console.log("districts" , error.message);
    res.status(500).send("Internal Server Error");
}
});

//Get All States from Table...
app.get("/states/", async(req,res) => {
    try {
     
        const fetchQuery = `SELECT * FROM  state;`;

        const states  = await db.all(fetchQuery);

    
            res.status(200).json({
                message :` Fetched All states from state Table`, states : states
            });
    
    
    } catch (error) {
        console.log("states" , error.message);
        res.status(500).send("Internal Server Error");
    }
    });
    

//Get a Single state from Table...
app.get("/states/:stateId", async(req,res) => {
    try {
     
        const {stateId} = req.params;

        const fetchQuery = `SELECT *  from state WHERE state_id=${stateId};`;

        const singleState  = await db.get(fetchQuery);

    
            res.status(200).json({
                message :` Fetched  stateId : ${stateId} from state Table`, singleState : singleState
            });
    
    
    } catch (error) {
        console.log("states" , error.message);
        res.status(500).send("Internal Server Error");
    }
    });
    

//Update district And Add to Database Table...
app.put("/districts/:districtId", async(req,res) => {
    try {
        const {districtId} = req.params;
        const {district_name,state_id } = req.body;
    
     const updatedistrictQuery =  `UPDATE district SET  district_name = '${district_name}',state_id = ${state_id} WHERE  districtid = ${districtId}`;
     
    
            const district = await db.run(updatedistrictQuery);
    
            res.status(200).json({
                message :`District updated Successfully with district_Id : ${districtId}`
            });
    
    
    } catch (error) {
        console.log("districts" , error.message);
        res.status(500).send("Internal Server Error");
    }
    });

    

//Delete districts from Database Table...
app.delete("/districts/:districtId", async(req,res) => {
    try {
        const {districtId} = req.params;
       
    
     const deletedistrictQuery =  `DELETE FROM district WHERE districtid = ${districtId}`;
     
    
            const district = await db.run(deletedistrictQuery);
    
            res.status(201).json({
                message :` district deleted Successfully with districtId : ${districtId}`
            });
    
    
    } catch (error) {
        console.log("district" , error.message);
        res.status(500).send("Internal Server Error");
    }
    });
    


    //get all districts
app.get("/districts/", async(req,res) => {
    try {
     
        const fetchQuery = `SELECT * FROM  district;`;

        const districts  = await db.all(fetchQuery);

    
            res.status(200).json({
                message :` Fetched All districts from district Table`, districts : districts
            });
    
    
    } catch (error) {
        console.log("districts" , error.message);
        res.status(500).send("Internal Server Error");
    }
    });



    //get names of districts Details by specific state based on state id(natural joins)

    app.get("/districts_state/:stateId/", async(req,res) => {
        try {
         
            const {stateId} = req.params;
    
            const fetchQuery = `SELECT districtid, district_name , state_id , state.state_name, cases, cured, active, deaths
            FROM
             district NATURAL join state
              WHERE state_id = ${stateId};`;
    
            const singleState  = await db.all(fetchQuery);
    
        
                res.status(200).json({
                    message :` Fetched  singleState : ${stateId} `, singleState : singleState
                });
        
        
        } catch (error) {
            console.log("districts" , error.message);
            res.status(500).send("Internal Server Error");
        }
        });


        //get total no.of(cases,active,cured deaths) in a specific state (natural joins)

    app.get("/states_details/:stateId/", async(req,res) => {
        try {
         
            const {stateId} = req.params;
    
            const fetchQuery = `      
SELECT 
 SUM(cases) AS totalCases,
 SUM(cured) AS totalCured,
 SUM(active) AS totalActive,
 SUM(deaths) AS totalDeaths
            FROM
             district NATURAL join state
              WHERE state_id = ${stateId};`;
    
            const stateTotalDetails  = await db.all(fetchQuery);
    
        
                res.status(200).json({
                    message :` Fetched  stateTotalDetails : ${stateId} `, stateTotalDetails : stateTotalDetails
                });
        
        
        } catch (error) {
            console.log("states_details" , error.message);
            res.status(500).send("Internal Server Error");
        }
        });
        
      