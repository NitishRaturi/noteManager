var assert = require("assert");
var mongodb = require('mongodb');
var mongoClient = mongodb.MongoClient;
var db;

function initDb(callback) {
    if (db) {
        console.log("Trying to init DB again!");
        return callback(null, db);
    }
    mongoClient.connect('mongodb://nitishr:nitishr5@ds2131-83.mlab.com:13183/notemanagerdb',
    { useNewUrlParser: true }, function (err, client) {
        if(err){
            console.log("Error in connecting to notemanagerdb - "+ err);
            return err;
        }
        if (client) {
            db = client.db('notemanagerdb');
            //db = client.db('nitish');
            console.log('Connected to MongoDB');
        }
        return callback(null, db);
    });
}

function getDb() {
    assert.ok(db, "Db has not been initialized. Please called init first.");
    return db;
}

function isEmpty(obj) {
    console.log('obj');
    console.log(JSON.stringify(obj)); 
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return JSON.stringify(obj) === JSON.stringify({});
}

module.exports = {
    getDb,
    initDb,
    isEmpty
};