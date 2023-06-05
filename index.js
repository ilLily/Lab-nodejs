console.log('arg2:', process.argv[2]);

if (process.argv[2] === 'production') {
    require('dotenv').config({
        path: __dirname + '/production.env'
    });
} else {
    require('dotenv').config()
}


const express = require('express');

const app = express();
app.get('/', (req, res) => {
    res.send('<h1>Hello! you made it!!</h1>')
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`start server, port:${port}`)
})