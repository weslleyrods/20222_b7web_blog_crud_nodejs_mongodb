const mongoose = require('mongoose')
const Post  = mongoose.model('Post')


exports.index = async (req, res)=>{
    ///1º parametro - nome do arquivo que irá redenrizar na pastas views
    let responseJson = {
    pageTitle: 'HOME',
    posts:[],
    tags:[], 
    tag: '',
    };

    console.log(req.user);

    //pega da query(url) a tag selecionada
    responseJson.tag = req.query.t;
    //if ternario p/ satisfazer a filtragem do post quando houver ou não uma tag selecionada
    const postFilter = (typeof responseJson.tag != 'undefined') ? { tags: responseJson.tag }: {};
    //console.log(typeof postFilter);

    //Para receber a listagem de tags do homeController, separando o post da tag
    const tagsPromise = Post.getTagsList(); //lista de tags
    //const postsPromise = Post.findPosts(postFilter); //lista de posts com base no filtro do usuario(tag clicada)
    const postsPromise = Post.find(postFilter).populate('author');//substitui o lookup no aggregate do vincuclo de post com usuario

    //grupo de promises - melhora o desempenho, permetindo que um resultado não dependa do outro
    //sendo chamadado-os ao mesmo tempo como promise.
    const [tags, posts] = await Promise.all([tagsPromise, postsPromise]);   
    //outra forma 
    /*  const tags = result[0];
    const posts = result[1]; */

    console.log(posts[0]);

    for(let i in tags){
        if(tags[i]._id == responseJson.tag){
            tags[i].class = "selected"
        }
    }    
    //incorpora no array de tags
    responseJson.tags = tags;
    //console.log(tags); 

    responseJson.posts = posts
    res.render('home', responseJson); 
};



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