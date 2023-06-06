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

app.set('view engine', 'ejs');
app.get('/', (req, res) => {
    // res.send('<h1>Hello! you made it!!</h1>')
    res.render('home', { name: "Lily", age: 4, db_user: process.env.DB_USER })
})
app.get('/json', (req, res) => {
    res.json({
        name: "Lily",
        age: 37
    })
})
app.get('/json-sales', (req, res) => {
    // const data = require(__dirname + '/data/sales');
    // res.send(data[0].name)
    res.render('json-sales', { name: "Lily", age: 4, db_user: process.env.DB_USER })
})

app.use(express.static('public'));
app.use(express.static('node_modules/bootstrap/dist'));
app.use(express.static('node_modules/jquery/dist'));

app.use((req, res) => {
    res.type('text/html');
    res.status(404);
    res.send('<h1>404- not found</h1>');
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`start server, port:${port}`)
})