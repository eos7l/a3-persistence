const express    = require('express'),
    app        = express(),
    bodyparser = require( 'body-parser' ),
    dreams     = []


const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low( adapter )

db.defaults({ users:[] }).write()

// add a user
db.get( 'users' ).push({ name:'bob', age:42 }).write()

// filter users by age
const seniors = db.get( 'users' )
    .filter( user => user.age > 70 )
    .value()

// automatically deliver all files in the public folder
// with the correct headers / MIME type.
app.use( express.static( 'public' ) )

// get json when appropriate
app.use( bodyparser.json() )

// even with our static file handler, we still
// need to explicitly handle the domain name alone...
app.get('/', function(request, response) {
  response.sendFile( __dirname + '/views/index.html' )
})

app.post( '/submit', bodyparser.json(), function( request, response ) {
  dreams.push( request.body.newdream )
  response.writeHead( 200, { 'Content-Type': 'application/json'})
  response.end( JSON.stringify( dreams ) )
})

app.listen( process.env.PORT )