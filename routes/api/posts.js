const express = require('express');
const router = express.Router();

//@Route  GET api/posts/test
//@Desc   Test post route
//@access Public
router.get('/test', (req, res) =>  res.json({"message": "Posts works"}));

module.exports = router ;