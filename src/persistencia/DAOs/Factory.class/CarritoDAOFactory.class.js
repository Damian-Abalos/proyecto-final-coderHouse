const config = require("../../../config/config")
const CarritosDAOMongoDB = require('../carritos/CarritosDAO.mongodb')

class CarritosDAOFactory {
    static get() {
        switch (config.srv.persistencia) {
            case 'mongodb':
                return new CarritosDAOMongoDB();
            default:
                return new CarritosDAOMongoDB();
        }
    }
}

module.exports = CarritosDAOFactory;