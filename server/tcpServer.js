// Include Nodejs' net module.
const { Server } = require('net');
const { generateImageData, toImage } = require("../imageHandler.js");

// The port on which the server is listening.
const port = 5678;

// Use net.createServer() in your code. This is just for illustration purpose.
// Create a new TCP server.
const server = new Server();
// The server listens to a socket for a client to make a connection request.
// Think of a socket as an end point.

(async function() {
    await server.listen(port, function() {
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
    socket.write(generateImageData());
    socket.end() 

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
});