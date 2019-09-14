const express    = require('express'),
    app        = express(),
    low = require('lowdb');
    db = low( adapter );
    FileSync = require('lowdb/adapters/FileSync');
    adapter = new FileSync('db.json');
    passport  = require( 'passport' ),
    Local     = require( 'passport-local' ).Strategy,
    session   = require( 'express-session' ),
    bodyparser = require( 'body-parser' );
    path = require('path');


// automatically deliver all files in the public folder
// with the correct headers / MIME type.
app.use( express.static( 'public' ) );

// get json when appropriate
app.use( bodyparser.json() );

db.defaults({ users:[] }).write();
/*
// define variables that reference elements on our page
const wishListItems = document.getElementById('dreams');
const dreamsForm = document.forms[0];
const dreamInput = dreamsForm.elements['dream'];

// a helper function that creates a list item for a given dream
const appendNewDream = function(dream) {
  const newListItem = document.createElement('li');
  newListItem.innerHTML = dream;
  dreamsList.appendChild(newListItem);
}

// iterate through every dream and add it to our page
dreams.forEach( function(dream) {
  appendNewDream(dream);
});

// listen for the form to be submitted and add a new dream when it is
dreamsForm.onsubmit = function(event) {
  // stop our form submission from refreshing the page
  event.preventDefault();

  // get dream value and add it to the list
  dreams.push(dreamInput.value);
  appendNewDream(dreamInput.value);

  // reset form
  dreamInput.value = '';
  dreamInput.focus();
};
*/
/*
// add a user
db.get( 'users' ).push({ name:'bob', age:42 }).write()

// filter users by age
const seniors = db.get( 'users' )
    .value()
*/


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

app.use( session({ secret:'topSecret', resave:false, saveUninitialized:false }) );
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


app.get('/', function (request, response) {

    response.sendFile(__dirname + '/index.html');

});



app.listen( process.env.PORT )