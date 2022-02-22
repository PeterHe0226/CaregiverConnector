const express = require('express');
const router = express.Router();

//@route GET api/auth
//@desc test route
//acess public
router.get('/', (req, res) => res.send('Test Auth Route'));

module.exports = router;