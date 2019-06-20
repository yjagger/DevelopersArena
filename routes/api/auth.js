const express = require('express');
const router = express.Router();

//@Route  GET api/users/test
//@Desc   Test users route
//@access Public
router.get('/test', (req, res) =>  res.json({"message": "Auth works"}));

module.exports = router ;