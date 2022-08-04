//rotas do site principal
const express = require('express');
const passaport = require('passport');
const homeController = require('../controllers/homeController');
const userController = require('../controllers/userController');
const postController = require('../controllers/postController');
const imageMiddleware = require('../middlewares/imageMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');

//Definição de rotas (caminhos que o usuário irá seguir)
const router = express.Router(); 

//router.get('/', homeController.user Middleware, homeController.index); 
router.get('/', homeController.index); 
router.get('/users/login',  userController.login);
router.post('/users/login', userController.loginAction);
router.get('/users/logout', userController.logout);

router.get('/users/register', userController.register);
router.post('/users/register', userController.registerAction);

router.get('/users/forget', userController.forget);
router.post('/users/forget', userController.forgetAction);

router.get('/users/reset/:token', userController.forgetToken);
router.post('/users/reset/:token', userController.forgetTokenAction);

router.get('/profile', authMiddleware.isLogged, userController.profile);
router.post('/profile', authMiddleware.isLogged, userController.profileAction);

router.post('/profile/password', authMiddleware.isLogged, authMiddleware.changePassword);


router.get('/post/add', authMiddleware.isLogged, postController.add);
//Action é uma convenção, que se refere ao recebimento de dados da tela
router.post('/post/add',
    authMiddleware.isLogged,
    imageMiddleware.upload, 
    imageMiddleware.resize,
    postController.addAction
);

router.get('/post/:slug/edit', 
    authMiddleware.isLogged, 
    postController.canEdit,
    postController.edit
);

router.post('/post/:slug/edit', 
    authMiddleware.isLogged,
    postController.canEdit,
    imageMiddleware.upload, 
    imageMiddleware.resize,
    postController.editAction
);

router.get('/post/:slug', postController.view);

router.get('/post/:id/delete', authMiddleware.isLogged, postController.delete);

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