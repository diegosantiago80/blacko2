const socket = io();


document.getElementById('agregarProducto').addEventListener('click', () => {
    const title = document.getElementById('title').value;
    const price = document.getElementById('price').value;

    if (title && price) {
        socket.emit('nuevoProducto', { id: Date.now(), title, price });

        Swal.fire({
            icon: 'success',
            title: 'Producto agregado',
            text: `Se agregó "${title}" correctamente.`,
            timer: 2000,
            showConfirmButton: false
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Debes completar todos los campos.'
        });
    }
});

document.getElementById('productos-lista').addEventListener('click', (event) => {
    if (event.target.classList.contains('eliminar')) {
        const id = event.target.getAttribute('data-id');

        Swal.fire({
            title: '¿Eliminar producto?',
            text: "Esta acción no se puede deshacer.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar'
        }).then((result) => {
            if (result.isConfirmed) {
                socket.emit('eliminarProducto', id);
                Swal.fire({
                    icon: 'success',
                    title: 'Producto eliminado',
                    timer: 2000,
                    showConfirmButton: false
                });
            }
        });
    }
});

socket.on('actualizarLista', (products) => {
    const lista = document.getElementById('productos-lista');
    lista.innerHTML = '';

    products.forEach(product => {
        const li = document.createElement('li');
        li.innerHTML = `${product.title} - $${product.price} 
                        <button class="eliminar" data-id="${product.id}">❌</button>`;
        lista.appendChild(li);
    });
});
