// user model 

// required tools 
var mongoose = 	require('mongoose');
var bcrypt 	 = 	require('bcrypt-nodejs');

// define schema for user model.
// only handling local authentication
var userSchema = mongoose.Schema({
	username: String,
	password: String
});

// generate a hash with a given password.
userSchema.methods.generateHash = function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

// check if a password is valid (i.e. don't allow certain characters)
userSchema.methods.validPassword = function(password){
	console.warn("tried password", password)
	console.warn("actual password", this.passCode)
	return bcrypt.compareSync(password, this.passCode);
}

module.exports = mongoose.model('User', userSchema, 'userData'); 