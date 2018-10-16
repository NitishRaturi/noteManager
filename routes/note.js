const express = require('express');
var router = express.Router();
const getDb = require("./../db").getDb;
var isEmpty = require("./../db").isEmpty;
var bodyParser = require('body-parser');
var ObjectId = require('mongodb').ObjectID;

// See all notes
router.get('/', function (req, res) {
    var db = getDb();

    var valuesIncluded = {"noteName":1 , "noteBody":1, "_id":0};

    db.collection('notes').find({},valuesIncluded).toArray(function(err, data) {
        res.send(data);
    })
    return;;
});

//Update a particular Note
router.put('/:noteId/', function (req, res) {
    var db = getDb();

    console.log('req.body');
    console.log(req.body);

    if(isEmpty(req.body)) {
        res.send('Empty Object');
        return;
    }

    var nid = req.params.noteId;
    console.log(nid);

    var myquery = { "_id": ObjectId(nid) };
    var newvalues = { $set: req.body };

    db.collection('notes').updateOne(myquery, newvalues, (function(err, data) {
            if (err) {
                res.send('Error');
            }
            else {
                    res.send('Success');
            }
        }));
    return;
});

//Delete a Note
router.delete('/:noteId/', function (req, res) {
    var db = getDb();
    var nid = req.params.noteId;
    console.log(nid);

    var myquery = { "_id": ObjectId(nid) };

    db.collection('notes').deleteOne(myquery, (function(err, data) {
            if (err) {
                res.send('Error');
            }
            else {
                    res.send('Success');
            }
        }));
    return;
});


module.exports = router;