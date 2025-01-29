const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // asignacion de ID unicos 
const router = express.Router();

const cartsFilePath = path.join(__dirname, '../data/carrito.json');
const productsFilePath = path.join(__dirname, '../data/productos.json');

const readCarts = () => {
    try {
        if (!fs.existsSync(cartsFilePath)) return [];
        const data = fs.readFileSync(cartsFilePath, 'utf-8');
        return JSON.parse(data || '[]');
    } catch (error) {
        console.error('Error leyendo carritos:', error);
        return [];
    }
};

const readProducts = () => {
    try {
        if (!fs.existsSync(productsFilePath)) return [];
        const data = fs.readFileSync(productsFilePath, 'utf-8');
        return JSON.parse(data || '[]');
    } catch (error) {
        console.error('Error leyendo productos:', error);
        return [];
    }
};

const writeCarts = (carts) => {
    try {
        fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));
    } catch (error) {
        console.error('Error escribiendo carritos:', error);
    }
};


router.post('/', (req, res) => {
    const carts = readCarts();

    const newCart = {
        id: uuidv4(), 
        products: [],
    };

    carts.push(newCart);
    writeCarts(carts);

    res.status(201).json(newCart);
});

router.get('/:cid', (req, res) => {
    const { cid } = req.params;
    const carts = readCarts();
    const cart = carts.find((c) => c.id === cid);

    if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    res.json(cart.products);
});

router.post('/:cid/product/:pid', (req, res) => {
    const { cid, pid } = req.params;

    const carts = readCarts();
    const products = readProducts();

    const cart = carts.find((c) => c.id === cid);
    if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    const productExists = products.find((p) => p.id === pid);
    if (!productExists) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const productIndex = cart.products.findIndex((p) => p.product === pid);

    if (productIndex === -1) {
        cart.products.push({ product: pid, quantity: 1 });
    } else {
        cart.products[productIndex].quantity += 1;
    }

    writeCarts(carts);

    res.status(200).json(cart);
});

router.delete('/:cid', (req, res) => {
    const { cid } = req.params;
    let carts = readCarts();

    const filteredCarts = carts.filter(cart => cart.id !== cid);

    if (filteredCarts.length === carts.length) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    writeCarts(filteredCarts);

    res.status(200).json({ message: 'Carrito eliminado correctamente' });
});

router.delete('/:cid/product/:pid', (req, res) => {
    const { cid, pid } = req.params;
    let carts = readCarts();

    const cartIndex = carts.findIndex(cart => cart.id === cid);
    if (cartIndex === -1) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    const filteredProducts = carts[cartIndex].products.filter(product => product.product !== pid);

    if (filteredProducts.length === carts[cartIndex].products.length) {
        return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
    }

    carts[cartIndex].products = filteredProducts;
    writeCarts(carts);

    res.status(200).json({ message: 'Producto eliminado del carrito' });
});


module.exports = router;
