const UsuariosDAOFactory = require("../DAOs/Factory/UsuarioDAOFactory.js")
const DAOusr = UsuariosDAOFactory.get()
const mensajes = require('../utils/mensajes')

const logger = require("../loggers/logger")

async function getByEmail(req, res) {
    try {
        const email = req.params.id
        let usuario = await DAOusr.getById(email)
        if (!usuario || usuario.length < 1) {
            const err = `Error, no se encontró al Usuario : ${email}`
            logger.error(err)
            return res.status(400).json({
                error_description: err
            })
        } else {
            res.status(200).json(usuario);
        }
    } catch (error) {
        logger.warn(`Error al listar un Usuario: ${error}`)
        return res.status(500).json({
            error_description: 'Server error.'
        });
    }
}

async function save(req, res) {
    try {
        const usuario = req.body
        const newTimestamp = new Date()
        const timestamp = newTimestamp.toLocaleString()
        const nuevoUsuario = {
            ...usuario,
            timestamp
        };
        const saveId = await DAOusr.save(nuevoUsuario);
        mensajes.gmailNuevo(nuevoUsuario)
        const info = 'Usuario creado con éxito.'
        logger.info(info)
        return res.status(201).json({
            message: info
        });
    } catch (error) {
        logger.warn(`Error al guardar: ${error}`)
        return res.status(500).json({
            error_description: 'Server error.'
        });
    }
}

module.exports = {
    getByEmail,
    save
}