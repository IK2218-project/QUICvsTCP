const quic = require("quic");
const fs = require("fs");

const options = {
  key: fs.readFileSync("ssl/localhost.key"),
  cert: fs.readFileSync("ssl/localhost.cert")
};

const server = quic.createSocket({ port: 3000 });
server.listen(options);
server.on("session", session => {
  session.on("stream", (stream, headers) => {
    if (headers[":path"] === "/") {
      stream.respondWithFile("./files/index.html");
    } else {
      // regular expression for filename requested
      const re = /\/(\w+)*/;
      const filename = headers[":path"].replace(re, "$1");
      stream.respondWithFile(`./files/${filename}`);
    }
  });
});
