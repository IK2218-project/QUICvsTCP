const { createQuicSocket, Socket } = require("net");
const { readFileSync, createReadStream } = require("fs");
const { toImage } = require("../imageHandler.js");

const key = readFileSync("./keys/client-key.pem");
const cert = readFileSync("./keys/client-cert.pem");
const imgSize = 601048;

console.log("QUIC");
socket = createQuicSocket({
  endpoint: { port: 4321 },
});


// Create a QuicSocket associated with localhost and port 4321


const client = socket.connect({
  address: "localhost",
  port: 1234,
  alpn: "echo",
  key: key,
  cert: cert,
});


client.on("secure", () => {
  // Send some test data to server
  //const stream = client.openStream();
  /* const file = createReadStream("./test.txt");
    file.pipe(stream); */
  // Dont wait for reponse just close socket.
  //client.close();
  let imagesReceived = 0;
  let numStreams = 1;
  if (process.argv[2]) {
    numStreams = parseInt(process.argv[2]);
  } else {
    console.log("Using default number of, get 1 image.");
  }
  //let streams = new Array(numStreams)
  //let data = new Array(numStreams)
  // START TIMER
  const timeStart = Date.now();

  for (let i = 0; i < numStreams; i++) {
    const stream = client.openStream();
    stream.data = "";
    stream.index = i+1;
    stream.end("Get me Mario " + stream.index);
    stream.setEncoding("utf8");
    stream.on("data", function (chunk) {
      stream.data += chunk;
      if (stream.data.length === imgSize) {
        console.log("Stream " + stream.index + " finished in " + (Date.now()-timeStart) + " ms");
        toImage(stream.data, stream.index);  
        imagesReceived += 1;  
      }
      if (imagesReceived == numStreams) console.log("All streams finished.")
    });
    stream.on("end", function () {     
      //console.log("stream " + (i+1) + " ended");
    });
  }  

  /*setTimeout(() => {
    for (i in streams) {
      //const element = array[index];
      console.log("stream " + i + " has "  + streams[i].data.length + " bytes");
    }
  }, 5000);*/

});