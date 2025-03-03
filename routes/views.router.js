const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Cart = require('../models/cart'); 

router.get('/products', async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const options = { page: parseInt(page), limit: parseInt(limit) };
        const products = await Product.paginate({}, options);

        res.render('home', {
            products: products.docs,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            currentPage: products.page,
            totalPages: products.totalPages,
        });
    } catch (error) {
        res.status(500).send('Error al obtener productos');
    }
});



router.get('/products/:pid', async (req, res) => {
    try {
        const product = await Product.findById(req.params.pid);
        if (!product) return res.status(404).send('Producto no encontrado');
        res.render('productDetail', { product: product }); 
    } catch (error) {
        res.status(500).send('Error al obtener el producto');
    }
});

router.get('/carts/:cid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate('products.product'); 
        if (!cart) return res.status(404).send('Carrito no encontrado');
        res.render('cartDetail', { cart });
    } catch (error) {
        res.status(500).send('Error al obtener el carrito');
    }
});

module.exports = router;