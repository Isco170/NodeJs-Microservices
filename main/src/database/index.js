const mongoose = require('mongoose');
const config = require('../config/index')

mongoose
    .connect(
        config.mongo.url,
        {useNewUrlParser: true, useUnifiedTopology: true}
        )
    .then(() => {
        console.log("Connected to the database");
    
    })
    .catch(( error) =>console.log("Could not connect to the database ", error));