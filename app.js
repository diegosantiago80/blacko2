const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const path = require('path');
const { engine } = require('express-handlebars');
const cookieParser = require('cookie-parser');
const passport = require('passport');

// Importar Configuraciones
const initializePassport = require('./config/passport.config');

// Importar Routers
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');
const viewsRouter = require('./routes/views.router'); 
const sessionsRouter = require('./routes/sessions.router');

const app = express();

// --- Conexión a MongoDB ---
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Conectado a MongoDB Atlas');
    } catch (error) {
        console.error('❌ Error al conectar a MongoDB:', error);
        process.exit(1);
    }
};
connectDB();

// --- Configuración de Handlebars ---
app.engine('handlebars', engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

// Passport Middleware
initializePassport();
app.use(passport.initialize());

// --- Rutas ---
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/sessions', sessionsRouter); // Endpoint para Login, Registro y Current
app.use('/', viewsRouter); 

// --- Manejo de Errores Globales ---
process.on('uncaughtException', (err) => {
    console.error('❌ Error no capturado:', err);
});

// --- Lanzamiento del Servidor ---
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});