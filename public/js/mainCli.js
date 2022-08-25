// Mi cliente
const socket = io.connect();

/*=======[defino ruta endpoints]=======*/
let url = window.location.href
if (url.includes("localhost"))
    url = "http://localhost:8080"
else url = "https://final-backend-abalos.herokuapp.com/"



API_URLproductos = `${url}/api/productos/`
API_URLremeras = `${url}/api/productos/categoria/remeras`
API_URLpantalones = `${url}/api/productos/categoria/pantalones`
API_URLmedias = `${url}/api/productos/categoria/medias`
API_URLcarrito = `${url}/api/carrito/`

let cookieUsuario = document.cookie.replace('%40', '@')
let usuario = cookieUsuario.slice(5)

//  Normalizr 
const denormalize = normalizr.denormalize;
const schema = normalizr.schema;

// TP Normalizr
//author
const schemaAuthor = new schema.Entity('author', {}, {
    idAttribute: 'mail'
})
// Mensaje
const schemaMensaje = new schema.Entity('mensaje', {
    author: schemaAuthor
}, {
    idAttribute: 'id'
})
// Mensajes
const schemaMensajes = new schema.Entity('mensajes', {
    mensajes: [schemaMensaje]
}, {
    idAttribute: 'id'
})

//Función para testear que ingrese una cadena de email
function testmail(mail) {
    try {
        var exp = /^[a-z0-9_.]+@[a-z0-9]+\.[a-z0-9_.]+$/i
        return exp.test(mail)
    } catch (error) {
        return false;
    }
}

//Capturo el evento input MENSAJES y le sumo la fecha
function SendMesage() {

    if (document.getElementById('mail').value == "" ||
        document.getElementById('nombre').value == "" ||
        document.getElementById('direccion').value == "" ||
        document.getElementById('edad').value == "" ||
        document.getElementById('celular').value == "" ||
        document.getElementById('avatar').value == "" ||
        document.getElementById('mensaje').value == "") {
        alert("Campos Incompletos")
        return false
    }
    const date = new Date()
    const mensaje = {
        author: {
            mail: document.getElementById('mail').value,
            nombre: document.getElementById('nombre').value,
            direccion: document.getElementById('direccion').value,
            edad: document.getElementById('edad').value,
            celular: document.getElementById('celular').value,
            avatar: document.getElementById('avatar').value
        },
        emailpara: 'administrador@gmail.com',
        text: document.getElementById('mensaje').value,
        tipo: 'usuario',
        date: date.toLocaleString(),
    }
    socket.emit('newMessage', mensaje);
    document.getElementById('mensaje').value = "";
    return false;
}


//Emito los mensajes usando una plantilla Handlebars
const tableMessages = async messages => {

    const template = await fetch('../views/messages.hbs');
    const templateText = await template.text();
    const templateHbs = Handlebars.compile(templateText);
    const html = templateHbs({
        messages
    });
    return html
};
socket.on('messages', messages => {
    const denormalizedData = denormalize(messages.result, schemaMensajes, messages.entities)
    const newMessages = denormalizedData.mensajes
    let messagesUsuario = []
    newMessages.map(message => {
        if (message.mail === usuario || message.emailpara === usuario) messagesUsuario.push(message)
    })
    tableMessages(messagesUsuario)
        .then(html => document.getElementById('tableMessages').innerHTML = html);
});



//Leo y renderizo el catálogo de productos
fetch(API_URLproductos, {
    method: 'GET',
})
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(response => renderProductos(response))

function filtrarTodos() {
    fetch(API_URLproductos, {
        method: 'GET',
    })
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => renderProductos(response))
}

function filtrarRemeras() {
    fetch(API_URLremeras, {
        method: 'GET',
    })
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => renderProductos(response))
}

function filtrarPantalones() {
    fetch(API_URLpantalones, {
        method: 'GET',
    })
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => renderProductos(response))
}

function filtrarMedias() {
    fetch(API_URLmedias, {
        method: 'GET',
    })
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => renderProductos(response))
}

//Muestro - cierro  Datos Cliente
function verDatos() {
    document.getElementById("misDatos").hidden = false;
    location.href = '#misDatos'
}

function salirDatos() {
    document.getElementById("misDatos").hidden = true;
}

//Muestro - cierro  Carritos Cliente
function verCarritos() {
    document.getElementById("carritos").hidden = false;
}


