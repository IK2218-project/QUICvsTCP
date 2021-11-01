# QUICvsTCP

# Experimental node15 build instructions
Process may be different for Windows see [Node.js build instructions for window](https://github.com/nodejs/node/blob/master/BUILDING.md#windows)

Get experimental quic fork
```console
git clone https://github.com/nodejs/quic.git && cd quic
```

Set the `--experimental-quic` build flag
```console
./configure --experimental-quic
```

Build node (with 2 parallel processes) this will take a WHILE.
```console
make -j2
```

Install to nvm versions directory
```console
make install PREFIX=~/.nvm/versions/node/v15.0.0-quic

nvm use --delete-prefix v15.0.0-quic
```



# Keygen
```console
openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
```

# Helpful links
 - [net module QUIC documentation](https://www.apiref.com/nodejs/quic.html)
 - [Node.js QUIC presentation](https://slides.com/trivikram/nodejs-quic-http3-cascadiajs)
 - [QUIC FAQ doc](https://docs.google.com/document/d/1lmL9EF6qKrk7gbazY8bIdvq3Pno2Xj_l_YShP40GLQE/edit?pli=1#!)
 - [Network condition simulations](https://medium.com/docler-engineering/network-issues-simulation-how-to-test-against-bad-network-conditions-b28f651d8a96)