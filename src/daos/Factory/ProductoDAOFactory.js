const config = require("../../config/config")
const ProductosDAOMongoDB = require('../productos/ProductosDAOMongoDB')
const ProductosDaoFirebase = require('../productos/ProductosDaoFirebase')
const ProductosDaoArchivo = require('../productos/ProductosDaoArchivo')

class ProductosDAOFactory {
    static get() {
        switch (config.srv.persistencia) {
            case 'mongoDB':
                return new ProductosDAOMongoDB()
                break
            case 'firebase':
                return new ProductosDaoFirebase()
                break
            case 'archivo':
                return new ProductosDaoArchivo()
                break
            default:
                return new ProductosDAOMongoDB()
        }
    }
}

module.exports = ProductosDAOFactory;