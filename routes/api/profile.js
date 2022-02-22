const express = require('express');
const router = express.Router();

//@route GET api/profile
//@desc test route
//acess public
router.get('/', (req, res) => res.send('Test Profile Route'));

module.exports = router;