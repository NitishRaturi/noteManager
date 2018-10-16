var express = require('express');
//var router = express.Router();
var app = express();

var route_user = require('./user.js');
var route_note = require('./note.js');
var route_book = require('./book.js');

app.use('/users',route_user);
app.use('/notes',route_note);
app.use('/books',route_book);



module.exports = app;


return












// initialize our express app
//const app = express.Router();

//app.use('/', route_username);
// app.get('/user_id',route_user_id );
// app.get('/note_id',route_note_id );
// app.get('/routes',route_book_id );
