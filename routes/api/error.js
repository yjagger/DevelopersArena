const express = require('express');
const router = express.Router();

//@Path GET /error
//@Desc Universal error page
router.get('/', (req, res)=> {
    res.status(400).json({error: 'Oi, we have a problem!'})
})