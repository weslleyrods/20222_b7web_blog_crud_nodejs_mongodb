const mongoose = require('mongoose');
const { post } = require('../routes');
const Post  = mongoose.model('Post')

exports.view =  async(req, res)=>{
    const post = await Post.findOne({slug: req.params.slug})
    res.render('view', {post});
}

exports.add = (req, res)=>{
    res.render('postAdd')
}; 

exports.addAction = async (req, res)=>{

    //res.json(req.body) 
    req.body.tags = req.body.tags.split(',').map(tag=>tag.trim());
    const post = new Post(req.body);

    try{
        await post.save();   
    }catch(error){
        req.flash('error', 'Erro: '+error.message);
        return res.redirect('/post/add')    
    }
    req.flash('success', 'Post salvo com sucesso!');
    res.redirect('/');
}; 

exports.edit = async (req, res)=>{
    //1º pegar as informações do post
    const post = await Post.findOne({slug: req.params.slug})
    //2º carregar o form de edição
    res.render('postEdit', {post})
}

exports.editAction = async (req, res)=>{
    req.body.tags = req.body.tags.split(',').map(tag=>tag.trim());
    req.body.slug = require('slug')(req.body.title, {lower:true});
    //Procurar o item enviado
    try{
        const post = await Post.findOneAndUpdate(
            //Pegar os dados e atualizar
            {slug: req.params.slug}, 
            req.body,
            {
                new: true, //retorna um NOVO post item atualizado
                runValidators: true //garante que as validações sejam cumpridas na edição
            }
            );
        }catch(error){
            req.flash('error', 'Ocorr eu um erro! Tente novamente mais tarde')
            return res.redirect('/post/'+req.params.slug+'/edit')
        }
    //Mostrar mensagem de sucesso
    req.flash('success', 'Post atualizado com sucesso!');
    //Redirecionar para a home
    res.redirect('/');
};