const express = require('express');
const router = express.Router();

//@route GET api/users
//@desc test route
//acess public
router.get('/', (req, res) => res.send('Test User Route'));

module.exports = router;