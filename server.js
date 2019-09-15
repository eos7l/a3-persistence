const express = require('express'),
    app = express(),
    low = require('lowdb'),
    FileSync = require('lowdb/adapters/FileSync'),
    adapter = new FileSync('data/db1.json'),
    db = low(adapter),
    passport = require('passport'),
    Local = require('passport-local').Strategy,
    session = require('express-session'),
    bodyparser = require('body-parser'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    path = require('path'),
    helmet = require('helmet'),
    router = express.Router(),
    port = 8000;


const appdata = [
        {
            "itemName": "Son & Park Beauty Water",
            "category": "Health & Beauty",
            "list": "need",
            "specifiedRetailerOnly": "Yes",
            "URL": "https://seph.me/2kxrFgd"
        },
        {
            "itemName": "Givenchy Small GV3 Leather Shoulder Bag",
            "category": "Clothes & Handbags",
            "list": "want",
            "specifiedRetailerOnly": "No",
            "URL": "http://bit.ly/2md33JW"
        },
        {
            "itemName": "Lenovo Legion Y740",
            "category": "Electronics & Computers",
            "list": "want",
            "specifiedRetailerOnly": "No",
            "URL": "https://lnv.gy/2lRz8a3"
        },
        {
            "itemName": "Alienware Aurora R8 Desktop",
            "category": "Electronics & Computers",
            "list": "need",
            "specifiedRetailerOnly": "Yes",
            "URL": "https://dell.to/2mgSaHc"
        }
    ]
const users = [
    {username: 'swain', password: 'cain'},
    {username: 'eos7l', password: 'swdw'}
]


db.defaults({appdata: appdata, users: users}).write();

// automatically deliver all files in the public folder
// with the correct headers / MIME type.
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());
app.use(helmet());
app.use(bodyparser.json());
app.use(passport.initialize());
//passport.use( new Local( myLocalStrategy ) );

app.get('/', function (req, res) {
    // Cookies that have not been signed
    console.log('Cookies: ', req.cookies)

    // Cookies that have been signed
    console.log('Signed Cookies: ', req.signedCookies)
})


/*
// add a user
db.get( 'users' ).push({ name:'bob', age:42 }).write()

// filter users by age
const seniors = db.get( 'users' )
    .value()
*/

/*
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
*/


// app.post('/test', function( req, res ) {
//     console.log( 'authenticate with cookie?', req.user );
//     res.json({ status:'success' })
// })

app.get('/newData', (req, res) => {
    let data = db.get('appdata').value();
    res.send(data)
});


app.post('/submit', function (req, res) {
    let data = req.body;
    db.get('appdata').push(data).write()
    res.status(200).send("Successfully added new character");
});

app.post('/update', function (req, res) {
    const index = req.body.index,
        indexVal = db.get('appdata[' + index + ']').value();
    console.log(indexVal.house)
    db.get('appdata').find(indexVal).assign({
        itemName: req.body.itemName,
        category: req.body.category,
        list: req.body.list,
        url: req.body.url,
        specifiedRetailerOnly: req.body.specifiedRetailerOnly
    }).write()
    res.status(200).send("updated")
})

app.post('/delete', function (req, res) {
    const index = req.body.deletedData,
        indexVal = db.get('appdata[' + index + ']').value()
    db.get('appdata').remove(indexVal).write();
    res.status(200).send("deleted")
})


app.listen(process.env.PORT || port)