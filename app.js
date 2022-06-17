//Chamada do express
const express = require('express');

//Definição de rotas (caminhos que o usuário irá seguir)
const router = express.Router()
router.get('/', (req, res)=>{
    res.send("Olá mundo")
})

//Configurações
const app = express();
app.use('/', router)

module.exports = app
