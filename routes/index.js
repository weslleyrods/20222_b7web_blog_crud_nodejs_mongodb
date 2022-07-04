
//rotas do site principal
const express = require('express');

//Definição de rotas (caminhos que o usuário irá seguir)
const router = express.Router()

router.get('/', (req, res)=>{
    ///1º parametro - nome do arquivo que irá redenrizar na pastas views
    let obj = {
    pageTitle: 'Titulo de teste',
    'nome':req.query.nome,
    'idade': req.query.idade,
    mostrar: true,
    ingredientes: [
        {nome: 'Arroz', qtd: '20g'},
        {nome: 'Feijão', qtd: '10g'}
    ],
    interesses: ['node', 'js', 'css'],
    // teste: '<strong>Testando negrito</strong>'
    }
    res.render('home', obj); 
})

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