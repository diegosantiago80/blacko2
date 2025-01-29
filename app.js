const express = require('express');
const app = express();


app.use(express.json());


const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.get('/saludo/',(req,res)=>{
    res.send("hola que tal...")
})

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
