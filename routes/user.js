const express = require('express');
var router = express.Router();
var getDb = require("./../db").getDb;
var isEmpty = require("./../db").isEmpty;
var bodyParser = require('body-parser');
var ObjectId = require('mongodb').ObjectID;

//create new user
router.post('/', function (req, res) {
    var db = getDb();
    console.log('req.body');
    console.log(req.body);

    if(isEmpty(req.body)) {
        res.send('Empty Object');
        return;
    }

    db.collection('users').insertOne(req.body, function (err, result) {
        if (err) {
            res.send('Error');
        }
        else {
                res.send('Success');
        }
    });

    return;
});

// See all users
router.get('/', function (req, res) {
    var db = getDb();

    var valuesIncluded = {"username":1 , "_id":0};

    db.collection('users').find({},valuesIncluded).toArray(function(err, data) {
        res.send(data);
    })
    return;;
});

//See a particular user
router.get('/:userId/', function (req, res) {
    var db = getDb();

    var uid = req.params.userId;
    uid = uid.toString();
    console.log(uid);

    var myquery = { "_id": ObjectId(uid) };

    db.collection('users').find(myquery,{}).toArray(function(err, data) {
        res.send(data);     
    });
    return;
});

//Update a user's details
router.put('/:userId/', function (req, res) {
    var db = getDb();

    console.log('req.body');
    console.log(req.body);

    var uid = req.params.userId;
    console.log(uid);

    var myquery = { "_id": ObjectId(uid) };
    var newvalues = { $set: req.body };

    db.collection('users').updateOne(myquery, newvalues, (function(err, data) {
            if (err) {
                res.send('Error');
            }
            else {
                    res.send('Success');
            }
        }));
    return;
});

//Delete a user's details
router.delete('/:userId/', function (req, res) {
    var db = getDb();

    var uid = req.params.userId;
    console.log(uid);

    var myquery = { "_id": ObjectId(uid) };

    db.collection('users').deleteOne(myquery, (function(err, data) {
            if (err) {
                res.send('Error');
            }
            else {
                    res.send('Success');
            }
        }));
    return;
});

//User add a note in a book
router.post('/:userId/books/:bookId/notes/', function (req, res) {
    var db = getDb();
    console.log('req.body');
    console.log(req.body);

    var uid = req.params.userId;
    var bid = req.params.bookId;
    bid = bid.toString();

    if(isEmpty(req.body)) {
        res.send('Empty Object');
        return;
    }
    var tempNoteId;
    db.collection('notes').insertOne(req.body, function (err, result) {
        if (err) {
            res.send('Error in inserting collection to notes');
        }
        else {
                res.send('Success in inserting collection to notes');
                console.log("result");
                console.log(result);
                console.log(JSON.stringify(result));
                tempNoteId = result.ops[0]._id;
                console.log(tempNoteId);
                var myquery = { "_id": ObjectId(uid)};
                var key = "book." + bid;
                var newvalues = { $push: { } };
                newvalues['$push'][key+'.notes'] = tempNoteId;
                console.log("newvalues");
                console.log(JSON.stringify(newvalues));

                db.collection('users').updateOne(myquery, newvalues, function(err, data) {
                    if (err) {
                        res.send('Error in inserting collection to users');
                    }
                    else {
                        //res.send( 'Success in inserting collection to users');
                        console.log("data");
                        console.log(JSON.stringify(data));
                    }
                });
        }
    });

    

    return;
});


//Give a book to user
router.post('/:userId/books/:bookId/', function (req, res) {
    var db = getDb();

    var uid = req.params.userId;
    var bid = req.params.bookId;

    console.log(uid);
    console.log(bid);

    var myquery = { "_id": ObjectId(uid) };
    

    var userBody;

    db.collection('users').find(myquery,{}).toArray(function(err, data) {

        console.log("data");
        console.log(data);
        userBody = data;
        console.log("userBody");
        console.log(JSON.stringify(userBody));
        userBody[0].book[bid] = [];

        var newvalues = { $set: userBody[0] };

        console.log("userBody");
        console.log(userBody);

        console.log("newvalues");
        console.log(JSON.stringify(newvalues));

        db.collection('users').updateOne(myquery, newvalues, (function(err, data) {
            if (err) {
                res.send('Error');
            }
            else {
                    console.log(data);
                    res.send('Success');
            }
        }));    
    });

    
    return;
});


//Get all books of a user
router.get('/:userId/books', function (req, res) {
    var db = getDb();

    var uid = req.params.userId;
    uid = uid.toString();
    console.log(uid);

    var myquery = { "_id": ObjectId(uid) };
    var projection = { "_id":0, "book":1 };

    db.collection('users').findOne(myquery, {projection:{ "_id":0, "book":1 }}, function(err, data) {
        console.log("data");
        console.log(data);
        res.send(data)    ;
    });
});

