const mongoose = require('mongoose')
const Post = mongoose.model('Post')

exports.add = (req, res)=>{
    res.render('postAdd')
};

exports.addAction = async (req, res)=>{
    //res.json(req.body)
    const post = new Post(req.body);
    await post.save();
    res.redirect('/');
};