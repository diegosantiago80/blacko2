const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');
const Product = require('../models/product');


// Ruta para mostrar los carritos en Handlebars
router.get('/view', async (req, res) => {
    try {
        const carts = await Cart.find().lean();
        res.render('cartDetail', { carts }); 
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los carritos', details: error.message });
    }
});

// Crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        const newCart = new Cart({ products: [] });
        const savedCart = await newCart.save();
        res.status(201).json(savedCart);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el carrito' });
    }
});

// Obtener un carrito por ID con populate para ver los detalles de los productos
router.get('/:cid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate('products.product');
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el carrito', details: error.message });
    }
});




// Agregar un producto a un carrito
router.post('/:cid/product/:pid', async (req, res) => {
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

        // Verificar si el producto ya está en el carrito
        const productIndex = cart.products.findIndex(p => p.product.toString() === pid);

        if (productIndex === -1) {
            cart.products.push({ product: pid, quantity: 1 });
        } else {
            cart.products[productIndex].quantity += 1;
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar producto al carrito' });
    }
});

// Eliminar un carrito por ID
router.delete('/:cid', async (req, res) => {
    try {
        const deletedCart = await Cart.findByIdAndDelete(req.params.cid);
        if (!deletedCart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        res.json({ message: 'Carrito eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el carrito' });
    }
});

//consultar todos los carritos existentes 
router.get('/', async (req, res) => {
    try {
        const carts = await Cart.find().populate('products.product');
        res.json(carts);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los carritos' });
    }
});


// Eliminar un producto dentro de un carrito
router.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;

        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        const filteredProducts = cart.products.filter(p => p.product.toString() !== pid);

        if (filteredProducts.length === cart.products.length) {
            return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
        }

        cart.products = filteredProducts;
        await cart.save();

        res.json({ message: 'Producto eliminado del carrito' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar producto del carrito' });
    }
});

// Actualizar un carrito con un arreglo de productos
router.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body;

        const cart = await Cart.findByIdAndUpdate(cid, { products }, { new: true });

        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el carrito', details: error.message });
    }
});

// Actualizar la cantidad de un producto en el carrito
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        const cart = await Cart.findById(cid);

        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        const productIndex = cart.products.findIndex(p => p.product.toString() === pid);

        if (productIndex === -1) {
            return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
        }

        cart.products[productIndex].quantity = quantity;
        await cart.save();

        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la cantidad del producto', details: error.message });
    }
});

// Eliminar todos los productos del carrito (sin eliminar el carrito)
router.delete('/:cid/products', async (req, res) => {
    try {
        const { cid } = req.params;

        const cart = await Cart.findByIdAndUpdate(cid, { products: [] }, { new: true });

        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        res.json({ message: 'Todos los productos eliminados del carrito' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar los productos del carrito', details: error.message });
    }
});

module.exports = router;
