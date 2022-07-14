const slug = require('slug');
const mongoose = require('mongoose');
//cria a comunicação entre o mongodb e a aplicação, passando a promise do próprio navegador
mongoose.Promise  = global.Promise; 

const postSchema = new mongoose.Schema({
    photo: String, 
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

postSchema.pre('save',function(next){
    if(this.isModified('title')){
        this.slug = slug(this.title, {lower:true});
    }
    next();
});

module.exports = mongoose.model('Post', postSchema);