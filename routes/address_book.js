const express = require('express');
const db = require(__dirname + "/../modules/db_connect");
const router = express.Router();
const dayjs = require('dayjs');
const upload = require(__dirname + '/../modules/img-upload');
const multipartParser = upload.none();


const getListData = async(req)=>{
    let output = {
        redirect: '',
        totalRows:0, 
        perPage:25,
        totalPages:0, 
        page:1, 
        row:[]
    }
    const perPage = 25;
    let search = req.query.search || "";
    let page = req.query.page ? + req.query.page : 1;
    if (!page || page < 1) {
        output.redirect = req.baseUrl;
        return output;
    }

    let where = ' WHERE 1 ';
    if (search){
        const kw_escaped = db.escape('%'+search+'%');
        where += ` AND ( \`name\` LIKE ${kw_escaped} OR  \`address\` LIKE ${kw_escaped})`;
    }

    const t_sql = `SELECT COUNT(1) totalRows FROM address_book ${where}`;
    
    const [[{ totalRows }]] = await db.query(t_sql);
    let totalPages = 0
    let row = []
    if (totalRows) {
        totalPages = Math.ceil(totalRows / perPage);
        if (page > totalPages) {
            output.redirect = req.baseUrl + "?page=" + totalPages;
            return output;
        }
        const sql = `SELECT * FROM address_book ${where} LIMIT ${perPage * (page - 1)}, ${perPage}`;
        [row] = await db.query(sql);
    }
    // const fm = "YYYY-MM-DD";
    //     row = row.map((r)=>{
    //         djs = dayjs(r.birthday);
    //         r.birthday = djs.format(fm);
    //         return r;
    //     })
    //      console.log(row);
    output = {...output, totalRows, perPage, totalPages, page, row, search};
    return output;
    
    }
router.use((req,res,next)=>{
    res.locals.title = "通訊錄 | "+res.locals.title;
    next(); 
})

router.get('/api', async(req,res)=>{
    const output = await getListData(req);
    output.totalRows.forEach(i=>{
        i.birthday = dayjs(i.birthday).format('YYYY-MM-DD');
        delete i.created_at;
    })
})
router.get('/', async (req, res) => {
   const output = await getListData(req);
   if(output.redirect){
    return res.redirect(output.redirect);
   }
   res.render('address-book/index', output);
})

router.get('/add', async (req, res) => {
   res.render('address-book/add');
})

router.post('/', multipartParser, async (req, res) => {
    const data = {...req.body};

    const sql = "INSERT INTO `address_book`"+
    "( `name`, `email`, `mobile`, `birthday`, `address`, `created_at`) "+
    "VALUES (?,?,?,?,?,now())";
    let birthday = dayjs(data.birthday);
    if(birthday.isValid()){
        data.birthday = birthday.format("YYYY-mm-dd");
    }else{
        data.birthday = null;
    }

    const [result] = await db.query(sql,[
        data.name,
        data.email,
        data.mobile,
        data.birthday,
        data.address,
    ])
   res.json({
        result,
        postData: data
    })
})

router.post('/add', multipartParser, async (req, res) => {

    const sql = "INSERT INTO `address_book` set?";
    const dataObj = {...req.body};
    delete dataObj.name1;

    dataObj.created_at = new Date();

    let birthday = dayjs(dataObj.birthday);
    if(birthday.isValid()){
        dataObj.birthday = birthday.format("YYYY-mm-dd");
    }else{
        dataObj.birthday = null;
    }

    const [result] = await db.query(sql,[dataObj])
   res.json({
        result,
        postData: dataObj,
    })
})

router.get('/add-try', async (req, res) => {
   res.render('address-book/add-try');
})

router.post('/add-try',multipartParser, async (req, res) => {
   res.json(req.body);
})

router.get('/edit/:sid', async (req, res) => {
    let {sid} = req.params;
    sid= parseInt(sid);
    const [rows] = await db.query(`SELECT * FROM address_book WHERE sid='${sid}'`)
    if(!rows.length){
        return res.redirect(req.baseUrl);
    }
    res.render('address-book/edit',{row:rows[0]});
//    res.render('address-book/add-try');
});

router.put('/:sid', async(req,res)=>{
    let {sid} = req.params;
    sid=parseInt(sid);
    const [rows] = await db.query(`SELECT * FROM address_book WHERE sid='${sid}'`)
    if(!rows.length){
        return res.json({msg:"wrong sid"});
    }

    let row = {...rows[0], ...req.body};

    const sql = `UPDATE\`address_book\` SET? WHERE sid=?`;
    const [result] = await db.query(sql, [row,sid]);

    res.json({
        success: !! result.changedRows,
        result,
        'body':req.body
    })
})

router.delete('/:sid',async (req,res)=>{
    const {sid} = req.params;
    const sql = "DELETE FROM `address_book` WHERE `sid`=?"

    const [result] = await db.query(sql,[sid]);
    res.json(result);
})


router.get('/escape', async (req, res) => {
    res.json({
        c1: db.escape('abc'),
        c2: db.escape("abc"),
        c3: db.escape("a'bc")
    })
});


router.get('/cate1', async (req, res)=>{
  const [rows] = await db.query("SELECT * FROM categories ORDER BY sid");
  // 先編成字典
  const dict = {}
  rows.forEach(i => {
    dict[i.sid] = i
  });

  rows.forEach(i => {
    const parent = dict[i.parent_sid];
    if(parent) {
      parent.nodes = parent.nodes || [];
      parent.nodes.push(i);
    }
  });
  const newAr = [];
  rows.forEach(i => {
    if(i.parent_sid=='0') {
      newAr.push(i);
    }
  });
  res.render('address-book/cate1',{dict, dataAr:newAr});
});
module.exports = router;