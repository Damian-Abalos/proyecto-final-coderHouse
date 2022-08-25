const express = require("express")
const router = express.Router()
const chats = require('../controllers/Mensaje.controller')
const validations = require('../middlewares/validations')


/* GET: '/' - Lista todos los chats. */
router.get("/:email", chats.listar)

/* GET: '/' - Lista todos los chats. */
router.post("/", validations.validate(validations.validationMessage), chats.guardar)

module.exports = router;