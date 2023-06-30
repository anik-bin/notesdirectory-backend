const express = require('express');
const router = express.Router();
require('dotenv').config();
const User = require('../mongodb/models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser')
const { body, validationResult } = require('express-validator');

const JWT_SECRET = process.env.JWT_SECRET_KEY;

// Route-1: POST api/auth/createuser we create an user here. No login is required in this case

router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 5 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 })
], async (req, res) => {

    let success = false;

    // If there are errors then this returns a bad request.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    try {
        // check if a user with this email already exists or not using try and catch concept
        let user = await User.findOne({ email: req.body.email })
        if (user) {
            return res.status(400).json({ success, error: "Sorry this email already exists" })
        }

        // creating a salt variable for the salt to be generated using genSalt() function of bycrptjs
        const salt = await bcrypt.genSalt(10);

        // creating a variable secPass to store the generated hash

        const secPass = await bcrypt.hash(req.body.password, salt)

        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass // added the secPass variable here to avail the hashed password
        })

        // creating data object as we will associate the auth token with the id.

        const data = {
            user: {
                id: user.id
            }
        }

        const authtoken = jwt.sign(data, JWT_SECRET); // This variable authtoken will store the signed jwt token and then we can access it
        // console.log(authtoken);
        success = true;
        res.json({ success, authtoken });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error") // send an error with status code 500
    }

});

// Route-2: POST api/auth/login we login an user here. No login is required in this case

router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists()
], async (req, res) => {

    let success = false;

    // If there are errors then this returns a bad request.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // using destructuring to email and password

    const { email, password } = req.body;

    try {
        // check if a user with this email already exists or not using try and catch concept
        let user = await User.findOne({ email })
        if (!user) {
            success = false;
            return res.status(400).json({ success, error: "Invalid login credentials" })
        }

        // checks for the password compares the authtoken and then checks if it is same ot not.
        const comparePass = await bcrypt.compare(password, user.password);

        if (!comparePass) {
            success = false;
            return res.status(400).json({ success, error: "Invalid login credentials" })
        }

        // creating data object as we will associate the auth token with the id.

        const data = {
            user: {
                id: user.id
            }
        }

        const authtoken = jwt.sign(data, JWT_SECRET); // This variable authtoken will store the signed jwt token and then we can access it
        success = true;
        res.json({ success, authtoken });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error") // send an error with status code 500
    }
});

// Route-3: GET api/auth/getuser we will get details of loggedin user. login is required in this case

// the argument fetchuser is a function in the middleware folder which has a next() function which here calls the async function

router.post('/getuser', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password"); // .select("-password") is a mongoose function which emits a selected field. here we fetch the user id and along with it all the other fields data are also accessed. so to maintain privacy we omit the password field to be accssed.
        res.send(user);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;