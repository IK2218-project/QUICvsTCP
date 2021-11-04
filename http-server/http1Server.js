const { createServer } = require('https');
const { readFileSync } = require('fs')

const port = 8334;
const server = createServer({
  key: readFileSync('./keys/server-key.pem'),
  cert: readFileSync('./keys/server-cert.pem')
});

server.on('request', (req, res) => {
  console.log(req.httpVersion);
  console.log(req.url);

  // Send back initial HTML page
  if (req.url == '/') {
    const page = readFileSync('./index.html');
    res.writeHead(200, {
      'Content-Length': Buffer.byteLength(page),
      'Content-Type': 'text/html'
    })
    .end(page);
  }
  
  // Send back image
  else if (req.url.startsWith('/img/')) {
    const fileName = req.url.split('/')[2];
    try {
      const filePath = "./img/" + fileName;
      const img = readFileSync(filePath);
      res.writeHead(200, {
        'Content-Length': Buffer.byteLength(img),
        'Content-Type': 'image/png'
      })
      .end(img); 
    } catch (error) {
      console.log(`Couldn't find image file for ${req.url}`);
      res.writeHead(404).end();
    }  
  }

  // Otherwise 404
  else {
    res.writeHead(404).end();
  }
});


server.listen(port, () => console.log(`The server is listening on localhost:${port}`));