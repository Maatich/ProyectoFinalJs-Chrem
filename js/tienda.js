// --------------------------------------------------------------------------------//
// -- PROYECTO: TIENDA ONLINE -----------------------------------------------------//
// -- ALUMNO: Matias Chrem ------------------------------------------------------//
// --------------------------------------------------------------------------------//
window.onload = function () {

    contenedorProductos.innerHTML = ""

    const productosAll = fetch('./js/productos.json')
        .then((productosAll) => productosAll.json()).then((array) => {

            array.forEach(producto => {

                const div = document.createElement('div')
                div.className = 'col mb-5'

                div.innerHTML = `
                <div class="card h-100">
                <img class="card-img-top" src=${producto.img} alt="..." />
                <div class="card-body p-4">
                    <div class="text-center">
                        <h5 class="fw-bolder">${producto.titulo}</h5>
                        $ ${producto.precio}
                    </div>
                </div>
                <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                    <div class="text-center"><button class="btn btn-outline-dark mt-auto" id="agregar${producto.id}">Agregar al carrito</button></div>
                </div>
                </div>
            `
                contenedorProductos.appendChild(div)

                const boton = document.getElementById(`agregar${producto.id}`)

                boton.addEventListener('click', () => {
                    agregarCarrito(producto.id)
                })

            });


        })

}
const carrito = []
// --------------------------------------------------------------------------------//
document.addEventListener('DOMContentloaded', () => {
    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'))
        actualizarCarrito()
    }

})
// --------------------------------------------------------------------------------//
const contenedorProductos = document.getElementById('cont-productos')
const contenedorBusqueda = document.getElementById('cont-busqueda')
const contenedorCarrito = document.getElementById('carrito-contenedor')
const btnvaciarCarrito = document.getElementById('vaciar-carrito')
const contadorCarrito = document.getElementById('contador-carrito')
const precioTotal = document.getElementById('preciototal')
const btnbuscador = document.getElementById('btnbuscador')
// --------------------------------------------------------------------------------//
btnvaciarCarrito.addEventListener('click', () => {
    carrito.length = 0
    actualizarCarrito()
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    Toast.fire({
        icon: 'success',
        title: 'Vaciaste el carrito!'
    })
})

const agregarCarrito = (prodId) => {
    const existe = carrito.some(prod => prod.id === prodId)

    if (existe) {
        const prod = carrito.map(prod => {
            if (prod.id == prodId) {
                prod.cantidad++
            }
            Swal.fire({
                title: 'Producto existente',
                text: 'Este producto ya existe en el carrito! Cantidad actual: ' + prod.cantidad,
                icon: 'info',
                iconColor: 'orange',
                confirmButtonText: 'Entendido',
                showCancelButton: false,
                cancelButtonText: ''
            })
        })
    } else {
        const array = fetch('./js/productos.json')
        .then((array) => array.json()).then((array) => {

            let item = array.find((array) => array.id === prodId)

            carrito.push(item)
                actualizarCarrito()
        })

        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })

        Toast.fire({
            icon: 'success',
            title: 'Producto agregado!'
        })
    }

    actualizarCarrito()
}


const eliminarDelCarrito = (prodId) => {

    const item = carrito.find((prod) => prod.id === prodId)
    const indice = carrito.indexOf(item)

    carrito.splice(indice, 1)
    actualizarCarrito()

    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    Toast.fire({
        icon: 'success',
        title: 'Producto eliminado!'
    })

}
function actualizarCarrito() {

    contenedorCarrito.innerHTML = ""

    carrito.forEach((producto) => {

        const div = document.createElement('div')
        div.className = 'col mb-5'
        div.innerHTML = `
        <div class="card h-100">
        <img class="card-img-top" src=${producto.img} alt="..." />
        <div class="card-body p-4">
            <div class="text-center">
                <h5 class="fw-bolder">${producto.titulo}</h5>
                $ ${producto.precio}
            </div>
        </div>
        <p>Stock: ${producto.stock}</p>
        <p>Cantidad: ${producto.cantidad}</p>
        <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
        <button type="button" onclick="eliminarDelCarrito(${producto.id})" class="btn btn-outline-warning mt-auto">Eliminar</button>
        </div>
        </div>
        `
        contenedorCarrito.appendChild(div)
        localStorage.setItem('carrito', JSON.stringify(carrito))

    })

    contadorCarrito.innerText = carrito.length
    precioTotal.innerText = carrito.reduce((acc, prod) => acc + prod.precio, 0)
    localStorage.setItem('carrito', JSON.stringify(carrito))


}
function buscador(array) {
    let buscador = document.getElementById('buscador').value;

    if (!buscador) {
        return array
    } else {
        return array.filter(producto => producto.categoria.toLowerCase() === buscador.toLowerCase())
    }

}
async function bringData() {
    const response = await fetch('./js/productos.json');
    const data = await response.json();

    crearHTML(buscador(data))
}
function crearHTML(array) {
    contenedorProductos.innerHTML = ""

    array.forEach(producto => {

        const div = document.createElement('div')
        div.className = 'col mb-5'

        div.innerHTML = `
        <div class="card h-100">
        <img class="card-img-top" src=${producto.img} alt="..." />
        <div class="card-body p-4">
            <div class="text-center">
                <h5 class="fw-bolder">${producto.titulo}</h5>
                $ ${producto.precio}
            </div>
        </div>
        <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
            <div class="text-center"><button class="btn btn-outline-dark mt-auto" id="agregar${producto.id}">Agregar al carrito</button></div>
        </div>
        </div>
        `
        contenedorProductos.appendChild(div)

        const boton = document.getElementById(`agregar${producto.id}`)

        boton.addEventListener('click', () => {
            agregarCarrito(producto.id)
        })

    });

}
btnbuscador.addEventListener('click', () => {
    bringData()
})
