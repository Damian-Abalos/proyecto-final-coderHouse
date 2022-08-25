const config = require("../../../config/config")
const UsuariosDAOMongoDB = require("../usuarios/UsuariosDAO.mongodb")

class UsuariosDAOFactory {
    static get() {
        switch (config.srv.persistencia) {
            case 'mongodb':
                return new UsuariosDAOMongoDB();
            default:
                return new UsuariosDAOMongoDB();
        }
    }
}

module.exports = UsuariosDAOFactory;