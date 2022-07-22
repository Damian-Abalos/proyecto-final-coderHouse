const config = require('../config/config')
const mensajes = require('../utils/mensajes')

//  Carrito
const CarritosDAOFactory = require("../DAOs/Factory/CarritoDAOFactory")
const DAOcart = CarritosDAOFactory.get()

// Producto
const ProductosDAOFactory = require("../DAOs/Factory/ProductoDAOFactory")
const DAOprod = ProductosDAOFactory.get()

// usuario
const UsuariosDAOFactory = require("../DAOs/Factory/UsuarioDAOFactory")
const DAOusuario = UsuariosDAOFactory.get()

// ordenes
const OrdenesDAOFactory = require("../DAOs/Factory/OrdenDAOFactory")
const DAOordenes = OrdenesDAOFactory.get()


const logger = require("../loggers/logger")

async function getAllCarts(req, res) {
    try {
        let carritos = await DAOcart.getAll()
        if (!carritos) {
            const err = `Error no hay carritos.`
            logger.error(err)
            return res.status(400).json({
                error_description: err
            })
        } else {
            res.status(200).json(carritos)
        }
    } catch (error) {
        logger.warn(`Error al listar todos los carritos: ${error}`)
        return res.status(500).json({
            error_description: 'Server error.'
        });
    }
}

async function getCartById(req, res) {
    try {
        const id = req.params.id
        let carrito = await DAOcart.getById(id)
        if (carrito === [DAOcart]) {
            const info = `Carrito vacío id: ${id}`
            logger.info(info)
            return []
        } else {
            res.status(200).json(carrito);
        }
    } catch (error) {
        logger.warn(`Error al listar carrito: ${error}`)
        return res.status(500).json({
            error_description: 'Server error.'
        });
    }
}

async function createCart(req, res) {
    try {
        const id = req.params.id
        const newTimestamp = new Date()
        const timestamp = newTimestamp.toLocaleString()
        const cliente = id
        const carrito = {
            timestamp,
            cliente,
            productos: []
        }
        const carritoId = await DAOcart.saveCart(carrito)
        const info = `Se agrego el carrito con éxito. Id: ${carritoId._id}`
        logger.info(info)
        return res.status(201).json({
            message: info
        })
    } catch (error) {
        logger.warn(`Error al guardar carrito: ${error}`)
        return res.status(500).json({
            error_description: 'Server error.'
        });
    }
}

async function addProduct(req, res) {
    try {
        const cliente = req.params.id
        const producto = req.body
        let carrito = await DAOcart.getCartByClient(cliente)
        if (!carrito || carrito.length < 1) {
            const newTimestamp = new Date()
            const timestamp = newTimestamp.toLocaleString()
            cart = {
                timestamp,
                cliente,
                productos: []
            }
            carrito = [cart]
            await DAOcart.saveCart(cart)
        }
        const buscarProducto = await DAOprod.getById(producto.id)
        if (!buscarProducto || buscarProducto.length < 1) {
            const err = `No se encontro producto ${producto.id} para incorporar al carrito.`
            logger.error(err)
            return res.status(400).json({
                error_description: err
            })
        } else {
            await DAOcart.saveProductToCart(cliente, buscarProducto, carrito)
            const info = `Se agrego el producto al carrito con éxito.`
            logger.info(info)
            return res.status(201).json({
                message: info
            })
        }
    } catch (error) {
        logger.warn(`Error al incorporar producto al carrito: ${error}`)
        return res.status(500).json({
            error_description: 'Server error.'
        });
    }

}
async function deleteProduct(req, res, next) {
    try {
        const cliente = req.params.id
        const idProd = req.params.id_prod
        const carrito = await DAOcart.getCartByClient(cliente)
        if (!carrito || carrito.length < 1) {
            const err = `Error No se encontró un carrito id: ${cliente}`
            logger.error(err)
            return res.status(400).json({
                error_description: err
            })
        } else {
            let productos = await carrito[0].productos
            const indexProd = productos.findIndex(idProduc => idProduc._id == idProd)
            if (indexProd != -1) {
                const newProductos = productos.filter(product => product._id != idProd)
                carrito[0].productos = newProductos
                const borrar = await DAOcart.updateCart(cliente, carrito[0].productos)
                const info = `Del carrito ${cliente}: el producto ${idProd} se borró con éxito.`
                logger.info(info)
                return res.status(200).json(info)
            } else {
                const err = `No se encontro producto para borrar del carrito.`
                logger.error(err)
                return res.status(400).json({
                    error_description: err
                })
            }
        }
    } catch (error) {
        logger.warn(`Error al borrar producto carrito: ${error}`)
        return res.status(500).json({
            error_description: 'Server error.'
        });
    }
}

async function deleteCart(req, res, next) {
    try {
        const cliente = req.params.id
        const carrito = await DAOcart.getCartByClient(cliente)
        if (!carrito || carrito.length < 1) {
            const err = `Error al listar un carrito cliente: ${cliente}`
            logger.error(err)
            return res.status(400).json({
                error_description: err
            })
        } else {
            await DAOcart.deleteCart(cliente)
            info = `Carrito ${cliente}: Se borró con éxito.`
            logger.info(info)
            res.status(200).json(info)
        }
    } catch (error) {
        logger.warn(`Error al borrar carrito: ${error}`)
        return res.status(500).json({
            error_description: 'Server error.'
        });
    }
}

async function getOrder(carrito) {
    try {
        let productos = carrito[0].productos
        const productosChequeados = await Promise.all(productos.map(async function (element) {
            const prod = await DAOprod.listar(element._id)
            return {
                _id: prod[0]._id,
                title: prod[0].title,
                thumbnail: prod[0].thumbnail,
                price: prod[0].price
            };
        }));
        return productosChequeados;
    } catch (error) {
        logger.warn(`Error al generar la orden. ${error}`);
        return res.status(500).json({
            error_description: 'Error del servidor.'
        });
    }
}


async function checkout(req, res, next) {
    try {
        const cliente = req.params.id
        const carrito = await DAOcart.getCartByClient(cliente)
        if (!carrito || carrito.length < 1) {
            const err = `Error, no se encontró carrito cliente: ${cliente}`
            logger.error(err)
            return res.status(400).json({
                error_description: err
            })
        } else {
            const productosChequeados = await getOrder(carrito)
            const usuario = await DAOusuario.getById(cliente)
            const celular = usuario.celular
            const numeroOrden = await DAOordenes.newOrderNumber()
            const newTimestamp = new Date()
            const timestamp = newTimestamp.toLocaleString()
            ordenCompra = {
                numeroOrden: numeroOrden,
                timestamp: timestamp,
                nombre: usuario.nombre,
                email: usuario.email,
                direccion: usuario.direccion,
                estadoOrden: 'Generada.',
                productos: productosChequeados
            }
            await DAOordenes.save(ordenCompra)
            mensajeria.sms(ordenCompra, celular)
            mensajeria.whatsapp(ordenCompra)
            mensajeria.gmail(ordenCompra)
            await DAOcart.deleteCart(cliente)
            info = `Carrito ${cliente}: Se generó orden de compra con éxito.`
            logger.info(info)
            res.status(200).json(info)
        }
    } catch (error) {
        logger.warn(`Error server: ${error}`)
        return res.status(500).json({
            error_description: 'Server error.'
        });
    }
}


module.exports = {
    getAllCarts,
    getCartById,
    createCart,
    addProduct,
    deleteProduct,
    deleteCart,
    checkout
}