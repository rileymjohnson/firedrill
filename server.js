// set up server 
var express = 			require('express');
var app = 				express();

// the order is important here!
var port = 				process.env.PORT || 3000; 
var http = 				require('http').Server(app);
var io = 				require('socket.io')(http);
http.listen(port);

var mongoose = 			require('mongoose');
var passport = 			require('passport');
var flash = 			require('connect-flash');

var cookieParser = 		require('cookie-parser');
var bodyParser = 		require('body-parser');
var session = 			require('express-session');
var assert =		    require('assert');
var mongoStore = 		require("connect-mongo");

// './' is current directory 
var configDB = require('./config/database.js');
// need to connect the database with the server! 
mongoose.connect(configDB.url, {
	useMongoClient: true
});
// link up passport as well
require('./config/passport.js')(passport);

// set up the stuff needed for logins/registering users/authentication 
app.use(cookieParser()); 		// read cookies, since that is needed for authentication
app.use(bodyParser.urlencoded({ extended: true })); // this gets information from html forms
app.use(bodyParser.json());       // this gets json from requests
app.set('view engine', 'ejs');	// set view engine to ejs - templates are definitely worth it for this kind of project. 

app.use(session({
	secret: 'aweawesomeawesomeawesomesome',
	resave: true,
    saveUninitialized: true
})); // secret key for passport

// make a sessionMiddleware variable to link up mongoStore in order to log all the current sessions
// that way we can access all the current users and list them in the chatroom 
var sessionMiddleware = session({
	resave: true,
    saveUninitialized: true,
	secret: 'aweawesomeawesomeawesomesome',
	store: new (mongoStore(session))({
		url: configDB.url
	})
});

app.use(sessionMiddleware);			// use the sessionMiddlware variable for cookies 			
app.use(passport.initialize());	   	// start up passport
app.use(passport.session());	    // persistent login session (what does that mean?)
app.use(flash()); 		            // connect-flash is used for flash messages stored in session.

// pass app and passport to the routes 
require('./routes/routes.js')(app, passport);

// this stuff is for handling the chat functionality of the application.

// connect the sessionMiddleware with socket.io so we can get user session info 
io.use(function(socket, next){
	sessionMiddleware(socket.request, {}, next);
});

// array to store all currently logged in users 
var users = [];
io.on('connection', function(socket){
	
	socket.on('update', function(msg){
		io.emit('update', msg);
	});

});

http.listen(port, function(){
	console.log('listening on *:' + port);
});

