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
async function addToCart(productoId) {
    const producto = document.getElementById(productoId);
    const nombre = producto.querySelector('h2').textContent;
    const precio = obtenerPrecioProducto(productoId);
    const cantidad = parseInt(producto.querySelector('input').value);

    // Simulación de una solicitud al servidor para verificar la disponibilidad
    const disponibilidad = await verificarDisponibilidadEnServidor(productoId);

    if (disponibilidad) {
        // Agregar el producto al carrito
        carrito.push({ id: productoId, nombre, precio, cantidad });
        guardarCarritoEnLocalStorage(); // Guardar en localStorage

        Swal.fire({
            icon: 'success',
            title: 'Producto añadido al carrito',
            text: `${nombre} ha sido añadido al carrito.`,
            showConfirmButton: false,
            timer: 1500
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `El producto ${nombre} no está disponible en este momento.`,
            confirmButtonText: 'Entendido'
        });
    }
}

// Función para obtener el precio del producto basado en su ID
function obtenerPrecioProducto(productoId) {
    const producto = document.getElementById(productoId);
    const precioTexto = producto.querySelector('.precio').textContent;
    const precioNumerico = parseFloat(precioTexto.replace('$', ''));
    return precioNumerico;
}

// Cargar los productos desde el archivo JSON
function cargarProductosDesdeJSON() {
    fetch('productos.json')
        .then((response) => response.json())
        .then((productos) => {
            productos.forEach((producto) => {
                // Agregar eventos a los botones "Añadir a Carrito"
                const botonAgregar = document.getElementById(producto.id).querySelector('.bg-blue-500');
                botonAgregar.addEventListener('click', () => {
                    addToCart(producto.id);
                });
            });
        })
        .catch((error) => {
            console.error('Error al cargar productos desde JSON:', error);
        });
}

// Llama a la función para cargar los productos desde el archivo JSON
cargarProductosDesdeJSON();

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
            resumen += `${producto.nombre} - Cantidad: ${producto.cantidad} - Precio Unitario: $${producto.precio.toFixed(2)} - Subtotal: $${subtotal.toFixed(2)}\n\n`;
            total += subtotal;
        });

        resumen += `Total: $${total.toFixed(2)}`;

        Swal.fire({
            title: 'Resumen de la Compra',
            html: `<pre>${resumen}</pre>`,
            confirmButtonText: 'Siguiente',
        }).then((result) => {
            if (result.isConfirmed) {
                // Limpiar el carrito y restablecer los campos de cantidad
                carrito.length = 0;
                const inputsCantidad = document.querySelectorAll('input[type="number"]');
                inputsCantidad.forEach((input) => {
                    input.value = '1';
                });

                // Limpiar localStorage
                localStorage.removeItem('carrito');
            }
        });
    }
});

// Función simulada para verificar la disponibilidad en el servidor 
async function verificarDisponibilidadEnServidor(productoId) {
    return new Promise((resolve) => {
        // Se simula una demora de 2 segundos de respuesta para con el servidor.
        setTimeout(() => {
            resolve(true); // Simulamos que el producto está disponible // Siempre va a dar true por el momento.
        }, 2000);
    });
}

// Función para mostrar el formulario de checkout
function mostrarCheckout() {
    const checkoutSection = document.getElementById('checkout');
    checkoutSection.classList.remove('hidden');
}

// Función para ocultar el formulario de checkout
function ocultarCheckout() {
    const checkoutSection = document.getElementById('checkout');
    checkoutSection.classList.add('hidden');
}

// Evento para el botón "Finalizar Compra"
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
        // Mostrar el formulario de checkout
        mostrarCheckout();
    }
});

// Evento para el envío del formulario de checkout
const checkoutForm = document.getElementById('checkout-form');
checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Obtener los valores del formulario
    const nombre = document.getElementById('nombre').value;
    const tarjeta = document.getElementById('tarjeta').value;

    // Una vez que la compra se ha completado con éxito, se limpia el carrito
    carrito.length = 0;
    const inputsCantidad = document.querySelectorAll('input[type="number"]');
    inputsCantidad.forEach((input) => {
        input.value = '1';
    });

    // Limpiar localStorage
    localStorage.removeItem('carrito');

    // Ocultar el formulario de checkout
    ocultarCheckout();

    // Mostrar mensaje de éxito
    Swal.fire({
        icon: 'success',
        title: 'Compra Exitosa',
        text: 'Gracias por tu compra.',
        confirmButtonText: 'Entendido',
    });
});

// Al cargar la página, se recupera el carrito de LocalStorage
recuperarCarritoDeLocalStorage();

