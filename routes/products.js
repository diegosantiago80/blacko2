const express = require('express');
const router = express.Router();
const Product = require('../models/product');




router.get('/view', async (req, res) => {
    try {
        const products = await Product.find().lean(); 
        res.render('productDetail', { products }); 
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos', details: error.message });
    }
});


// Obtener productos con paginacion, orden y filtros
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, category, sort } = req.query; 

        const query = category ? { category } : {}; 

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {},
            lean: true 
        };

        const products = await Product.paginate(query, options);

        res.json({
            status: 'success',
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            currentPage: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `/api/products?page=${products.prevPage}` : null,
            nextLink: products.hasNextPage ? `/api/products?page=${products.nextPage}` : null
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos', details: error.message });
    }
});


// Obtener un producto por ID
router.get('/:pid', async (req, res) => {
    try {
        const product = await Product.findById(req.params.pid);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

// Crear un nuevo producto
router.post('/', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear el producto', details: error.message });
    }
});



// Insertar multiples productos a la vez

router.post('/bulk', async (req, res) => {
    try {
        const savedProducts = await Product.insertMany(req.body);
        res.status(201).json({ message: 'Productos agregados exitosamente', products: savedProducts });
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar los productos', details: error.message });
    }
});


// Actualizar un producto por ID
router.put('/:pid', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.pid, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});

// Eliminar un producto por ID
router.delete('/:pid', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.pid);
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

module.exports = router;
