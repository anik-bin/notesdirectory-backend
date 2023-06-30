const express = require('express');
require('dotenv').config();
const cors = require('cors');
const connectToMongo = require('./mongodb/db.js');

const app = express();
const port = process.env.PORT;
app.use(express.json());
app.use(cors());

// Available Routes

app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.listen(port, ()=>{
    console.log(`listening on port ${port}`);
})

connectToMongo();