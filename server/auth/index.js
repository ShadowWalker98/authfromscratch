const express = require('express');
const router  = express.Router();

router.get('/', (req, res) => {
    res.json({
        message : "Yo"
    });
});

router.post('/signup', (req, res) => {
    console.log('body', req.body);
    res.json({
        message: "envelope"
    });
});

module.exports = router;