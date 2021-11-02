// Include Nodejs' net module.
const { Server } = require('net');
const { generateImageData, toImage } = require("../imageHandler.js");

const { readFileSync } = require('fs');
const { createServer } = require('tls');
//const key = readFileSync('./keys/server-key.pem')
//const cert = readFileSync('./keys/server-cert.pem')

const key = readFileSync('./serverkeys/server.key')
const cert = readFileSync('./serverkeys/server.crt')
const ca = readFileSync('./serverkeys/ca.crt')

// The port on which the server is listening.
const port = 5678;

const server = createServer({ key: key, cert: cert, ca: ca }, (socket) => {
    console.log('A new connection has been established.');

    // Now that a TCP connection has been established, the server can send data to
    // the client by writing to its socket.

    // Send image data
    //socket.write(generateImageData());
    socket.end("TEST PAYLOAD");

    // The server can also receive data from the client by reading from its socket.
    socket.on('data', function(chunk) {
        console.log("Data received from client: " + chunk.toString());
    });

    // When the client requests to end the TCP connection with the server, the server
    // ends the connection.
    socket.on('end', function() {
        console.log('Closing connection with the client');
    });

    // Don't forget to catch error, for your own sake.
    socket.on('error', function(err) {
        console.log(`Error: ${err}`);
    });


    /*console.log('server connected',
                socket.authorized ? 'authorized' : 'unauthorized');
    socket.write('welcome!\n');
    socket.setEncoding('utf8');
    socket.pipe(socket);*/
  });
  server.listen(port, () => {
    console.log('server bound');
  });









// Use net.createServer() in your code. This is just for illustration purpose.
// Create a new TCP server.
/*const server = new Server();
//const tlsSocket = new TLSSocket(server);
// The server listens to a socket for a client to make a connection request.
// Think of a socket as an end point.

(async function() {
    await server.listen({port: port, key: key, cert: cert }, function() {
        console.log(`Server listening for connection requests on socket localhost:${port}.`);
    });
})();
// When a client requests a connection with the server, the server creates a new
// socket dedicated to that client.
server.on('connection', function(socket) {
    console.log('A new connection has been established.');

    // Now that a TCP connection has been established, the server can send data to
    // the client by writing to its socket.

    // Send image data
    //socket.write(generateImageData());
    socket.end("TEST PAYLOAD");

    // The server can also receive data from the client by reading from its socket.
    socket.on('data', function(chunk) {
        console.log("Data received from client: " + chunk.toString());
    });

    // When the client requests to end the TCP connection with the server, the server
    // ends the connection.
    socket.on('end', function() {
        console.log('Closing connection with the client');
    });

    // Don't forget to catch error, for your own sake.
    socket.on('error', function(err) {
        console.log(`Error: ${err}`);
    });
});*/