const express = require("express")
const router = express.Router()
const productos = require('../controllers/Producto.controller')
const middlewares = require('../middlewares/middlewares')
const validations = require('../middlewares/validations')

//productos

// Obtener productos 
router.get("/", middlewares.usersAuth, productos.getAll)

// Obtener producto por id
router.get("/:id", middlewares.usersAuth, productos.getById)

// Obtener productos por categoria
router.get("/categoria/:categoria", middlewares.usersAuth, productos.getCategory)

// Agregar producto
router.post("/", middlewares.usersAuth, middlewares.isAdmin, middlewares.validate(validations.validationProduct), productos.save)

// Actualizar producto por id
router.put("/:id", middlewares.usersAuth, middlewares.isAdmin, middlewares.validate(validations.validationProduct), productos.update)

// Eliminar producto por id
router.delete("/:id", middlewares.usersAuth, middlewares.isAdmin, productos.deleteById)

module.exports = router;