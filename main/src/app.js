const express = require('express');
const cors = require('cors');
const app = express();
const amqp = require('amqplib/callback_api');
const prodRoutes = require('./routes/product.route');

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

require('./database');

app.use('/api', prodRoutes);

const PORT = process.env.PORT || 8001;

app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);

});