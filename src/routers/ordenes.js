const express = require("express")
const router = express.Router()
const ordenes = require('../controllers/OrdenCompra.controller')
const middlewares = require('../middlewares/middlewares')


/* GET: '/' - Lista todos los ordenes. */
router.get("/:email", ordenes.listar)

/* POST: '/' - Guardar orden  */
router.post("/", ordenes.guardar)


module.exports = router;