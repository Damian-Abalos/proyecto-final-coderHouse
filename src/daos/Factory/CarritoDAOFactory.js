
const config = require("../../config/config")
const CarritosDAOMongoDB = require('../carritos/CarritosDAOMongoDB')
const CarritosDaoFirebase = require('../carritos/CarritosDAOFirebase')
const CarritosDaoArchivo = require('../carritos/CarritosDAOArchivo')

class CarritosDAOFactory {
    static get() {
        switch (config.srv.persistencia) {
            case 'mongoDB':
                return new CarritosDAOMongoDB()
                break
            case 'firebase':
                return new CarritosDaoFirebase()
                break
            case 'archivo':
                return new CarritosDaoArchivo()
                break
            default:
                return new CarritosDAOMongoDB()
        }
    }
}

module.exports = CarritosDAOFactory;