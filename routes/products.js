const express = require('express');
const db = require(__dirname + "/../modules/db_connect");
const router = express.Router();
const dayjs = require('dayjs');
const upload = require(__dirname + '/../modules/img-upload');
const multipartParser = upload.none();

router.get('/', async(req,res)=>{
     let output = {
        redirect: '',
        totalRows:0, 
        perPage:25,
        totalPages:0, 
        page:1, 
        row:[]
    }
    const perPage = 4;
    let search = req.query.search || "";
    let page = req.query.page ? + req.query.page : 1;
    if (!page || page < 1) {
        output.redirect = req.baseUrl;
        return res.json(output);
    }

    let where = ' WHERE 1 ';
    if (search){
        const kw_escaped = db.escape('%'+search+'%');
        where += ` AND ( \`bookname\` LIKE ${kw_escaped} OR  \`author\` LIKE ${kw_escaped})`;
    }

    const t_sql = `SELECT COUNT(1) totalRows FROM products ${where}`;
    
    const [[{ totalRows }]] = await db.query(t_sql);
    let totalPages = 0
    let row = []
    if (totalRows) {
        totalPages = Math.ceil(totalRows / perPage);
        if (page > totalPages) {
            output.redirect = req.baseUrl + "?page=" + totalPages;
            return res.json(output);
        }
        const sql = `SELECT * FROM products ${where} LIMIT ${perPage * (page - 1)}, ${perPage}`;
        [row] = await db.query(sql);
    }

    output = {...output, totalRows, perPage, totalPages, page, row, search};
   return res.json(output);
    
   
})
router.get('/:book_sid', async(req,res)=>{
 let output = {
    success: false,
    error: "",
    row:null,
 }

 const book_sid = parseInt(req.params.book_sid) || 0;
 if(!book_sid){
    output.error = "沒有sid!";
 }else{
    const sql = `SELECT * FROM products WHERE sid = ${book_sid}`;
    const [rows]= await db.query(sql);
    if(rows.length){
        output.success = true;
        output.row = rows[0];
    }else{
        output.error = "沒有資料!";
    }
 }
 res.json(output);
})
module.exports = router;