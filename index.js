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
const session = require('express-session');
const MysqlStore = require('express-mysql-session')(session);
const moment = require('moment-timezone');
const dayjs = require('dayjs');
const db = require(__dirname + "/modules/db_connect");
const sessionStore = new MysqlStore({}, db);

app.set('view engine', 'ejs');


//Top-level Middleware
app.use(session({
    saveUninitialized: false,
    resave: false,
    store: sessionStore,
    secret: 'adslgoiwerlkjasdf',
    cookie: {
        maxAge: 1200_000,
    }
}))
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


//==============test-GET ===============
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

app.get('/my-params1', (req, res) => {
    res.json(req.params);
})

app.get('/my-params1/:action?/:id?', (req, res) => {
    res.json(req.params);
})

app.get('/my-params2', (req, res) => {
    res.json(req.url);
})

app.get(/^\/m\/09\d{2}\-?\d{3}\-?\d{3}$/i, (req, res) => {
    console.log(req.url);
    let u = req.url.slice(3);
    u = u.split("?")[0];
    u = u.split('-').join('')
    res.json({ u });
})

app.get('/test-sess', (req, res) => {
    req.session.count = req.session.count || 0;
    req.session.count++;
    req.session.hello = 'haha';
    res.json({
        count: req.session.count,
        hello: req.session.hello,
        session: req.session
    });
})

app.get('/test-moment', (req, res) => {
    const fm = 'YYYY-MM-DD HH:mm:ss';
    const dayjs1 = dayjs();
    const dayjs2 = dayjs('2023/08/16');
    const d3 = new Date();
    const moment1 = moment();

    res.json({
        d1: dayjs1.format(fm),
        d2: dayjs2.format(fm),
        d3: d3,
        m1: moment1.format(fm),
        m2: moment1.tz('Europe/London').format(fm),

    })
})

//非同步 (db.query會回傳兩組陣列, 第一組是資料-rows, 第二組是field-DB欄位的資枓, 不需要的話,接資料的陣列[], 放一個變數就好);
app.get('/test-db', async (req, res) => {
    const [data] = await db.query("SELECT * FROM `ord_cart` LIMIT 2")
    res.json(data);
})


//===========route=================
// app.use(require(__dirname + '/routes/admin2'));
app.use('/', require(__dirname + '/routes/admin2'));
app.use('/admin/a', require(__dirname + '/routes/admin3'));
app.use('/addressBook', require(__dirname + '/routes/address_book'))

//==========test-POST===============

app.post('/testPost', (req, res) => {
    console.log(req.body);
    res.json(req.body);

})
app.post('/testPost', (req, res) => {
    console.log(req.body);
    res.json(req.body);

})
//===========get post 同一支==========
app.get('/test-post-form', (req, res) => {
    res.render('test-post-form');
})

app.post('/test-post-form', (req, res) => {
    res.render('test-post-form', req.body);
    // res.redirect('/')
})

//===========file upload============
app.post('/file-upload', upload.single('avatar'), (req, res) => {
    console.log(req.file);
    res.json(req.file);

})
app.post('/file-uploads', upload.array('photo', 10), (req, res) => {
    // console.log(req.files);
    // const fileNameArr = []
    // const data = req.files;
    // for (let d of data) {
    //     fileNameArr.push(d.filename);
    // }
    // res.json(fileNameArr);
    console.log(req.files);
    res.json(req.files.map(fn => fn.filename))

})

//========= static ===========

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