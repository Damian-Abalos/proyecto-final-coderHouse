const config = require ('../../config/config.js')

const ContenedorArchivo = require ("../contenedores/ContenedorArchivo")

const CarritosDaoArchivo = new ContenedorArchivo(config.fileSystem.carritosPath)

module.exports = CarritosDaoArchivo