import {createServer} from 'node:http';

const PORT = Number(process.env.PORT ?? 3000)

const server = createServer((req, res) => {
  if(req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, {
      'content-type': 'application/json'
    })

    res.end(JSON.stringify({
      status: 'ok'
    }))

    return
  }

  res.writeHead(404, {
    'constent-type': 'application/json'
  })

  res.end(
    JSON.stringify({
      error: 'Not Found'
    })
  )
})

server.listen(PORT, () => {
  console.log(`Forge API listening on https://localhost:${PORT}`)
})
