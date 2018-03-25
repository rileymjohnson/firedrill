
var LocalStrategy = require('passport-local').Strategy;

// load school model
var School = require('../models/school.js');

// expose the following function to rest of application
module.exports = function(passport){
	
	// serialize the school for the session
	passport.serializeUser(function(school, done){
		done(null, school.id);
	});
	
	// unserialize the school 
	passport.deserializeUser(function(id, done){
		School.findById(id, function(err, school){
			done(err, school);
		});
	});
	
	/****
	
		this section takes care of local login
	
	****/
	passport.use('local-login', new LocalStrategy({
		usernameField: 'school',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, school, password, done){ // callback with school and password from form 
		School.findOne({'_id' : school}, function(err, school){
			
			if(err){
				return done(err);
			}
			
			// if no school found, return error message 
			if(!school){
				// req.flash sets flashdata using connect-flash
				return done(null, false, req.flash('loginMessage', 'the password was incorrect'));
			}
			
			// if school is found but password incorrect
			if(!school.validPassword(password)){
				return done(null, false, req.flash('loginMessage', 'The password was incorrect'));
			}
			
			// success, return school
			return done(null, school);
		});
	}));
	
	
}