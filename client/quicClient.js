const { createQuicSocket } = require('net');
const { readFileSync, createReadStream } = require('fs')

const key = readFileSync('./keys/client-key.pem')
const cert = readFileSync('./keys/client-cert.pem')

// Create a QuicSocket associated with localhost and port 4321
const socket = createQuicSocket({ 
    endpoint: { port: 4321 }, 
});


const client = socket.connect({
    address: 'localhost',
    port: 1234,
    alpn: 'echo',
    key: key,
    cert: cert
});

    
client.on('secure', () => {
    // Send some test data to server
    const stream = client.openStream();
    const file = createReadStream("./test.txt");
    file.pipe(stream);
    // Dont wait for reponse just close socket.
    //client.close();

    const stream2 = client.openStream();
    stream2.write("testing");
});

