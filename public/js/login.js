const form = document.getElementById('loginForm');

form.addEventListener('submit', async e => {
    e.preventDefault();
    
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);

    try {
        const response = await fetch('/api/sessions/login', {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: { 'Content-Type': 'application/json' }
        });

        const result = await response.json();

        if (response.ok) {
            // Borra cualquier ID de carrito antiguo del localStorage
            // para que el home se vea obligado a pedir el nuevo al servidor.
            localStorage.removeItem("cartId"); 

            alert("¡Bienvenido! Login exitoso.");
            
            // Redirige a la tienda
            window.location.replace('/products'); 
        } else {
            // Muestra el error específico que devuelve el servidor
            alert(`Error: ${result.error}`);
        }
    } catch (error) {
        console.error("Error al loguear:", error);
        alert("Hubo un problema con la conexión al servidor.");
    }
});