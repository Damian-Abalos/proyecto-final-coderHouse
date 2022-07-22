const CustomError = require("../../errors/CustomError.js")
const MongoDBClient = require("../MongoDBClient.js")
const logger = require("../../loggers/logger.js")

const OrdenModel = require("../../models/Ordenes.model.js")
const DAO = require("../DAO.js")

class OrdenesDAOMongoDB extends DAO {
    constructor() {
        super();
        if (OrdenesDAOMongoDB.instancia) return OrdenesDAOMongoDB.instancia
        this.collection = OrdenModel;
        this.conn = new MongoDBClient();
        OrdenesDAOMongoDB.instancia = this
    }

    async getAll() {
        try {
            return await this.collection.find({})
        } catch (error) {
            const cuserr = new CustomError(500, 'Error al listar Ordenes.', error);
            logger.error(cuserr);
        }
    }

    async getByEmail(email) {
        try {
            return await this.collection.find({
                email: {
                    $eq: email
                }
            })
        } catch (error) {
            const cuserr = new CustomError(500, `Error al listar Ordenes de compra Usuario id ${cliente}`, error);
            logger.error(cuserr);
        }
    }

    async save(orden) {
        try {
            return await this.collection.create(orden)
        } catch (error) {
            const cuserr = new CustomError(500, 'Error al guardar Orden.', error);
            logger.error(cuserr)
        }
    }

    async deleteByClient(cliente) {
        try {
            return await this.collection.deleteOne({
                email: {
                    $eq: cliente
                }
            })
        } catch (error) {
            logger.error(`Error al borrar Usuario id: ${error}`)
            const cuserr = new CustomError(500, 'Error al borrar Usuario. ', error);
            throw cuserr
        }
    }

    async deleteAll() {
        try {
            return await this.collection.deleteMany({})
        } catch (error) {
            logger.error(`Error al borrar id: ${error}`)
            const cuserr = new CustomError(500, 'Error al borrar todos los Ordenes. ', error);
            throw cuserr
        }
    }

    async newOrderNumber() {
        try {
            return await this.collection.count() +1 
        } catch (error) {
            logger.error(`Error al totalizar ordenes de compra: ${error}`)
            const cuserr = new CustomError(500, 'Error al totalizar ordenes de compra. ', error);
            throw cuserr
        }
    }

}

module.exports = OrdenesDAOMongoDB;