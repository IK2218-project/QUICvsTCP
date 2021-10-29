const { createQuicSocket } = require("net");
const { readFileSync, createReadStream, writeFileSync } = require("fs");

const key = readFileSync("./keys/client-key.pem");
const cert = readFileSync("./keys/client-cert.pem");

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

let imageContent = document.getElementById("imageContainer").innerHtml;

const toImage = (data, index) => {
  // Translate to .png file
  console.log("toImage, index: " + index + ", data.len: " + data.length);
  const buffer = Buffer.from(data.replace("\n", ""), "base64");
  writeFileSync("./img/recreatedImage" + index + ".png", buffer);

  // Dynamically add image to HTML page
  imageContent += "<img src='./img/recreatedImage'" + index + ".png'>";
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
    streams[i].end("Get me Mario");
    streams[i].setEncoding("utf8");
    data[i] = "";
    streams[i].on("data", function (chunk) {
      data[i] += chunk;
    });
    streams[i].on("end", function () {
      toImage(data[i], (i+1))         
      console.log(data[i].substr(data[i].length-20, data[i].length))
      console.log(data[i].length)
      console.log("stream " + (i+1) + " ended");
    });
  }  
});