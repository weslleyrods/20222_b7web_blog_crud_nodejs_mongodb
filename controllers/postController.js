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