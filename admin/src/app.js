const express = require('express');
const cors = require('cors');
const app = express();
const prodRoutes = require('./route/product.routes');

const database = require('./database');
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
