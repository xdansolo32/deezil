var mongoose = require('mongoose');
var MONGO_DB = process.env.MONGO_DB || 'mongodb://localhost/test';
mongoose.connect(MONGO_DB);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'FUCKING connection error:'));
db.once('open', function callback () {
  console.log('FUCK YEAH!!! DA DEEBEE IS OPEN!!');
});

var userSchema = mongoose.Schema({
	firstName: String,
	lastName: String,
	email: String,
	age: Number,
	birthday: Date,
	likesGirls: Boolean
});

var transactionSchema = mongoose.Schema({
	transactionId: String,
	//hostHash
	//arrayOfLenders
	maturityDate: Date
})

userSchema.methods.displayStats = function() {
	var fn = this.firstName,
	ln = this.lastName,
	email = this.email,
	age = this.age,
	birthday = this.birthday,
	likesGirls = this.likesGirls;
	console.log("THIS ARE AM THE MONGOOZ DATABASE YOOZIR SKEEMA TESTING AREA!!!! \n")
	console.log("HI, MY NAME IS " + fn + " " + ln);
	console.log("I am " + age + ", and my birthday is " + birthday);
	console.log("If you are wondering and are a girl, my interest in you is: " + likesGirls);
}

var User = mongoose.model('User', userSchema),
	Transaction = mongoose.model('Transaction', transactionSchema);
var daniel = new User({firstName: 'daniel', lastName: 'sun', email:'daniel@sun.com',
	age: 28, birthday: new Date(2013, 02, 20, 1, 1, 1, 1), likesGirls: true});
	
daniel.displayStats();