app.post( '/submit', bodyparser.json(), function( request, response ) {
  dreams.push( request.body.newdream )
  response.writeHead( 200, { 'Content-Type': 'application/json'})
  response.end( JSON.stringify( dreams ) )
})