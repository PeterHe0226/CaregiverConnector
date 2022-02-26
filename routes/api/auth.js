const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

//@route GET api/auth
//@desc send back user info given a valid token
//acess public
//add middleware as the second argument, the function is automatically protected?
router.get('/', auth, async (req, res) => {
    try {
        //leave off the password
        const userInfo = await User.findById(req.user.id).select('-password');
        res.json(userInfo);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error!');
    }
});

//@route POST api/auth
//@desc Authenticate user login and get token
//acess public
router.post('/', 
[check('email', 'Please include a valid email.').isEmail(),
check('password', 'Password is required for login.').exists()],
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
         //see if user exists
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ errors: [{ msg: 'Account not exist. Invalid credentials.' }] });
        }

    //check plaintext password matches the encrypted password in the database
    const passwordIsMatch = await bcrypt.compare(password, user.password);
    if (!passwordIsMatch) {
        return res.status(400).json({ errors: [{ msg: 'Invalid credentials.' }] });
    }
    
    //return jsonwebtoken
    const payload = {
        user: {
            //mongoose has the abstraction so you don't need to use ._id as in the actual database
            id: user.id
        }
    }
    jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 360000 }, (err, token) => {
        if (err) throw err;
        res.json({ token });
    });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('User Error in server');
    }

});

module.exports = router;