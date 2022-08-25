const OrdenesDAOFactory = require("../persistencia/DAOs/Factory.class/OrdenDAOFactory.class")
const DAO = OrdenesDAOFactory.get()

const logger = require("../loggers/logger")

async function listar(req, res) {
    try {
        const email = req.params.email
        let orden = await DAO.listar(email)
        if (!orden || orden.length < 1) {
            const err = `Error no se encontró Orden cliente: ${email}`
            logger.error(err)
            return res.status(400).json({
                error_description: err
            })
        } else {
            res.status(200).json(orden);
        }
    } catch (error) {
        logger.warn(`Error al listar un Orden: ${error}`)
        return res.status(500).json({
            error_description: 'Server error.'
        });
    }
}

async function guardar(req, res) {
    try {
        const id = req.params.id
        const orden = req.params.body
        const newTimestamp = new Date()
        const timestamp = newTimestamp.toLocaleString()
        const cliente = id
        const nuevaOrden = {
            timestamp,
            cliente,
            productos
        }
        const ordenId = await DAO.guardarNuevo(carrito)
        const info = `La orden se agregó con éxito. Id: ${ordenId._id}`
        logger.info(info)
        return res.status(201).json({
            message: info
        })
    } catch (error) {
        logger.warn(`Error al guardar Orden compra: ${error}`)
        return res.status(500).json({
            error_description: 'Server error.'
        });
    }
}

module.exports = {
    listar,
    guardar
}