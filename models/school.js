// school model 

// required tools 
var mongoose = 	require('mongoose');
var bcrypt 	 = 	require('bcrypt-nodejs');

// define schema for user model.
// only handling local authentication
var schoolSchema = mongoose.Schema({
	name: String,
	identifier: String,
	periods: [Number],
	period: Number,
	passCode: String,
	zones: [{
		name: String,
		rooms: [{
			name: String,
			status: Boolean,
			periods: {
				"1": Boolean,
				"2": Boolean,
				"3": Boolean,
				"4": Boolean,
				"5": Boolean,
				"6": Boolean,
				"7": Boolean,
			}
		}]
	}]
});

// generate a hash with a given password.
schoolSchema.methods.generateHash = function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

// check if a password is valid (i.e. don't allow certain characters)
schoolSchema.methods.validPassword = function(password){
	return bcrypt.compareSync(password, this.passCode);
}


module.exports = mongoose.model('School', schoolSchema, 'Schools'); 