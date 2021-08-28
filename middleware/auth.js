const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // Get token from header

    const token = req.header('x-auth-token');

    // check if no token

    if (!token) {
        return res.status(401).json({
            msg: 'No token, auth denied'
        })
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        // set user id in req.user

        req.user = decode.user;
        next()
    } catch (error) {
        req.status(401).json({
            msg: 'Token is not valid'
        })
    }
}