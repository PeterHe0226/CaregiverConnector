const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
//get user model
const User = require('../../models/User');
//get gravatar
const gravatar = require('gravatar');
//get encryption for password
const bcrypt = require('bcryptjs');
//get jsonwebtoken
const jwt = require('jsonwebtoken');
//get secret key for jwt
const config = require('config');


//@route GET api/users
//@desc Register route
//acess public
router.post('/', 
[check('name', 'Name is required.').not().isEmpty(), 
check('email', 'Please include a valid email.').isEmail(),
check('password', 'Please enter a password with 6 or more characters.').isLength({ min: 6 })],
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
         //see if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ errors: [{ msg: 'This account already exists.' }] });
        }
    //Get user's gravatar
        const avatar = gravatar.url(email, {
            //size
            s: '200',
            //rating
            r: 'pg',
            //default
            d: 'mm'
        });
        user = new User({
            name,
            email,
            avatar,
            password
        });
    //encrypt password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

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