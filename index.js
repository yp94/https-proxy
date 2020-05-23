const http= require('http')
const https= require('https')
const url = require('url')
const net = require('net')
const fs = require('fs')

const server = createServer()

const port = 2019

server.on('request', function(req, res) {
  if (req.url.startsWith('http://')) {
    const pwd = req.headers['proxy-authorization']
    if (!(pwd && pwd === 'Basic cm9vdDo5NDEwMTNZaU4=')) {
      socket.write('HTTP/1.1 407 Proxy Authentication Required\r\n')
      socket.write('Proxy-Authenticate: Basic realm="err，please enter again"\r\n\r\n')
      socket.end()
      return
    }

    var urlObj = url.parse(req.url)

    delete req.headers['proxy-connection']

    http.request({
      host: urlObj.hostname,
      port: urlObj.port || 80,
      method: urlObj.method,
      path: urlObj.path,
      query: urlObj.query,
      headers: req.headers,
    }, response => {
      res.writeHead(response.statusCode, response.headers)
      response.pipe(res)
    }).end()
  } else {
    res.end('hello')
  }
})

server.on('connect', function(req, socket, head) {
  const pwd = req.headers['proxy-authorization']
  if (!(pwd && pwd === 'Basic <root:pwd>')) {
    console.log('no auth')
    socket.write('HTTP/1.1 407 Proxy Authentication Required\r\n')
    socket.write('Proxy-Authenticate: Basic realm="input your account"\r\n\r\n')
    socket.end()
    return
  }

  var [host, port] = req.url.split(':')
  var serverSock = net.connect(port, host, () => {
    console.log(req.url, 'CONNECTED')
    socket.write('HTTP/1.1 200 Connect Established\r\n\r\n')
    socket.pipe(serverSock).pipe(socket)
  })

  serverSock.on('error', () => {
    serverSock.end()
    socket.end()
  })

  socket.on('error', () => {
    serverSock.end()
    socket.end()
  })
})

server.listen(port, () => console.log(port))

function createServer() {
  if (process.platform === 'linux') {
    return https.createServer({
      key: fs.readFileSync('/root/.acme.sh/域名/域名.key'),  //私钥
      cert: fs.readFileSync('/root/.acme.sh/域名/域名.ltd.cer'), //证书
    })
  } else {
    return http.createServer()
  }
}