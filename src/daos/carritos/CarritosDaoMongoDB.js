const CustomError = require("../../errors/CustomError.js")
const MongoDBClient = require("../MongoDBClient.js")
const logger = require("../../loggers/logger.js")

const CarritoModel = require("../../models/Carrito.model.js")
const DAO = require("../DAO.js")

class CarritosDAOMongoDB extends DAO {
    constructor() {
        super();
        if (CarritosDAOMongoDB.instancia) return CarritosDAOMongoDB.instancia
        this.collection = CarritoModel;
        this.conn = new MongoDBClient();
        CarritosDAOMongoDB.instancia = this
    }

    async getAll() {
        try {
            return await this.collection.find({})
        } catch (error) {
            const cuserr = new CustomError(500, 'Error al listar Carritos.', error);
            logger.error(cuserr);
        }
    }

    async getById(id) {
        try {
            return await this.collection.find({
                _id: {
                    $eq: id
                }
            })
        } catch (error) {
            const cuserr = new CustomError(200, `Carrito vacío id ${id}`, error);
            logger.info(cuserr);
            return []
        }
    }

    async getCartByClient(cliente) {
        try {
            return await this.collection.find({
                client: {
                    $eq: cliente
                }
            })
        } catch (error) {
            const cuserr = new CustomError(500, `Error al listar Carrito cliente ${client}`, error);
            logger.error(cuserr);
        }
    }

    async saveCart(carrito) {
        try {
            return await this.collection.create(carrito)
        } catch (error) {
            const cuserr = new CustomError(500, 'Error al guardar carrito.', error);
            logger.error(cuserr)
        }
    }

    async saveProductToCart(cliente, producto, carrito) {
        try {
            let productos = carrito[0].productos
            productos.push(producto[0])
            return await this.collection.updateOne({
                cliente: cliente
            }, {
                $set: {
                    productos: productos
                }
            })
        } catch (error) {
            const cuserr = new CustomError(500, 'Error al guardar carrito.', error);
            logger.error(cuserr)
        }
    }

    async updateCart(cliente, productos) {
        try {
            await this.collection.updateOne({
                cliente: cliente
            }, {
                $set: {
                    productos: productos
                }
            })
            return void(0)
        } catch (error) {
            error => {
                logger.error(`Error al actualizar carrito id: ${id}`)
                const cuserr = new CustomError(500, 'Error al actualizar Carrito. ', error);
                throw cuserr
            }
        }
    };

    async deleteCart(cliente) {
        try {
            return await this.collection.deleteOne({
                cliente: {
                    $eq: cliente
                }
            })
        } catch (error) {
            logger.error(`Error al borrar Carrito id: ${error}`)
            const cuserr = new CustomError(500, 'Error al borrar Carrito. ', error);
            throw cuserr
        }
    }

    async deleteAll() {
        try {
            return await this.collection.deleteMany({})
        } catch (error) {
            logger.error(`Error al borrar: ${error}`)
            const cuserr = new CustomError(500, 'Error al borrar todos los carritos. ', error);
            throw cuserr
        }
    }

}

module.exports = CarritosDAOMongoDB;