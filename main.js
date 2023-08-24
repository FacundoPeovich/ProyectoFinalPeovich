// Array para almacenar los productos seleccionados en el carrito
const carrito = [];

// Almacenar el carrito en LocalStorage
function guardarCarritoEnLocalStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Recuperar el carrito de LocalStorage
function recuperarCarritoDeLocalStorage() {
    const storedCarrito = localStorage.getItem('carrito');
    if (storedCarrito) {
        carrito.push(...JSON.parse(storedCarrito));
    }
}

// Función para manejar el clic en el botón "Añadir a Carrito"
function addToCart(productoId) {
    const producto = document.getElementById(productoId);
    const nombre = producto.querySelector('h2').textContent;
    const precio = obtenerPrecioProducto(productoId);
    const cantidad = parseInt(producto.querySelector('input').value); // Capturar la cantidad

    // Agregar el producto al carrito
    carrito.push({ id: productoId, nombre, precio, cantidad });
    guardarCarritoEnLocalStorage(); // Guardar en localStorage

    // Mostrar una notificación de producto añadido al carrito
    Swal.fire({
        icon: 'success',
        title: 'Producto añadido al carrito',
        text: `${nombre} ha sido añadido al carrito.`,
        showConfirmButton: false,
        timer: 1500
    });
}

// Función para obtener el precio del producto basado en su ID
function obtenerPrecioProducto(productoId) {
    const producto = document.getElementById(productoId);
    const precioTexto = producto.querySelector('.precio').textContent;
    const precioNumerico = parseFloat(precioTexto.replace('$', ''));
    return precioNumerico;
}

// Agregar eventos a los botones "Añadir a Carrito"
const botonesAgregar = document.querySelectorAll('.bg-blue-500');
botonesAgregar.forEach((boton) => {
    boton.addEventListener('click', () => {
        const productoId = boton.parentElement.id;
        addToCart(productoId);
    });
});

// Evento para el botón "Finalizar Compra"
const botonFinalizar = document.getElementById('finalizar');
botonFinalizar.addEventListener('click', () => {
    if (carrito.length === 0) {
        // Mostrar mensaje de error si el carrito está vacío
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Tu carrito de compras está vacío.',
            confirmButtonText: 'Entendido'
        });
    } else {
        // Mostrar el resumen del carrito si no está vacío
        let resumen = '';
        let total = 0;

        carrito.forEach((producto) => {
            const subtotal = producto.precio * producto.cantidad;
            resumen += `${producto.nombre} - Cantidad: ${producto.cantidad} - Precio Unitario: $${producto.precio.toFixed(2)} - Subtotal: $${subtotal.toFixed(2)}\n\n`; // Agregar \n\n para separar productos
            total += subtotal;
        });

        resumen += `Total: $${total.toFixed(2)}`;

        Swal.fire({
            title: 'Resumen de la Compra',
            html: `<pre>${resumen}</pre>`, // Usa el elemento <pre> para mantener los saltos de línea
            confirmButtonText: 'Finalizar Compra'
        }).then((result) => {
            if (result.isConfirmed) {
                // Limpiar el carrito y restablecer los campos de cantidad
                carrito.length = 0; // Limpiar el carrito
                const inputsCantidad = document.querySelectorAll('input[type="number"]');
                inputsCantidad.forEach((input) => {
                    input.value = '1'; // Restablecer el valor predeterminado
                });

                // Limpiar localStorage
                localStorage.removeItem('carrito');
            }
        });
    }
});

// Al cargar la página, recupera el carrito de LocalStorage
recuperarCarritoDeLocalStorage();


