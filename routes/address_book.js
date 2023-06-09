const express = require('express');
const db = require(__dirname + "/../modules/db_connect");
const router = express.Router();


router.get('/', async (req, res) => {
    const perPage = 25;
    let search = req.query.search || "";
    let page = req.query.page ? + req.query.page : 1;
    if (!page || page < 1) {
        return res.redirect(req.baseUrl);
    }

    let where = 'WHERE 1';
    if (search) {
        where += ` AND \`name\` LIKE ${db.escape('%' + search + '%')}`;
    }

    const t_sql = `SELECT COUNT(1) totalRows FROM address_book ${where}`;
    const [[{ totalRows }]] = await db.query(t_sql);
    let totalPages = 0
    let row = []
    if (totalRows) {
        totalPages = Math.ceil(totalRows / perPage);
        if (page > totalPages) {
            return res.redirect(req.baseUrl + "?page=" + totalPages);
        }
        const sql = `SELECT * FROM address_book ${where} LIMIT ${perPage * (page - 1)}, ${perPage}`;
        [row] = await db.query(sql);
    }

    res.json({ totalRows, perPage, totalPages, page, row });
})
router.get('/escape', async (req, res) => {
    res.json({
        c1: db.escape('abc'),
        c2: db.escape("abc"),
        c3: db.escape("a'bc")
    })
});

module.exports = router;