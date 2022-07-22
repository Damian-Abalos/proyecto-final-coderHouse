const config = require ('../../config/config.js')

const ContenedorArchivo = require("../contenedores/ContenedorArchivo")

const ProductosDaoArchivo = new ContenedorArchivo(config.fileSystem.productsPath)

module.exports =  ProductosDaoArchivo