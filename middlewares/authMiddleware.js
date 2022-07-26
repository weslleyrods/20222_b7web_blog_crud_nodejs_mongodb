exports.isLogged = (req, res, next)=>{
    //pode ser utilizado req.user como parâmetro também
    if(!req.isAuthenticated()){
        req.flash('error', 'Ops! Você não possui permissão para acessar a página.');
        res.redirect('/users/login');
        return;
    }
    next();
};

exports.changePassword = (req, res)=>{

    if(req.body.password != req.body['password-confirm']){
        req.flash('error', 'As senhas não coincidem');
        res.redirect('/profile');
        return;
    }
    //setPassword, função do passport e que não suporta promises
    //1º parâmetro recebe a nova senha
    //2º parâmetro o retorno do processo de salvamento da senha
    req.user.setPassword(req.body.password, async ()=>{
        await req.user.save();
        req.flash('success', 'A senha foi alterada com sucesso!');
        res.redirect('/');
    });
};