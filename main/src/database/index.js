const mongoose = require('mongoose');

const uri = "mongodb+srv://ultrauser:ultrapass@cluster0.b1zfl.mongodb.net/yt_node_main?retryWrites=true&w=majority";

mongoose
    .connect(
        uri,
        {useNewUrlParser: true, useUnifiedTopology: true}
        )
    .then(() => {
        console.log("Connected to the database");
    
    })
    .catch(( error) =>console.log("Could not connect to the database ", error));