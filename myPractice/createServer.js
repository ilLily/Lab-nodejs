const http = require('node:http');
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ name: 'Lily', hobby: 'watch TV' }));
})
server.listen(8000);