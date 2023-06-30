const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET_KEY;

const fetchuser = (req, res, next) => { // the next function here calls the next function in the chain where the middleware function is used.

    // get the user from the jwt token and add id to the requested object

    const token = req.header('auth-token'); // the header name is auth-token
    if (!token) {
        res.status(401).send({ error: 'Please authenticate using valid token' });
    }

    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({ error: 'Please authenticate using valid token' });
    }
}

module.exports = fetchuser;