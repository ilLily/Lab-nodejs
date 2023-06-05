const http = require('http');
const server = http.createServer((req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/html; charset=UTF-8'
    });
    res.end(`<h2>Welcome 你你你 to our world 啦啦啦</h2>
    <p>${req.url}</p>
    <p>${JSON.stringify(req.headers)}</p>`)
})
server.listen(3000);