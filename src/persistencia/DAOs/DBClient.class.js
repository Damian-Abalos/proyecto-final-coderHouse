const CustomError = require("./CustomError.class")

module.exports = class DBClient {
    async connect() {
        throw new CustomError(500, "Falta implementar 'connect' en Sub Clase")
    }

    async disconnect() {
        throw new CustomError(500, "Falta implementar 'connect' en Sub Clase")
    }
}