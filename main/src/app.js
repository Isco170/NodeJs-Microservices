const express = require('express');
const cors = require('cors');
const app = express();
const amqp = require('amqplib/callback_api');

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

require('./database');

amqp.connect('amqps://uitzwlvz:YOMS19CcfQCOXgopDH0eP6W6FeAMhy3A@fox.rmq.cloudamqp.com/uitzwlvz', (error0, connection) => {
    if(error0){
        throw error0
    }

    connection.createChannel( (error1, channel) => {
        if(error1){
            throw error1
        }

        channel.assertQueue('hello', {durable: false})

        app.get('/', (req, res) => {
            res.send('Hello world');
        })
        
        const PORT = process.env.PORT || 8001;
        
        channel.consume('hello', (message) => {
            console.log(message.content.toString())
        })
        app.listen(PORT, () => {
            console.log(`App listening at http://localhost:${PORT}`);
        });
    })
})
