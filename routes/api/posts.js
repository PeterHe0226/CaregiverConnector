const express = require('express');
const router = express.Router();

//@route GET api/posts
//@desc test route
//acess public
router.get('/', (req, res) => res.send('Test Posts Route'));

module.exports = router;