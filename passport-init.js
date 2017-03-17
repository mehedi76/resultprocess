var LocalStrategy = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = function(passport){

	passport.serializeUser(function(user,done){
		console.log("Serialize user: " + user.name);
		done(null, user._id);
	});

	passport.deserializeUser(function(id,done){
		User.findById(id,function(err,user){
			console.log("Deserialize user: " + user.username);
			done(null,user);
		});
		
	});


	passport.use('login',new LocalStrategy({

		passReqToCallback : true

	},function( req, username, password, done){
		console.log("Username: " + username + " password: " + password);

		User.findOne({username: username},function(err,user){
			if(err){
				console.log("database error");
				return done(err);
			}

			if(!user){
				console.log("User not found!");
				return done(null, false);
			}

			if(!isValidPassword(user,password)){
				console.log("Invalid password");
				return done(null,false);
			}

			//console.log(user);
			return done(null,user);
		});
	}));



	passport.use('/signup', new LocalStrategy({

		passReqToCallback: true

	},function(req,username,password,done){
		User.findOne({
			username : username
		},function(err,user){
			if(err){
				console.log("Error when finding in database");
				return done(err);
			}

			if(user){
				console.log("User already exists");
				return done(null, false);
			}else{
				var newUser = new User();
				newUser.username = username;
				newUser.password = createHash(password);

				newUser.save(function(err,getUser){
					if(err){
						console.log("database failure during save in sign up")
						return done(null,false);
					}

					console.log("Registration successful for user: " + username);
					return done(null, getUser);
				});

			}


		});

	}));





	var isValidPassword = function(user,password){
		return bCrypt.compareSync(password,user.password);
	};

	var createHash = function(password){
		return bCrypt.hashSync(password, bCrypt.genSaltSync(10),null);
	};
};