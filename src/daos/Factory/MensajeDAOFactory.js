const config = require("../../config/config")
const MensajesDAOMongoDB = require("../mensajes/MensajesDAOMongoDB.js")

class MensajesDAOFactory {
    static get() {
        switch (config.srv.persistencia) {
            case 'mongoDB':
                return new MensajesDAOMongoDB();
            default:
                return new MensajesDAOMongoDB();
        }
    }
}

module.exports = MensajesDAOFactory;