//Get details of a particular book of a user
router.get('/:userId/books/:bookId/', function (req, res) {
    var db = getDb();

    var uid = req.params.userId;
    var bid = req.params.bookId;
    uid = uid.toString();
    console.log(uid);

    var myquery = { "_id": ObjectId(uid) };
    var projection = { "_id":0, "book":1 };

    db.collection('users').findOne(myquery, {projection:{ "_id":0, "book":1 }}, function(err, data) {
        if(err){
            res.send('Error');
        }
        else {  
            console.log("data");
            console.log(data);

            if(data.book[bid]){
                res.send(data.book[bid]);
            }
        }
    });
    return;
});

//Get all notes of a user
    router.get('/:userId/notes', function (req, res) {
    var db = getDb();

    var uid = req.params.userId;
    uid = uid.toString();
    console.log(uid);
    var allNotes=[];

    var myquery = { "_id": ObjectId(uid) };

    db.collection('users').findOne(myquery, {projection:{ "_id":0, "book":1 }}, function(err, data) {

        data = data.book;
        console.log("data");
        console.log(data);

        for(var key in data){
            console.log("key");
            console.log(key);
            var tempArr = data[key];

            console.log("tempArr");
            console.log(tempArr);

            for(var note in tempArr){
                allNotes.push(tempArr[note]);
            }
        }
        console.log("allNotes");
        console.log(allNotes);
        res.send(allNotes)    ;
    });
});

// Get a particular note of a user
router.get('/:userId/notes/:noteId', function (req, res) {
    var db = getDb();

    var uid = req.params.userId;
    uid = uid.toString();
    var nid = req.params.noteId;
    nid = nid.toString();

    console.log(uid);
    console.log(nid);

    var myquery = { "_id": ObjectId(uid) };

    db.collection('users').findOne(myquery, {projection:{ "_id":0, "book":1 }}, function(err, data) {

        data = data.book;
        console.log("data");
        console.log(data);

        for(var key in data){
            console.log("key");
            console.log(key);
            var tempArr = data[key].notes;

            console.log("tempArr");
            console.log(tempArr);

            for(var note in tempArr){
                if(tempArr[note] == nid){
                    var myNotequery =  { "_id": ObjectId(nid) };
                    var valuesIncluded = {projection:{"noteName":1 , "noteBody":1, "_id":0}};

                    db.collection('notes').find(myNotequery,valuesIncluded).toArray(function(err, data) {
                        res.send(data);
                    })
                }
            }
        }
    });
});

// Get all notes of a particular book of a user
// router.get('/:userId/books/:bookId/notes', function (req, res) {
//     var db = getDb();

//     var uid = req.params.userId;
//     uid = uid.toString();
//     var bid = req.params.bookId;
//     bid = bid.toString();
//     console.log(uid);
//     console.log(bid);
//     var allParitcularNotes=[];

//     var myquery = { "_id": ObjectId(uid) };

//     db.collection('users').findOne(myquery, {projection:{ "_id":0, "book":1 }}function(err, data) {

//         console.log("data");
//         console.log(data);

//         allParitcularNotes = data.book[bid].notes;
//         console.log("allParitcularNotes");
//         console.log(allParitcularNotes);

//         var allParitcularNotesBody = {};
//         var count = allParitcularNotes.length - 1;
//         console.log('count');
//         console.log(count);

//         for( var note in allParitcularNotes) {
//             console.log(note);

//             console.log('allParitcularNotes[note]');
//             console.log(JSON.stringify(allParitcularNotes[note]));

//             var myNotequery = { "_id": ObjectId(allParitcularNotes[note]) };
//             var valuesIncluded = {projection:{"noteName":1 , "noteBody":1, "_id":0}};


//                     (function(query) {
//                         db.collection('notes').find(query,valuesIncluded).toArray(function(err, data) {
//                             allParitcularNotesBody.push(data);

                            
//                     })
//                 })(myNotequery);
//             }
//     });
// });

//Get particular note of a particular book of a user
router.get('/:userId/books/:bookId/notes/:noteId', function (req, res) {
    var db = getDb();

    var uid = req.params.userId;
    uid = uid.toString();
    var bid = req.params.bookId;
    bid = bid.toString();
    var nid = req.params.noteId;
    nid = nid.toString();
    console.log(uid);
    console.log(bid);
    console.log(nid);

    var allParitcularNotes=[];

    var myquery = { "_id": ObjectId(uid) };

    db.collection('users').findOne(myquery, {projection:{ "_id":0, "book":1 }}, function(err, data) {

        console.log("data");
        console.log(data);

        allParitcularNotes = data.book[bid].notes;
        console.log("allParitcularNotes");
        console.log(allParitcularNotes);

        for(var note in allParitcularNotes){
            if(allParitcularNotes[note] == nid){
                var myNotequery =  { "_id": ObjectId(nid) };
                var valuesIncluded = {projection:{"noteName":1 , "noteBody":1, "_id":0}};

                db.collection('notes').find(myNotequery,valuesIncluded).toArray(function(err, data) {
                    res.send(data);
                })
            }
        }
    });
});


module.exports = router;