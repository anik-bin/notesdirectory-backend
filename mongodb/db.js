const mongoose = require('mongoose');
require('dotenv').config();

const connectToMongo = async () =>{
    try {
        await mongoose.connect(process.env.MONGOURI);
        console.log("connected to mongodb successfully");
    } catch (error) {
        console.log("failed to connect to mongodb");
    }
};

module.exports = connectToMongo;