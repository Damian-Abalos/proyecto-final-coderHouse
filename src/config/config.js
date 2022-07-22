module.exports = {
    PORT: process.env.PORT || 8080,
    mongoLocal: {
        client: 'mongodb',
        cnxStr: 'mongodb://localhost:27017/ecommerce'
    },
    firebase:{
        serviceAccount: '../DB/basefirebase-a035b-firebase-adminsdk-8uw8n-2507f5c523.json'
    },
    mongoRemote: {
        client: 'mongodb',
        cnxStr: ''  
    },
    fileSystem: {
        productsPath: '../DB/productos.txt',
        carritosPath: '../DB/carritos.txt'
    },
    srv: {
        persistencia: process.env.PERSISTENCIA
    },
    administrador: true
}
