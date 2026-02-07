const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Cart = require('../models/cart');
const User = require('../models/user'); // Importante agregar el modelo User
const passport = require('passport');

// --- PRODUCTOS ---

// Vista principal de productos con paginación
router.get("/products", async (req, res) => {
    try {
        const { category, sort, page = 1, limit = 10 } = req.query;
        
        let query = {};
        if (category) query.category = category; 
        
        let options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sort ? { price: sort === "asc" ? 1 : -1 } : {},
            lean: true,  
        };

        const products = await Product.paginate(query, options);

        res.render("home", {
            products: products.docs,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            currentPage: products.page,
            totalPages: products.totalPages,
            selectedCategory: category,  
            selectedSort: sort,
        });
    } catch (error) {
        res.status(500).send("Error al obtener productos");
    }
});

// Detalle de un producto específico
router.get('/products/:pid', async (req, res) => {
    try {
        const product = await Product.findById(req.params.pid).lean();
        if (!product) return res.status(404).send('Producto no encontrado');
        res.render('productDetail', { product }); 
    } catch (error) {
        res.status(500).send('Error al obtener el producto');
    }
});

// --- CARRITO ---

router.get('/cart', passport.authenticate('current', { session: false, failureRedirect: '/login' }), async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate({
            path: 'cart',
            populate: { path: 'products.product' }
        }).lean();

        if (!user || !user.cart) {
            return res.render('cartDetail', { cart: null });
        }
        res.render('cartDetail', { cart: user.cart });
    } catch (error) {
        console.error("Error en vista de carrito:", error);
        res.status(500).send('Error al obtener el carrito');
    }
});

// --- AUTENTICACIÓN Y NAVEGACIÓN ---

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/login', (req, res) => {
    res.render('login');
});

// Redirección de la raíz al login
router.get('/', (req, res) => {
    res.redirect('/login');
});

module.exports = router;