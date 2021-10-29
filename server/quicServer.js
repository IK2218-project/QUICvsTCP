const { createQuicSocket, createServer } = require('net');
const { readFileSync } = require('fs')

const key = readFileSync('./keys/server-key.pem')
const cert = readFileSync('./keys/server-cert.pem')

// print process.argv

if (process.argv[2] === "tcp") {
  console.log("TCP");

  // TODO
  // socket = createTcpSocket({ endpoint: { port: 1234 } }); 
} else if (process.argv[2] === "quic") {
  console.log("QUIC");

  // Create the QUIC UDP IPv4 socket bound to local IP port 1234
  socket = createQuicSocket({ endpoint: { port: 1234 } });
} else {
  console.log("Argument missing");
  return;
}

const generateImageData = () => {
  /*return readFileSync('mario.png', function(err, data){
    return b64(data);
  });*/ 
  const base64 = readFileSync('mario.png', 'base64');
  //const buffer = Buffer.from(base64, "base64");
  //console.log(base64);
  return base64;
};

//function b64(e){var t="";var n=new Uint8Array(e);var r=n.byteLength;for(var i=0;i<r;i++){t//+=String.fromCharCode(n[i])}return btoa(t)}

socket.on('session', async (session) => {
  // A new server side session has been created!


  // The peer opened a new stream!
  session.on('stream', (stream) => {
    // Let's say hello
    console.log("A stream was opened")
 
    // Let's see what the peer has to say...
    stream.setEncoding('utf8');
    stream.on('data', () => {
      stream.end(generateImageData());
    });

    stream.on('end', () => {
      console.log("Session stats:", session.handshakeAckHistogram, session.handshakeDuration);
      console.log("Stream ended");
    });
  });

  const uni = await session.openStream({ halfOpen: true });
  uni.write('hi ');
  uni.end('from the server!');
});

// Tell the socket to operate as a server using the given
// key and certificate to secure new connections, using
// the fictional 'hello' application protocol.
(async function() {
  await socket.listen({ key, cert, alpn: 'echo' });
  console.log('The socket is listening for sessions!');
})();
