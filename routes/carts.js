const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');
const Product = require('../models/product');

// Vista: mostrar todos los carritos
router.get('/view', async (req, res) => {
    try {
        const carts = await Cart
            .find()
            .populate('products.product')
            .lean();

        res.render('cartDetail', { carts });
    } catch (error) {
        res.status(500).json({
            error: 'Error al obtener los carritos',
            details: error.message
        });
    }
});

// Crear carrito
router.post('/', async (req, res) => {
    try {
        const newCart = new Cart({ products: [] });
        const savedCart = await newCart.save();
        res.status(201).json(savedCart);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el carrito' });
    }
});

// Obtener carrito por ID (API)
router.get('/:cid', async (req, res) => {
    try {
        const cart = await Cart
            .findById(req.params.cid)
            .populate('products.product');

        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        res.json(cart);
    } catch (error) {
        res.status(500).json({
            error: 'Error al obtener el carrito',
            details: error.message
        });
    }
});

// Agregar producto al carrito
router.post('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;

        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        const product = await Product.findById(pid);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const index = cart.products.findIndex(
            p => p.product.toString() === pid
        );

        if (index === -1) {
            cart.products.push({ product: pid, quantity: 1 });
        } else {
            cart.products[index].quantity += 1;
        }

        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar producto al carrito' });
    }
});

// Eliminar producto del carrito
router.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;

        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        const initialLength = cart.products.length;

        cart.products = cart.products.filter(
            p => p.product.toString() !== pid
        );

        if (cart.products.length === initialLength) {
            return res.status(404).json({
                error: 'Producto no encontrado en el carrito'
            });
        }

        await cart.save();
        res.json({ message: 'Producto eliminado del carrito' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar producto del carrito' });
    }
});

// Vaciar carrito
router.delete('/:cid/products', async (req, res) => {
    try {
        const cart = await Cart.findByIdAndUpdate(
            req.params.cid,
            { products: [] },
            { new: true }
        );

        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        res.json({ message: 'Carrito vaciado correctamente' });
    } catch (error) {
        res.status(500).json({
            error: 'Error al vaciar el carrito',
            details: error.message
        });
    }
});

module.exports = router;

