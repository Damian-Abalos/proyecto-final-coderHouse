const ProductosDAOFactory = require("../DAOs/Factory/ProductoDAOFactory.js")
const ProductoDTO = require("../DTOs/ProductoDTO.js")
const logger = require("../loggers/logger")

const DAO = ProductosDAOFactory.get()


async function getById(req, res) {
    try {
        const id = req.params.id
        let prod = await DAO.getById(id)
        if (!prod || prod.length < 1) {
            const err = `Error, no se encontró producto id: ${id}`
            logger.error(err)
            return res.status(400).json({
                error_description: err
            })
        } else {
            const producto = prod.map(prod => {
                return new ProductoDTO(prod.id, prod.title, prod.category, prod.thumbnail, prod.price);
            })
            res.status(200).json(producto[0]);
        }
    } catch (error) {
        logger.warn(`Error al listar un producto: ${error}`)
        return res.status(500).json({
            error_description: 'Server error.'
        });
    }
}

async function getCategory(req, res) {
    try {
        const categoria = req.params.categoria
        let productos = await DAO.getCategory(categoria)
        if (!productos || productos.length < 1) {
            const err = `Error, no hay productos categoria: ${categoria}`
            logger.error(err)
            return res.status(400).json({
                error_description: err
            })
        } else {
            let prdDTOs = productos.map(prod => {
                return new ProductoDTO(prod.id, prod.title, prod.category, prod.thumbnail, prod.price);
            })
            res.status(200).json(prdDTOs)
        }
    } catch (error) {
        logger.warn(`Error al listar un producto: ${error}`)
        return res.status(500).json({
            error_description: 'Server error.'
        });
    }
}

async function getAll(req, res) {
    try {
        let productos = await DAO.getAll()
        if (!productos) {
            const err = `Error, no se encontraron productos.`
            logger.error(err)
            return res.status(400).json({
                error_description: err
            })
        } else {
            let prdDTOs = productos.map(prod => {
                return new ProductoDTO(prod.id, prod.title, prod.category, prod.thumbnail, prod.price);
            })
            res.status(200).json(prdDTOs)
        }
    } catch (error) {
        logger.warn(`Error al listar todos los productos: ${error}`)
        return res.status(500).json({
            error_description: 'Server error.'
        });
    }
}

async function save(req, res) {
    try {
        const nuevoProducto = req.body
        const id = await DAO.save(nuevoProducto);
        const info = `Producto creado con éxito, id: ${id._id}`
        logger.info(info)
        return res.status(201).json({
            message: info
        });
    } catch (error) {
        logger.error(`Error al guardar: ${error}`)
        return res.status(500).json({
            error_description: 'Server error.'
        });
    }
}

async function update(req, res) {
    try {
        const id = req.params.id
        const producto = req.body
        await DAO.update(id, producto);
        const info = `Producto actualizado con éxito, id: ${id}`
        logger.info(info)
        return res.status(201).json({
            message: info
        });
    } catch (error) {
        logger.warn(`Error al actualizar: ${error}`)
        return res.status(500).json({
            error_description: 'Server error.'
        });
    }
}

async function deleteById(req, res) {
    try {
        const producto = await DAO.delete(req.params.id)
        if (!producto || producto.deletedCount === 0) {
            const err = `Error, no se encuentra producto id: ${req.params.id}`
            logger.error(err)
            return res.status(404).json({
                error_description: err
            });
        }
        res.status(200).json({
            message: 'Producto borrado.'
        });
    } catch (error) {
        logger.error(`Error al borrar: ${error}`)
        return res.status(500).json({
            error_description: 'Server error.'
        });
    }
}

async function deleteAll() {
    try {
        const producto = await DAO.borrarTodos()
        if (!producto) {
            const err = `Error al Borrar todos los productos.`
            logger.error(err)
            return res.status(404).json({
                error_description: err
            });
        }
        res.status(200).json({
            message: 'Todos los productos borrados.'
        });
    } catch (error) {
        logger.warn(`Error al Borrar todos los productos: ${error}`)
        return res.status(500).json({
            error_description: 'Server error.'
        });
    }

}

module.exports = {
    getById,
    getCategory,
    getAll,
    save,
    update,
    deleteById,
    deleteAll
}