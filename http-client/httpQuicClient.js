const { createQuicSocket, Socket } = require("net");
const { readFileSync, writeFileSync, createWriteStream } = require("fs");

const key = readFileSync("./keys/client-key.pem");
const cert = readFileSync("./keys/client-cert.pem");

// Create a QuicSocket associated with localhost and port 4321
socket = createQuicSocket({
  endpoint: { port: 4321 },
});

const client = socket.connect({
  address: "localhost",
  port: 4343,
  alpn: "http3",
  key: key,
  cert: cert,
});


var fileStream = createWriteStream('./index.html');

client.on("secure", () => {
  const stream = client.openStream();
  
  // GET request
  stream.end("GET / HTTP/2\r\nHost: localhost:4343\r\n\r\n");
  
  // Gather chunks
  stream.pipe(fileStream);

  stream.on("end", () => {
    console.log("quicClient: stream ended");

    // Parse HTTP + html in clientRevieced.txt to find images that should be fetched
    const httpResponse = readFileSync('./index.html', 'utf8');
    const htmlStart = httpResponse.search('<html>');
    const htmlEnd = httpResponse.search('</html>') + 7;
    const html = httpResponse.substring(htmlStart, htmlEnd);
    writeFileSync('./index.html', html);
    
    // Send requests for each image found in html
    for (let row = 1; row <= 9; row++) {
      for (let col = 1; col <= 10; col++) {
       
        const imgStream = client.openStream();
        const imgUrl = `/img/scott_${row.toString().padStart(2, '0')}_${col.toString().padStart(2, '0')}.png`
        imgStream.end("GET " + imgUrl + " HTTP/2\r\nHost: localhost:4343\r\n\r\n");
        const fileStream = createWriteStream('.' + imgUrl);
        imgStream.pipe(fileStream);

        imgStream.on('close', () => {
          //console.log('closing img stream');
          fileStream.end();
          imgStream.end();
        });
      }
    }
  });

});