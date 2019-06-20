const express = require('express');
const router = express.Router();

//@Route  GET api/profile/test
//@Desc   Test post route
//@access Public
router.get('/test', (req, res) =>  res.json({"message": "Profile works"}));

module.exports = router ;