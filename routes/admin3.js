const express = require('express');
const router = express.Router();
router.get('/admin3', (req, res) => {
    const { url, baseUrl, originalUrl } = req;
    res.json({
        url, baseUrl, originalUrl
    })
})

router.get('/admin3/:p1?/:p2?', (req, res) => {
    res.json(req.params);
})

module.exports = router;