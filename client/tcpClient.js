// Include Nodejs' net module.
const { Socket} = require('net');
const { toImage } = require("../imageHandler.js");

const { connect } = require('tls');

const { readFileSync, createReadStream } = require("fs");

const key = readFileSync('./clientkeys/client.key')
const cert = readFileSync('./clientkeys/client.crt')
const ca = readFileSync('./clientkeys/ca.crt')

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
    const socket = connect(port, { key: key, cert: cert, ca: ca }, () => {
        // If there is no error, the server has accepted the request and created a new 
        // socket dedicated to us.
        console.log('TCP connection established with the server.');

        // The client can now send data to the server by writing to its socket.
        client.write('Hello, server.');
      });
      socket.setEncoding('utf8');
      let imageData = "";
      socket.on('data', (chunk) => {
        imageData += chunk;
      });
      socket.on('end', () => {
        console.log("Client socket " + i + " finished in " + (Date.now() - timeStart) + " ms");
        toImage(imageData, i+1);
        imagesReceived+=1;
        if (imagesReceived == numSocket) {
            console.log("All clients finished");
        }      
    });

}