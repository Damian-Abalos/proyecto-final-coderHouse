const CustomError = require("../../errors/CustomError.js")
const MongoDBClient = require("../MongoDBClient.js")
const logger = require("../../loggers/logger.js")

const ProductoModel = require("../../models/Producto.model.js")
const DAO = require("../DAO.js")

class ProductosDAOMongoDB extends DAO {
    constructor() {
        super();
        if (ProductosDAOMongoDB.instancia) return ProductosDAOMongoDB.instancia
        this.collection = ProductoModel;
        this.conn = new MongoDBClient();
        ProductosDAOMongoDB.instancia = this
    }

    async getAll() {
        try {
            return await this.collection.find({})
        } catch (error) {
            const cuserr = new CustomError(500, 'Error al listar Productos.', error);
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
            const cuserr = new CustomError(500, `Error al listar id ${id}`, error);
            logger.error(cuserr);
        }
    }

    async getByCategory(categoria) {
        try {
            return await this.collection.find({
                "category": {
                    $eq: categoria
                }
            })
        } catch (error) {
            const cuserr = new CustomError(500, `Error al listar id ${id}`, error);
            logger.error(cuserr);
        }
    }


    async save(producto) {
        try {
            return await this.collection.create(producto)
        } catch (error) {
            const cuserr = new CustomError(500, 'Error al guardar producto.', error);
            logger.error(cuserr)
        }
    }

    async update(id, newElemento) {
        try {
            const {
                title,
                price,
                thumbnail
            } = newElemento;
            await this.collection.updateOne({
                _id: id
            }, {
                $set: {
                    title: title,
                    price: price,
                    thumbnail: thumbnail
                }
            })
            return void (0)
        } catch (error) {
            error => {
                logger.error(`Error al actualizar id: ${id}`)
                const cuserr = new CustomError(500, 'Error al actualizar Producto. ', error);
                throw cuserr
            }
        }
    };

    async deleteById(id) {
        try {
            return await this.collection.deleteOne({
                _id: {
                    $eq: id
                }
            })
        } catch (error) {
            logger.error(`Error al borrar id: ${error}`)
            const cuserr = new CustomError(500, 'Error al borrar Producto. ', error);
            throw cuserr
        }
    }

    async deleteAll() {
        try {
            return await this.collection.deleteMany({})
        } catch (error) {
            logger.error(`Error al borrar id: ${error}`)
            const cuserr = new CustomError(500, 'Error al borrar todos los Productos. ', error);
            throw cuserr
        }
    }

}

module.exports = ProductosDAOMongoDB;