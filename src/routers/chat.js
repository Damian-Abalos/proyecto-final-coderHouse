const express = require("express")
const router = express.Router()
const chats = require('../controllers/Mensaje.controller')
const middlewares = require('../middlewares/middlewares')
const validations = require('../middlewares/validations')

router.get("/:email", middlewares.usersAuth, chats.listar)

router.post("/", middlewares.usersAuth, middlewares.validate(validations.validationMessage), chats.guardar)

module.exports = router;