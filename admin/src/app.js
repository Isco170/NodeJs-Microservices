const express = require('express');
const cors = require('cors');
const app = express();
let amqp = require('amqplib/callback_api');
const prodRoutes = require('./route/product.routes');

const database = require('./database');
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

amqp.connect('amqps://uitzwlvz:YOMS19CcfQCOXgopDH0eP6W6FeAMhy3A@fox.rmq.cloudamqp.com/uitzwlvz', (error0, connection) => {
    if(error0){
        throw error0
    }

    connection.createChannel( (error1, channel) => {
        if(error1){
            throw error1
        }

        app.get('/', (req, res) => {
            res.send('Hello world');
        })
        
        app.use('/api/products', prodRoutes)
        
        const PORT = process.env.PORT || 8000;
        
        app.listen(PORT, () => {
            console.log(`App listening at http://localhost:${PORT}`);
            database.authenticate().then(async () => {
                console.log("Conectado a base de dados");
                // await database.sync({ alter: true });
            }).catch((e) => {
                console.log("Erro: "+ e);
            });
        });
    })
})
