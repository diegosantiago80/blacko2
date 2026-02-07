Backend E-commerce - Sistema de Usuarios y Autenticación
Descripción

Este proyecto es una plataforma de backend para un e-commerce. En esta etapa, se implementó un sistema completo de gestión de usuarios, incluyendo autenticación y autorización utilizando Passport, JWT y Bcrypt.
Nuevas Funcionalidades (Entrega N° 1)

    Modelo de Usuario: Registro con campos validados y asociación automática a un carrito.

    Seguridad: Hasheo de contraseñas con bcrypt.hashSync.

    Estrategia Passport: Implementación de la estrategia 'current' para validación de identidad.

    Sistema de Login: Generación de tokens JWT almacenados en cookies.

    Endpoint /api/sessions/current: Recuperación de datos del usuario logueado mediante el token.

Tecnologías Utilizadas

    Node.js & Express

    MongoDB & Mongoose

    Passport & Passport-JWT (Autenticación)

    JSON Web Tokens (JWT)

    Bcrypt (Encriptación)

    Handlebars (Motor de plantillas)

Configuración del Entorno

Variables de Entorno

Crear un archivo .env en la raíz del proyecto (este archivo está excluido en el .gitignore):

MONGO_URI=mongodb+srv://diegosantiagoupe:123456coder@blackocluster.88q00.mongodb.net/?retryWrites=true&w=majority&appName=BlackoCluster
JWT_SECRET=coderSecretKey123
PORT=8080

Instalación

    * Clonar el repositorio.

    * Ejecutar npm install para descargar las dependencias.

    * Iniciar el servidor con npm start.

Endpoints Principales:

Sesiones e Identidad:

POST	/api/sessions/register	Registra un nuevo usuario y le asigna un carrito.

POST	/api/sessions/login	Autentica al usuario y genera la cookie de sesión.

GET	/api/sessions/current	Devuelve los datos del usuario actual (Requiere JWT).

Productos y Carritos:

GET /api/products: Listado con paginación y filtros.

GET /api/carts/:cid: Detalle de un carrito específico con sus productos.

Vistas (Frontend):

/register: Formulario de creación de cuenta.

/login: Formulario de acceso.

/products: Visualización de productos disponibles.
