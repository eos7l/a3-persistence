const express    = require('express'),
    app        = express(),
    passport  = require( 'passport' ),
    Local     = require( 'passport-local' ).Strategy,
    session   = require( 'express-session' ),
    bodyparser = require( 'body-parser' );


const low = require('lowdb');
const path = require("path");
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low( adapter );

// automatically deliver all files in the public folder
// with the correct headers / MIME type.
app.use( express.static( 'public' ) );

// get json when appropriate
app.use( bodyparser.json() );

db.defaults({ users:[] }).write();

/*
// add a user
db.get( 'users' ).push({ name:'bob', age:42 }).write()

// filter users by age
const seniors = db.get( 'users' )
    .filter( user => user.age > 70 )
    .value()
*/


// a simple table to store non-persistent data. for assignment #3
// your data must be persistent between sessions using a database (lowdb)
const users = [
  { username:'charlie', password:'charliee' },
  { username:'sylvia',    password:'poilkjmn' }
]

// all authentication requests in passwords assume that your client
// is submitting a field named "username" and field named "password".
// these are both passed as arugments to the authentication strategy.
const myLocalStrategy = function( username, password, done ) {
  // find the first item in our users array where the username
  // matches what was sent by the client. nicer to read/write than a for loop!
  const user = users.find( __user => __user.username === username );

  // if user is undefined, then there was no match for the submitted username
  if( user === undefined ) {
    /* arguments to done():
     - an error object (usually returned from database requests )
     - authentication status
     - a message / other data to send to client
    */
    return done( null, false, { message:'user not found' })
  }else if( user.password === password ) {
    // we found the user and the password matches!
    // go ahead and send the userdata... this will appear as request.user
    // in all express middleware functions.
    return done( null, { username, password })
  }else{
    // we found the user but the password didn't match...
    return done( null, false, { message: 'incorrect password' })
  }
}

passport.use( new Local( myLocalStrategy ) );
passport.initialize();

passport.serializeUser( ( user, done ) => done( null, user.username ) );

// "name" below refers to whatever piece of info is serialized in seralizeUser,
// in this example we're using the username
passport.deserializeUser( ( username, done ) => {
  const user = users.find( u => u.username === username );
  console.log( 'deserializing:', name );

  if( user !== undefined ) {
    done( null, user )
  }else{
    done( null, false, { message:'user not found; session not restored' })
  }
});

app.use( session({ secret:'cats cats cats', resave:false, saveUninitialized:false }) );
app.use( passport.initialize() );
app.use( passport.session() );

app.post('/test', function( req, res ) {
  console.log( 'authenticate with cookie?', req.user );
  res.json({ status:'success' })
});

app.post(
    '/login',
    passport.authenticate( 'local' ),
    function( req, res ) {
      console.log( 'user:', req.user );
      res.json({ status:true })
    }
);






app.listen( process.env.PORT )