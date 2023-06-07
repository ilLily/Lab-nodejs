console.log('arg2:', process.argv[2]);

if (process.argv[2] === 'production') {
    require('dotenv').config({
        path: __dirname + '/production.env'
    });
} else {
    require('dotenv').config()
}

//const multer = require('multer')
// const upload = multer({ dest: 'temp_uploads' })
const upload = require(__dirname + '/modules/img-upload');

const express = require('express');
const app = express();


app.set('view engine', 'ejs');

//Top-level Middleware

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


//test-GET res.render & res.json()
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
app.get('/test-qs', (req, res) => {
    res.json(req.query);
})
app.get('/json-sales', (req, res) => {
    const data = require(__dirname + '/data/sales');
    // res.send(data[0].name)
    res.render('json-sales', { data })
})


//test-POST

//Middleware=====
// const urlencodedParser = express.urlencoded({ extended: false });
// const jsonParser = express.json();

app.post('/testPost', (req, res) => {
    console.log(req.body);
    res.json(req.body);

})
app.post('/testPost', (req, res) => {
    console.log(req.body);
    res.json(req.body);

})
app.post('/test-post-form', (req, res) => {
    res.render('test-post-form', req.body);
    // res.redirect('/')
})
app.get('/test-post-form', (req, res) => {
    res.render('test-post-form');
})

//file upload
app.post('/file-upload', upload.single('avatar'), (req, res) => {
    console.log(req.file);
    res.json(req.file);

})
app.post('/file-uploads', upload.array('photo', 10), (req, res) => {
    console.log(req.files);
    const fileNameArr = []
    const data = req.files;
    for (let d of data) {
        fileNameArr.push(d.filename);
    }
    res.json(fileNameArr);

})

//=========

app.use(express.static('public'));
app.use(express.static('node_modules/bootstrap/dist'));
app.use(express.static('node_modules/jquery/dist'));

//自訂404
app.use((req, res) => {
    res.type('text/html');
    res.status(404);
    res.send('<h1>404- not found</h1>');
})

//express=> listen()
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`start server, port:${port}`)
})