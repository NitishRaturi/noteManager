const express = require('express');
var router = express.Router();
const getDb = require("./../db").getDb;
var isEmpty = require("./../db").isEmpty;
var bodyParser = require('body-parser');
var ObjectId = require('mongodb').ObjectID;

//create new book
router.post('/', function (req, res) {
    var db = getDb();
    console.log('req.body');
    console.log(req.body);

    if(isEmpty(req.body)) {
        res.send('Empty Object');
        return;
    }

    db.collection('books').insert(req.body, function (err, result) {
        if (err) {
            res.send('Error');
        }
        else {
                res.send('Success');
        }
    });

    return;
});

// See all books of the system
router.get('/', function (req, res) {
    var db = getDb();

    var valuesIncluded = {"bookName":1 , "_id":0};

    db.collection('books').find({},valuesIncluded).toArray(function(err, data) {
        res.send(data);
    })
    return;;
});

//See a particular book
router.get('/:bookId/', function (req, res) {
    var db = getDb();

    console.log('req.body');
    console.log(req.body);

    var uid = req.params.userId;
    //uid = uid.toString();
    console.log(uid);

    var myquery = { "_id": ObjectId(uid) };

    db.collection('books').find(myquery,{}).toArray(function(err, data) {
        res.send(data);
    });
    return;
});

//Update a book's details
router.put('/:bookId/', function (req, res) {
    var db = getDb();

    console.log('req.body');
    console.log(req.body);

    if(isEmpty(req.body)) {
        res.send('Empty Object');
        return;
    }

    var bid = req.params.bookId;
    console.log(bid);

    var myquery = { "_id": ObjectId(bid) };
    var newvalues = { $set: req.body };

    db.collection('books').updateOne(myquery, newvalues, (function(err, data) {
            if (err) {
                res.send('Error');
            }
            else {
                    res.send('Success');
            }
        }));
    return;
});

//Delete a book's details
router.delete('/:bookId/', function (req, res) {
    var db = getDb();
    var bid = req.params.bookId;
    console.log(bid);

    var myquery = { "_id": ObjectId(bid) };

    db.collection('books').deleteOne(myquery, (function(err, data) {
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