const initDb = require("./db").initDb;
const getDb = require("./db").getDb;
const express = require('express');
const app = express();
var bodyParser = require('body-parser');
// -------------------------------------------------------------------------------------
const port = 5001;
var requests = require('./routes/requests.js');

initDb(function (err) {
        app.listen(port, function (err) {
            if (err) {
                throw err; 
            }
            console.log("API Up and running on port " + port);
        });
});

app.use(bodyParser.json());
app.use('/',requests);


// --------------------------------------------------------------------------------------------

module.exports = app;