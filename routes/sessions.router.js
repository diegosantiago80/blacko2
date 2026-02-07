const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Cart = require('../models/cart');
const { createHash, isValidPassword } = require('../utils');
const jwt = require('jsonwebtoken');
const passport = require('passport');

// Registro: Crea usuario, hashea clave y asigna un carrito nuevo
router.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;
    try {
        const exists = await User.findOne({ email });
        if (exists) return res.status(400).send({ status: "error", error: "User already exists" });

        const newCart = await Cart.create({}); 
        
        const newUser = {
            first_name, 
            last_name, 
            email, 
            age,
            password: createHash(password), 
            cart: newCart._id
        };
        
        await User.create(newUser);
        res.send({ status: "success", message: "User registered" });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});

// Login: Valida credenciales y genera JWT almacenado en Cookie
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !isValidPassword(user, password)) {
            return res.status(401).send({ status: "error", error: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role }, 
            process.env.JWT_SECRET || 'secretKeyCoder', 
            { expiresIn: '24h' }
        );
        
        res.cookie('coderCookieToken', token, { 
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 1000 
        }).send({ status: "success", message: "Logged in" });

    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});

// Endpoint /current: Valida el JWT y devuelve los datos del usuario logueado
router.get('/current', passport.authenticate('current', { session: false }), async (req, res) => {
    try {
    
        const user = await User.findById(req.user.id).populate('cart').lean();
        
        if (!user) return res.status(404).send({ status: "error", error: "User not found" });

        delete user.password;

        res.send({ status: "success", payload: user });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});


router.get('/logout', (req, res) => {
    res.clearCookie('coderCookieToken');
    res.redirect('/login');
});

module.exports = router;