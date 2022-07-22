
const config = require("../../config/config")
const UsuariosDAOMongoDB = require("../usuarios/UsuariosDAOMongoDB")

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