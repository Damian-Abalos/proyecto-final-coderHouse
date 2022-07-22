const config = require("../../config/config")
const OrdenesDAOMongoDB = require("../ordenes/OrdenesDAOMongoDB.js")

class OrdenesDAOFactory {
    static get() {
        switch (config.srv.persistencia) {
            case 'mongoDB':
                return new OrdenesDAOMongoDB();
            default:
                return new OrdenesDAOMongoDB();
        }
    }
}

module.exports = OrdenesDAOFactory;