// controllers/result1Controllers.js

// Displays only the raw response

// const db = require('../config/db');

exports.get= (req, res) => { 

    let sqlquery = "SHOW TABLES";
    // let sqlquery = "SELECT * FROM AIRPORTS LIMIT 10";
    db.query(sqlquery, "no word", (err, result)=> {
        if(err){
            return concole.error("No database connection");
        } else {
            res.send(result);
        }
    })

};