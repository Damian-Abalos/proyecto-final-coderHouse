const express = require("express")
const router = express.Router()
const carritos = require('../controllers/Carrito.controller')
const middlewares = require('../middlewares/middlewares')

/* GET: '/' - Lista todos los carritos. */
router.get("/", carritos.listarTodos)

/* POST: '/' - Crea un carrito vacío  */
router.post("/:id", carritos.crearNuevoCarrito)

/* DELETE: '/:id' - Vacía un carrito y lo elimina */
router.delete("/:id", carritos.borrarCarrito)

/* GET: '/:id/productos' - Me permite listar todos los productos guardados en el carrito */
router.get("/:id/productos", carritos.listarCarrito)

/* PUT: '/:id/productos' - Para incorporar productos al carrito por su id de producto */
router.put("/:id/productos", carritos.incorporarProductoCarrito)

/* DELETE: '/:id/productos/:id_prod' - Eliminar un producto del carrito por su id de carrito y de producto */
router.delete("/:id/productos/:id_prod", carritos.borrarProductoCarrito)

/* POST: '/:id/compra' - Para finalizar compra de productos del carrito */
router.post("/:id/compra", carritos.cierreCompra)

module.exports = router;