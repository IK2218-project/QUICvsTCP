const { createQuicSocket} = require('net');
const { readFileSync, createReadStream } = require('fs');

const key = readFileSync('./keys/server-key.pem');
const cert = readFileSync('./keys/server-cert.pem');

const http3Port = 4343;

const socket = createQuicSocket({ endpoint: { port: http3Port } });

socket.on('session', async (session) => {
  // A new server side session has been created!
  console.log("New connection:");

  session.on('stream', (stream) => {
    console.log('New stream created');
   
    // Process requests
    stream.on('data', (chunk) => {
      const request = chunk.toString().split(' ');
      const path = request.length > 1 ? request[1] : '/';
      console.log("Request to: " + path);
      
      // Handle requests to root
      if (path == "/") {
        const htmlResponseStream = createReadStream('./quicResponse.txt')
        htmlResponseStream.pipe(stream);
      }

      // Handle requests to /img/...
      else if (path.startsWith('/img/')) {
        const imgStream = createReadStream("." + path);
        imgStream.pipe(stream);
      }

      // Otherwise send 404 status
      else {
        stream.end('HTTP/2 404\r\n\r\n');
      }

    });

    stream.on('close', () => {
      console.log("Stream closed");
      //htmlResponseStream.close();
    });
    
    stream.on("error", (err) => {
        console.log('caught error!!!!!: ' + err.message);
    });
  });
});

(async function() {
  await socket.listen({ key, cert, alpn: 'http3' });
  console.log('The QUIC socket is listening for sessions on %d', http3Port);
})();