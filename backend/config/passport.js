const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const Auth = require('../models/auth.model');
const bcrypt = require('bcrypt');

module.exports = (passport) => {
  // Local Strategy for phone/password login
  passport.use(new LocalStrategy({
    usernameField: 'phone',
    passwordField: 'password'
  }, async (phone, password, done) => {
    try {
      // Find user by phone number
      const user = await Auth.findOne({ phone });
      
      // User not found
      if (!user) {
        return done(null, false, { message: 'Invalid phone number or password' });
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return done(null, false, { message: 'Invalid phone number or password' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));

  // JWT Strategy
  passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
  }, async (jwt_payload, done) => {
    try {
      const user = await Auth.findById(jwt_payload.id);
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  }));

  if (
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_CALLBACK_URL
  ) {
    // Google OAuth Strategy
    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists
        let user = await Auth.findOne({ google_id: profile.id });
        
        if (user) {
          return done(null, user);
        }
  
        // Create new user
        user = await Auth.create({
          google_id: profile.id,
          email: profile.emails[0].value,
          role: 'user'
        });
  
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }));
  }
  

  // Local Strategy (Phone + Password)
  passport.use(new LocalStrategy({
    usernameField: 'phone',
    passwordField: 'password'
  }, async (phone, password, done) => {
    try {
      const user = await Auth.findOne({ phone });
      
      if (!user) {
        return done(null, false, { message: 'User not found' });
      }

      const isMatch = await user.comparePassword(password);
      
      if (!isMatch) {
        return done(null, false, { message: 'Invalid password' });
      }

      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }));
};
