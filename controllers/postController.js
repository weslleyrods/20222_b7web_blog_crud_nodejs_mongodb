const mongoose = require('mongoose')
const Post  = mongoose.model('Post')


exports.add = (req, res)=>{
    res.render('postAdd')
};

exports.addAction = async (req, res)=>{
    //res.json(req.body)
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
    //Procurar o item enviado
    const post = await Post.findOneAndUpdate(
        //Pegar os dados e atualizar
        {slug: req.params.slug}, 
        req.body,
        {
            new: true, //retorna um NOVO post item atualizado
            runValidators: true //garante que as validações sejam cumpridas na edição
        }
    );
    //Mostrar mensagem de sucesso
    req.flash('success', 'Post atualizado com sucesso!');
    //Redirecionar para a home
    res.redirect('/');
};