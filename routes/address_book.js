const express = require('express');
const db = require(__dirname + "/../modules/db_connect");
const router = express.Router();
const dayjs = require('dayjs');

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

module.exports = router;