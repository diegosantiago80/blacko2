const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');


const productsFilePath = path.join(__dirname, '../data/productos.json');


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


const writeProducts = (products) => {
    try {
        fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
    } catch (error) {
        console.error('Error escribiendo productos:', error);
    }
};


router.get('/', (req, res) => {
    const { limit } = req.query;
    const products = readProducts();
    if (limit) {
        return res.json(products.slice(0, Number(limit)));
    }
    res.json(products);
});

router.get('/:pid', (req, res) => {
    const { pid } = req.params;
    const products = readProducts();
    const product = products.find((p) => p.id === pid);
    if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(product);
});

router.post('/', (req, res) => {
    const { title, description, code, price, stock, category, thumbnails } = req.body;

    if (!title || !description || !code || typeof price !== 'number' || typeof stock !== 'number' || !category) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios y deben tener el formato correcto' });
    }

    const products = readProducts();

    const existingProduct = products.find((p) => p.code === code);
    if (existingProduct) {
        return res.status(400).json({ error: 'El codigo del producto ya existe' });
    }

    const newProduct = {
        id: uuidv4(),
        title,
        description,
        code,
        price,
        stock,
        category,
        thumbnails: thumbnails || [],
        status: true,
    };

    products.push(newProduct);
    writeProducts(products);

    res.status(201).json(newProduct);
});


router.put('/:pid', (req, res) => {
    const { pid } = req.params;
    const { id, title, description, code, price, stock, category, thumbnails, status } = req.body;

    if (id) {
        return res.status(400).json({ error: "No se puede modificar el ID del producto" });
    }

    const products = readProducts();
    const productIndex = products.findIndex((p) => p.id === pid);

    if (productIndex === -1) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    if (code) {
        const existingProduct = products.find((p) => p.code === code && p.id !== pid);
        if (existingProduct) {
            return res.status(400).json({ error: 'El codigo del producto ya existe' });
        }
    }

    const updatedProduct = {
        ...products[productIndex],
        ...(title && { title }),
        ...(description && { description }),
        ...(code && { code }),
        ...(price !== undefined && { price }),
        ...(stock !== undefined && { stock }),
        ...(category && { category }),
        ...(thumbnails && { thumbnails }),
        ...(status !== undefined && { status }),
    };

    products[productIndex] = updatedProduct;
    writeProducts(products);

    res.json(updatedProduct);
});


router.delete('/:pid', (req, res) => {
    const { pid } = req.params;
    const products = readProducts();
    const filteredProducts = products.filter((p) => p.id !== pid);

    if (filteredProducts.length === products.length) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    writeProducts(filteredProducts);
    res.status(204).send();
});

module.exports = router;
