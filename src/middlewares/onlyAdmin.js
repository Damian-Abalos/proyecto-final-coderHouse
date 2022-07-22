require('dotenv').config()

const isAdmin = process.env.ADMINISTRADOR == 'true' ? true : false

const onlyAdmin = (req, res, next) => {
    if (!isAdmin)
    res.send({
        error: -1,
        descripcion: `ruta '${req.url}' método ${req.method}, no autorizada`,
    });
    else next()
}

module.exports = onlyAdmin