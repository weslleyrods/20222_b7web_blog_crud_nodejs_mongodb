const mongoose = require('mongoose')
const Post  = mongoose.model('Post')

exports.index = async (req, res)=>{
    ///1º parametro - nome do arquivo que irá redenrizar na pastas views
    let responseJson = {
    pageTitle: 'HOME',
    posts:[]
    };

    const posts  = await Post.find();
    responseJson.posts = posts
    res.render('home', responseJson); 
}



// exports.userMiddleware = (req, res, next)=>{

//     let info = {name: 'Weslley', id: 123};
//     req.userInfo = info;
//     next(); 
// };

// exports.index = (req, res)=>{
//     ///1º parametro - nome do arquivo que irá redenrizar na pastas views
//     let obj = {
//     pageTitle: 'Titulo de teste',
//     userInfo: req.userInfo,

//     'nome':req.query.nome,
//     'idade': req.query.idade,
//     mostrar: true,
//     ingredientes: [
//         {nome: 'Arroz', qtd: '20g'}, 
//         {nome: 'Feijão', qtd: '10g'}
//     ],
//     interesses: ['node', 'js', 'css'],
//     // teste: '<strong>Testando negrito</strong>'
//     }
//     res.render('home', obj); 
// }