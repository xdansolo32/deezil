var mongoose = require('mongoose');

var MONGO_DB = process.env.MONGO_DB || 'mongodb://localhost/test';
mongoose.connect(MONGO_DB);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'FUCKING connection error:'));
db.once('open', function callback () {
  console.log('FUCK YEAH!!! DA DEEBEE IS OPEN!!');
});


var loan = require('./loans');