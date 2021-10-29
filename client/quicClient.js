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

const toImage = (data) => {
  const buffer = Buffer.from(data.replace("\n", ""), "base64");
  //console.log(data)
  writeFileSync("recreatedMario.png", buffer);
};

client.on("secure", () => {
  // Send some test data to server
  //const stream = client.openStream();
  /* const file = createReadStream("./test.txt");
    file.pipe(stream); */
  // Dont wait for reponse just close socket.
  //client.close();

  const stream = client.openStream();
  //stream.write("15");
  //stream.end();

  stream.end("15");

  // Alt 1:

  // Hear response from server
  stream.setEncoding("utf8");
  stream.on("data", toImage);

  stream.on("end", () => {
    console.log("stream ended");
  });

  //Alt 2:

/*   var data = "";
  socket.setEncoding("utf8");
  socket.on("data", function (chunk) {
    data += chunk;
  });
  socket.on("end", function () {
    var lines = data.split("\n");
    lines.forEach(function (line) {
      var parts = line.split("|");
      switch (parts[0]) {
        case "setUser":
          setUser(str[1], socket);
          break;
        case "joinChannel":
          joinChannel(str[1], socket);
          break;
      }
    });
  }); */
});