//Funcion render para inyectar los card de productos en el HTML
function renderProductos(data) {
    const html = data
        .map((elem, index) => {
            return `<div class="p-3 col-xl-3 col-lg-4 col-md-6 col-sm-12">
                        <div class="card my-2 shadow p-3 bg-white rounded">
                            <img class="card-img-top img-productos" src="${elem.thumbnail}" alt="Card image cap" >
                            <div class="card-body">
                                <p class="card-text">${elem.title}</p>
                                <p class="card-text">Categoria: ${elem.category}</p>
                                <p class="card-text">Precio $ ${elem.price}</p>
                                <p class="card-text" style="font-size:10px">Id: ${elem.id}</p>
                            </div>
                            <button id="producto${elem._id}" class="btn btn-danger btn-sm text-center" onclick="agregoProdCart('${elem.id}')">Agregar Carrito</button>
                        </div>
                    </div>`
        })
        .join(" ")
    document.getElementById("tableProducts").innerHTML = html
}

//Leo y renderizo carrito de compras cliente
fetch(API_URLcarrito + usuario + '/productos', {
    method: 'GET',
})
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(response => {
        if (response.error === 400) {
            fetch(API_URLcarrito + `${usuario}`, {
                method: 'POST',
            })
        }
        renderCarrito(response)
    })

//Funcion render para insertar los productos en el carrito HTML
function renderCarrito(data) {
    const html = data
        .map((elem, index) => {
            let html = `<div>
                    <div class="table-responsive">
                    <table class="table table-dark">
                        <tr style="color:white">
                            <th>Id</th>
                            <th>Nombre</th>
                            <th>Precio</th>
                            <th>Foto</th>
                        </tr>`
            elem.productos.map((prod, index) => {
                html += `<tr>
                        <td class="align-middle">
                            ${prod._id}
                        </td>
                        <td class="align-middle">
                            ${prod.title}
                        </td>
                        <td class="align-middle">
                            $ ${prod.price}
                        </td>
                        <td class="align-middle">
                            <img src="${prod.thumbnail}" width="50" >
                        </td>
                        <td class="align-middle">
                            <button id="carrito${elem.id}-${elem.id}" class="btn btn-danger btn-sm" onclick="eliminoProductoCarrito('${elem.cliente}','${prod._id}')">Eliminar</button>
                        </td>
                    </tr>`
            })
            html += `   </table>
                    </div>
                    <div class="d-flex justify-content-center ">
                        <button id="carrito${elem.id}"  class="btn btn-danger mt-3" onclick="eliminoCarrito('${elem.cliente}')">Vaciar Carrito</button>
                    </div>
                    <br>
                    <div class="d-flex justify-content-center ">
                        <a href="/home" class="btn btn-primary m-2">Seguir comprando</a>
                        <button id="prodcart${elem.id}" class="btn btn-success m-2" onclick="finalizaCompra('${elem.cliente}')">Finalizar Compra</button>
                    </div>
                </div>
                <hr>`
            return html
        })
        .join(" ")
    document.getElementById("carrito").innerHTML = html
}




//Funcion elimino producto Carrito
function eliminoProductoCarrito(idCarrito, idProd) {
    const params = `${idCarrito}/productos/${idProd}`
    fetch(API_URLcarrito + params, {
        method: 'DELETE',
    })
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => renderCarrito(response))
    window.location.reload()

}

//get de productos
async function fetchProd(params) {
    const response = await fetch(API_URLproductos + params, {
        method: 'GET',
    })
    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
    }
    const prod = await response.json()
    return prod
}

//Funcion agrego productos Carrito
async function agregoProdCart(produc) {
    const params = `${produc}`
    const producto = await fetchProd(params)
    const data = JSON.stringify(await producto)
    const params2 = `${usuario}/productos`
    if (data != null) {
        const response = await fetch(API_URLcarrito + params2, {
            method: 'PUT',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: await data
        })
        if (!response.ok) {
            const message = `An error has occured: ${response.status}`;
            throw new Error(message);
        }
    }
    // window.location.reload()
    alert(`producto agregado al carrito`);
}

//Funcion elimino Carrito
function eliminoCarrito(idCarrito) {
    alert(`Elimino el carrito ${idCarrito}`)

    const params = `${idCarrito}`
    fetch(API_URLcarrito + params, {
        method: 'DELETE',
        body: JSON.stringify(`{id: ${idCarrito}}`)
    })
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => renderCarrito(response))
    window.location.reload()
}

//Funcion Finaliza Compra
function finalizaCompra(idCarrito) {
    alert(`Cierre de compra  ${idCarrito}`)

    const params = `${idCarrito}/compra`
    fetch(API_URLcarrito + params, {
        method: 'POST',
        body: JSON.stringify(`{id: ${idCarrito}}`)
    })
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
    //     .then(response => renderCarrito(response))
    // window.location.reload()
    window.location.href = '/after'
}