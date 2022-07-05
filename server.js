require('dotenv').config({path:'.env'})
//require('dotenv').config
const mongoose = require('mongoose')

const {
    MONGODB_USER,
    MONGODB_PASSWORD,
    MONGODB_HOST,
    MONGODB_CLUSTER,
    MONGODB_DATABASE,
} = process.env

//Conexão com o banco de dados
mongoose.connect(`mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_CLUSTER}.${MONGODB_HOST}.mongodb.net/${MONGODB_DATABASE}?retryWrites=true&w=majority`) 
//Permite o mongoose usar ECS6 (promises, async/await e etc...) dentro das conexões do banco de dados
mongoose.Promise = global.Promise
mongoose.connection.on('error', (error)=>{
    console.error("ERRO: "+error.message )
})

//Carregando todos os models
require('./models/Post');

const app = require('./app')

app.set('port', process.env.PORT || 3000);
const server = app.listen(app.get('port'), ()=>{
    console.log("Servidor rodando na porta: "+server.address().port);
}); 