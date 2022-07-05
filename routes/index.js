
//rotas do site principal
const express = require('express');
const homeController = require('../controllers/homeController')
const userController = require('../controllers/userController')
const postController = require('../controllers/postController')

//Definição de rotas (caminhos que o usuário irá seguir)
const router = express.Router()

router.get('/', homeController.userMiddleware, homeController.index); 
router.get('/user/login', userController.login)
router.get('/post/add', postController.add)
router.post('/post/add', postController.addAction) //Action é uma convenção, que se refere ao recebimento de dados da tela


/* router.get('/', (req, res)=>{ 
    //let nome = req.query.nome;
    //let sobrenome = req.query.sobrenome;
    //let idade = req.query.idade;
    //res.send(`Olá, ${nome}! Você tem ${idade} anos`);

    // res.json({
    //     nome: nome, 
    //     sobrenome: sobrenome
    // })


    // req.json(
    //     req.query //req.query para GET req.body para POST e req.params para parâmetros da URL
    // )
})

router.get('/posts/:id/:slug', (req, res)=>{
    let id = req.params.id;
    let slug = req.params.slug;
    //Titulo: seja bem vindo
    //Slug: seja-bem-vindo
    res.send(`ID do post: ${id} - Slug do post: ${slug}`);
})

router.get('/sobre', (req, res)=>{
    res.send('Página Sobre');
}) */

module.exports = router;