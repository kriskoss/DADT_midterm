const mysql = require('mysql');

const db = mysql.createConnection({
    host:"localhost",
    user: "user1_dadt",
    password: "",
    database: "dadt_midterm"
});

db.connect((err)=>{
    if (err){
        throw err;
    }
    console.log("Connected to the database 'dadt_midterm'");
})

module.exports = db;
