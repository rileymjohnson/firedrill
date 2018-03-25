
// load user model
var User = require('../models/user.js');
var School = require('../models/school.js');

module.exports = function(app, passport){

	// this will serve the login page to the user first!
	// if login is successful, then the server can serve the chat page
	app.get('/', function(req, res){
		School.find({}, function(err, schools) {
		  if (err) throw err;
		  res.render('login.ejs', {
		  	message: "",
		  	schools: schools
		  });
		});
	});
	
	// show the login page 
	app.get('/login', function(req, res){
		School.find({}, function(err, schools) {
		  if (err) throw err;
		  res.render('login.ejs', {
		  	message: req.flash('loginMessage'),
		  	schools: schools
		  });
		});
	});
	
	// when server receives a POST request to /login, need to check form input 
	// and authenticate 
	app.post('/login', passport.authenticate('local-login', {
		failureRedirect: '/login',
		failureFlash: true
	}), function(req, res){
		res.redirect('/app?school=' + req.body.school);
	});
	
	// main app page
	app.get('/app', function(req, res){
		School.findById(req.query.school, function(err, school) {
			school.zones.forEach(function(zone) {
				var totalPresent = 0;
				var total = 0;
				zone.rooms.forEach(function(room) {
					if (room.periods[school.period]) {
						total++;
						if (room.status) {
							totalPresent++;
						}
					}
				})
				zone.currentPercent = Math.round((totalPresent / total) * 100)
			})
			res.render('index.ejs', {
				user: req.user, 	// get user name from session and pass to template,
				school: school
			});
		});
	});
	
	// show logout page 
	// https://stackoverflow.com/questions/13758207/why-is-passportjs-in-node-not-removing-session-on-logout
	app.get('/logout', function(req, res){
		// remove username from current users list 
		req.logout(); 			// this is a passport function
		res.redirect('/');  	// go back to home page 
	});
	
	// middleware function to make sure user is logged in
	function isLoggedIn(req, res, next){
		
		// if user is authenticated, then ok
		if(req.isAuthenticated()){
			return next();
		}

		// if not authenticated, take them back to the home page 
		res.redirect('/');
	}

}
