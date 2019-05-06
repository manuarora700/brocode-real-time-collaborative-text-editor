var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var config = require('./config');

passport.serializeUser(function (user, done) {
	done(null, user._id);
});

passport.deserializeUser(function (id, done) {
	User.findOne({_id: id}, function(err, user) {
		done(err, user);
	})
});

passport.use(new LocalStrategy({
		usernameField: 'email'
	},
	function (username, password, done) {
		User.findOne({email: username}, function(err, user) {
			if(err) return done(err);
			if(!user) {
				return done(null, false, {
					message: 'Incorrect username or password'
				});
			}
			if(!user.validPassword(password)) {
				return done(null, false, {
					message: 'Incorrect username or Password'
				});
			}
			return done(null, user);
		})
	}

));

passport.use(new FacebookStrategy({
		clientID: config.clientID,
		clientSecret: config.clientSecret,
		callbackURL: 'http://localhost:3000/auth/facebook/callback',
		profileFields: ['id', 'displayName', 'email']
	}, function(token, refreshToken, profile, done){
		User.findOne({'facebookId': profile.id}, function(err, user) {
			if(err) return done(err);
			if(user) {
				return done(null, user);
			} else {
				User.findOne({email: profile.emails[0].value}, function(err, user) {
					if(user) {
						user.facebookId = profile.id
						return user.save(function(err) {
							if(err) return done(null, false, {message: 'cant save user'});
							return done(null, user);
						})
					}

					var user = new User();
					user.name = profile.displayName;
					user.email = profile.emails[0].value;
					user.facebookId = profile.id
					user.save(function(err) {
						if(err) return done(null, false, {message: 'cant save'});
						return done(null, user);
					})
				})
			}
		})
	}
));