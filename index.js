// Import libraries
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const mustacheExpress = require('mustache-express');

// Initialise objects and declare constants
const app = express();
const webPort = 8088;

const db = require('./config/db');
global.db = db;

require("./routes/main")(app);

app.use(bodyParser.urlencoded({ extended: true }));

app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', './views');

app.listen(webPort, ()=> console.log(`DADT_midterm is listening on port ${webPort}!`));

// file splitting: https://blog.logrocket.com/node-js-project-architecture-best-practices/