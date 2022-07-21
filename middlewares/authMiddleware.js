module.exports.isLogged = (req, res, next)=>{
    //pode ser utilizado req.user como parâmetro também
    if(!req.isAuthenticated()){
        req.flash('error', 'Ops! Você não possui permissão para acessar a página.');
        res.redirect('/users/login');
        return;
    }
    next();
};