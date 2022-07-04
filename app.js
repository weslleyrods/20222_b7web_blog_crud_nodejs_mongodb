//Chamada do express
const express = require('express');
//chamada das rotas somente do usuário
const router = require('./routes/index');
const mustache = require('mustache-express');
const helpers = require ('./helpers')
const app = express();

app.use((req, res, next)=>{
    res.locals.h = helpers;
    next();
});

//Configurações
app.use('/', router);
app.use(express.json());

app.engine('mst', mustache(__dirname+'/views/partials', '.mst'));//especifica o motor visual
app.set('view engine', 'mst');
app.set('views', __dirname+'/views'); //configura caminho absoluto da pasta views


module.exports = app 