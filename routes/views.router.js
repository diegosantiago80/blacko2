const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productos.json');


const readProducts = () => {
    try {
        return fs.existsSync(productsFilePath) 
            ? JSON.parse(fs.readFileSync(productsFilePath, 'utf-8')) 
            : [];
    } catch (error) {
        console.error('Error al leer productos:', error);
        return [];
    }
};


router.get('/', (req, res) => {
    const products = readProducts();
    res.render('home', { title: "Lista de Productos", products });
});

module.exports = router;
