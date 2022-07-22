const express = require("express")
const router = express.Router()
const ordenes = require('../controllers/Orden.controller')
const middlewares = require('../middlewares/middlewares')
const validations = require('../middlewares/validations')

router.get("/:email", middlewares.usersAuth, ordenes.getByEmail)

router.post("/", middlewares.usersAuth, ordenes.save)

module.exports = router;