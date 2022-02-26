const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
    //get token from header
    const token = req.header('x-auth-token');

    //check if no token, return 401 not authorized
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied.' });
    }
    //verify token
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        req.user = decoded.user;
        //as in any middleware
        next();
    } catch(err) {
        res.status(401).json({ msg: 'Token is not valid.' });
    }
};