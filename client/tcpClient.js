// Include Nodejs' net module.
const { Socket} = require('net');
const { toImage } = require("../imageHandler.js");

// The port number and hostname of the server.
const port = 5678;
const host = 'localhost';

let numSocket = 1;
if (process.argv[2]) {
    numSocket = process.argv[2];
}

let imagesReceived = 0;
// START TIMER
const timeStart = Date.now();

for (let i = 0; i < numSocket; i++) {

    // Create a new TCP client.
    const client = new Socket();
    // Send a connection request to the server.
    client.connect({ port: port, host: host }, function() {
        // If there is no error, the server has accepted the request and created a new 
        // socket dedicated to us.
        console.log('TCP connection established with the server.');

        // The client can now send data to the server by writing to its socket.
        client.write('Hello, server.');
    });

    let imageData = "";
    // The client can also receive data from the server by reading from its socket.
    client.on('data', function(chunk) {
        imageData += chunk;
        // Request an end to the connection after the data has been received.
        //client.end();
    });

    client.on('error', function(e) {
        console.log(e);
    })

    client.on('end', function() {
        console.log("Client socket " + i + " finished in " + (Date.now() - timeStart) + " ms");
        toImage(imageData, i+1);
        imagesReceived+=1;
        if (imagesReceived == numSocket) {
            console.log("All clients finished");
        }
    });

}