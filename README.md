# QUICvsTCP

## Experimental node15 build instructions

Get experimental quic fork
```console
git clone https://github.com/nodejs/quic.git && cd quic
```

Set the `--experimental-quic` build flag
```console
./configure --experimental-quic
```

Build node (with 2 parallel processes) this will take a while.
```console
make -j2
```

Install
```console
make install PREFIX=path/to/folder/here
```




## Keygen
```console
openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
```