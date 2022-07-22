const CustomError = require("../errors/CustomError")

module.exports = class DBClient {
    async connect() {
        throw new CustomError(500, "Falta implementar 'connect' en Sub Clase")
    }

    async disconnect() {
        throw new CustomError(500, "Falta implementar 'connect' en Sub Clase")
    }
}