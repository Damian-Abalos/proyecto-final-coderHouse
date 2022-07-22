const MensajesDAOFactory = require("../DAOs/Factory/MensajeDAOFactory.js")
const MensajeDTO = require("../DTOs/MensajeDTO.js")
const logger = require("../loggers/logger")

const DAO = MensajesDAOFactory.get()

async function getByEmail(req, res) {
    try {
        const email = req.params.email
        let mensajes = await DAO.getByEmail(email)
        if (!mensajes || mensajes.length < 1) {
            const err = `Error no se encontraron mensajes cliente: ${email}.`
            logger.error(err)
            return res.status(400).json({
                error_description: err
            })
        } else {
            let msjDTOs = mensajes.map(o => {
                return new MensajeDTO(o.author, o.emailpara, o.tipo, o.text, o.date, o.id);
            })
            res.status(200).json(msjDTOs);
        }
    } catch (error) {
        logger.warn(`Error al listar mensajes: ${error}`)
        return res.status(500).json({
            error_description: 'Server error.'
        });
    }
}

async function getAll(req, res) {
    try {
        let mensajes = await DAO.getAll()
        if (!mensajes) {
            const err = `Error no se encontraron mensajes.`
            logger.error(err)
            return res.status(400).json({
                error_description: err
            })
        } else {
            let msjDTOs = mensajes.map(o => {
                return new MensajeDTO(o.author, o.emailpara, o.tipo, o.text, o.date, o.id);
            })
            return msjDTOs
        }
    } catch (error) {
        logger.error(`Error al listar mensajes: ${error}`)
    }
}

async function sendMessage(msj) {
    try {
        await DAO.save(msj)
        logger.info('Mensaje guardado con éxito.');
        return
    } catch (error) {
        logger.error(`Error al guardar mensajes: ${error}`)
    }
}

async function save(req, res) {
    try {
        msj = req.body
        await DAO.save(msj)
        const info = 'Mensaje guardado con éxito.'
        logger.info(info);
        res.status(200).json(info);
    } catch (error) {
        logger.error(`Error al guardar mensajes: ${error}`)
    }

    await DAO.save(msj)
}


module.exports = {
    getByEmail,
    getAll,
    sendMessage,
    save
}