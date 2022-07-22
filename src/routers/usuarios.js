const express = require("express")
const router = express.Router()
const usuarios = require('../controllers/Usuario.controller')
const middlewares = require('../middlewares/middlewares')
const validations = require('../middlewares/validations')

router.get("/:id", middlewares.usersAuth, usuarios.getByEmail)

router.post("/", middlewares.usersAuth, middlewares.validate(validations.validationUsuario), usuarios.save)

module.exports = router;