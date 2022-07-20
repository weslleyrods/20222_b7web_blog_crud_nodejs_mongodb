const User = require('../models/User');

exports.login = (req, res)=>{
    res.render('login')
};

exports.loginAction = (req, res)=>{
    const auth = User.authenticate();

    auth(req.body.email, req.body.password, (error, result)=>{
        if(!result){
            req.flash('error', 'E-mail e/ou senha incorretos .');
            res.redirect('/users/login');
            return;
        }

        //realiza o login de fato, o 2º parâmetro verifica se houve erro, mas já está sendo feita a vericação
        //por isso, foi utilizado uma função vazia
        //req.login(result, ()=>{});  

        req.flash('success', 'Login realizado com sucesso!');
        res.redirect('/');
    });
}; 

exports.register = (req, res)=>{
    res.render('register');
};

exports.registerAction = (req, res)=>{
    //res.json(req.body);

    //register() método de registro do passport
    const newUser = new User(req.body);
    User.register( newUser, req.body.password, (error)=>{
        if(error){
            //console.log('Erro ao registrar: ', error);
            //res.redirect('/');
            req.flash('error', 'Ocorreu um erro, tente mais tarde.')
            res.redirect('/users/register');
            return;
        }
        req.flash('success', 'Registro efetuado com sucesso. Faça o login.')
        res.redirect('/users/login');
        //res.redirect('/')
    });
};