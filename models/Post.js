const mongoose = require('mongoose');
//cria a comunicação entre o mongodb e a aplicação, passando a promise do próprio navegador
mongoose.Promise  = global.Promise; 

const postSchema = new mongoose.Schema({
    title:{
        type:String,
        trim:true, //trim remove espaço inicial e final de texto
        required: "É necessário ter título", 
    },
    slug:String,
    body:{
        type:String,
        trim: true,
    },
    tags: [String]
});

module.exports = mongoose.model('Post', postSchema);