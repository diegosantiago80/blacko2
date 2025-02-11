const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const viewsRouter = require('./routes/views.router');
app.use('/', viewsRouter);



const readProducts = () => {
    try {
        const data = fs.readFileSync('./data/productos.json', 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error al leer productos.json:", error);
        return [];
    }
};


const writeProducts = (products) => {
    try {
        fs.writeFileSync('./data/productos.json', JSON.stringify(products, null, 2));
    } catch (error) {
        console.error("Error al escribir en productos.json:", error);
    }
};

let products = readProducts();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(express.json());

const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', { products });
});

io.on('connection', (socket) => {
    console.log('🟢 Nuevo cliente conectado');

    socket.on('nuevoProducto', (producto) => {
        if (!producto.title || !producto.price) {
            console.error("❌ Error: Producto invalido");
            return;
        }

        producto.id = uuidv4();
        products.push(producto);
        writeProducts(products); 
        io.emit('actualizarLista', products);
    });

    
    socket.on('eliminarProducto', (id) => {
        const index = products.findIndex((p) => p.id == id);
        if (index !== -1) {
            products.splice(index, 1);
            writeProducts(products); 
            io.emit('actualizarLista', products);
        }
    });

    socket.on('disconnect', () => {
        console.log('🔴 Cliente desconectado');
    });
});

const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
