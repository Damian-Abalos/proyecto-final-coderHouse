const {Router} = require("express")

rutaChat = Router()

rutaChat.get('/chat', (req,res)=> {
    res.render('pages/chat')
})

module.exports = rutaChat