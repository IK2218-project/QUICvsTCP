const { createQuicSocket } = require("net");
const { readFileSync, createReadStream, writeFileSync } = require("fs");

const key = readFileSync("./keys/client-key.pem");
const cert = readFileSync("./keys/client-cert.pem");
const imgSize = 601048;

// Create a QuicSocket associated with localhost and port 4321
const socket = createQuicSocket({
  endpoint: { port: 4321 },
});

const client = socket.connect({
  address: "localhost",
  port: 1234,
  alpn: "echo",
  key: key,
  cert: cert,
});

//let imageContent = document.getElementById("imageContainer").innerHtml;

const toImage = (data, index) => {
  // Translate to .png file
  console.log("toImage, index: " + index + ", data.len: " + data.length);
  const buffer = Buffer.from(data.replace("\n", ""), "base64");
  writeFileSync("./img/recreatedImage" + index + ".png", buffer);

  // Dynamically add image to HTML page
  // imageContent += "<img src='./img/recreatedImage'" + index + ".png'>";
};

client.on("secure", () => {
  // Send some test data to server
  //const stream = client.openStream();
  /* const file = createReadStream("./test.txt");
    file.pipe(stream); */
  // Dont wait for reponse just close socket.
  //client.close();
  const numStreams = parseInt(process.argv[2]);
  let streams = new Array(numStreams)
  let data = new Array(numStreams)

  for (let i = 0; i < numStreams; i++) {
    streams[i] = client.openStream();
    streams[i].data = "";
    streams[i].index = i+1;
    streams[i].end("Get me Mario " + streams[i].index);
    streams[i].setEncoding("utf8");
    streams[i].on("data", function (chunk) {
      streams[i].data += chunk;
      if (streams[i].data.length === imgSize) {
        console.log(streams[i].index + " done");
        toImage(streams[i].data, streams[i].index);    
      }
    });
    streams[i].on("end", function () {     
      //console.log("stream " + (i+1) + " ended");
    });
  }  

  setTimeout(() => {
    for (i in streams) {
      //const element = array[index];
      console.log("stream " + i + " has "  + streams[i].data.length + " bytes");
    }
  }, 5000);

});