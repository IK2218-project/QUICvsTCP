const quic = require("node-quic");

const port = 1234;
const address = "127.0.0.1"; // default

quic.listen(port, address).then(() => {
  console.log("Listening!");
}).onData(
    (data, stream, buffer) => {
        console.log(data);
    }
  ); // called once server starts listening
