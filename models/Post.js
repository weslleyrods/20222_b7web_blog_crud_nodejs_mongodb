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
    tags: [String],
    author: mongoose.Schema.Types.ObjectId, //para a V1 do aggregate do vinculo de post com o usuario
    // author:{ //V2 para o vinculo de post com o usuario, usando populate
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref:'User'
    // }

});

postSchema.pre('save', async function(next){

    if(this.isModified('title')){
        this.slug = slug(this.title, {lower:true});

        const slugRegex = new RegExp(`^(${this.slug})((-[0-9]{1,}$)?)$`, 'i');
        const postsWithSlug = await this.constructor.find({slug: slugRegex});

        if(postsWithSlug.length > 0){
            this.slug = `${this.slug}-${postsWithSlug.length+1}`;
        }
    }
    next();
});

//função estática para criar a listagem de tags
postSchema.statics.getTagsList = function(){
    return this.aggregate([
        //$tags acessa o campo de tags
        {$unwind: '$tags'},
        //$group agrupa somente as tags
        //_id é nome escolhido para o valor de tags, esse nome é usado na home para impressão das tags com o mustache
        //$sum faz a contagem de repetição de cada tag
        {$group:{_id:'$tags', count:{$sum:1}}},
        //$sort ordena as tags, 1 para crescente e -1 para decrescente
        {$sort: {count: -1}}
    ]);
};

postSchema.statics.findPosts = function(filters={}){
    //V2
        //substitui o lookup do aggregate para vinculo de post com usuario
    //return this.find(filters).populate('author');
    
    //v1
    
    //aggregate permite manipular dados de uma coleção com uma sequencia de manipulações
    return this.aggregate([
        //match faz a filtragem dos documentos que atenda a especificação, no caso, o filtro que o usuario passou
        {$match: filters},
        //lookup faz um join entre partes diferentes partes do db
        {$lookup: {
            from: 'users', //acessa a coleção de users do db
            let:{'author':'$author'}, //pega o valor de author (de Post) e atribui a variavel author
            pipeline:[
                //$ o mongodb entende como o campo da consulta
                //$$ o mongodb entende como o campo criado para o lookup
                {$match: {$expr: {$eq:['$$author', '$_id']}} } ,
                {$limit:1}
            ],
            as: 'author', //salva no campo author dessa requisição, para substituir por outro campo author da home
        }},
        //addFields permite adicionar novos campos na saida do documento
        //nesse caso, foi utilizado para reescrever a própria variavel author,
        //para venha o elemento específico do array de author que foi gerado do lookup.
        {$addFields:{
            'author': {$arrayElemAt:['$author',0]}
        }}
    ]); 
    
}

module.exports = mongoose.model('Post', postSchema);