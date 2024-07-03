// Import libraries
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const mustacheExpress = require('mustache-express');

// Initialise objects and declare constants
const app = express();
const webPort = 8088;

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

global.db = db;

require("./routes/main")(app);

app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', './templates');
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(webPort, ()=> console.log(`DADT_midterm is listening on port ${webPort}!`));

