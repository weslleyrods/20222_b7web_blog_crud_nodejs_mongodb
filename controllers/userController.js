const User = require('../models/User');
const crypto = require('crypto'); //crypto é uma biblioteca própria do Node para gerar o Token
const mailHandler = require('../handlers/mailHandler');

exports.login = (req, res)=>{
    res.render('login')
};

exports.loginAction = (req, res)=>{
    const auth = User.authenticate();

    auth(req.body.email, req.body.password, (error, result)=>{
        //realiza o login de fato, o 2º parâmetro verifica se houve erro, mas já está sendo feita a vericação
        //por isso, foi utilizado uma função vazia
        req.login(result, function(error) {
            if (error){
                req.flash('error', 'Seu e-mail e/ou senha estão errados!');
                res.redirect('/users/login');
                return;
            };
            req.flash('success', 'Login realizado com sucesso!');
            res.redirect('/');
            return;
        });
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
            /* console.log('Erro ao registrar: ', error);
            res.redirect('/'); */
            req.flash('error', 'Ocorreu um erro, tente mais tarde.')
            res.redirect('/users/register');
            return;
        }
        req.flash('success', 'Registro efetuado com sucesso. Faça o login.')
        res.redirect('/users/login');
        //res.redirect('/')
    });
};

    exports.logout = (req, res, next)=>{
    req.logout(function(err) {
        if (err) { return next(err); };
    res.redirect('/');
    });
};

exports.profile = (req, res)=>{
    res.render('profile')
};

exports.profileAction = async (req,res)=>{

    try{
        const user = await User.findOneAndUpdate(
            {_id: req.user._id},
            //não optado em utilizar o body, porque o objetivo era alterar especificamente o nome e email,
            //não o hash e etc...
            {name: req.body.name, email:req.body.email},
            {new: true, runValidators: true}
        );
    }catch(e){
        req.flash('error', 'Ocorreu algum erro.' + e.message);
        res.redirect('/profile');
        return;
    }
    req.flash('success', 'Dados atualizados com sucesso!');
    res.redirect('/profile');
};

exports.forget = (req, res)=>{
    res.render('forget')
};

exports.forgetAction = async (req, res)=>{
    const mailMessage = `Caso exista uma conta com o e-mail que você digitou, vamos enviar um e-mail com as instruções e o link para você trocar a senha. Se você não receber o e-mail em alguns minutos, verifique a sua caixa de spam ou tente novamente.`
    //1 - verifica se o usuario existe
    const user = await User.findOne({email:req.body.email}).exec();
    if(!user){
        req.flash('error', `${mailMessage}`);
        res.redirect('/users/forget');
        return;
    }
    //2 - gera um token com data de expiração e salva no bd
        //crypto é uma biblioteca própria do Node para gerar Token
    user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordExpires = Date.now()+3600000; //configura o tempo de expiração - optado por data atual + 1 hora
    await user.save();

    //3 - gera o link com tolken para troca de senha
    const resetLink = `http://${req.headers.host}/users/reset/${user.resetPasswordToken}`;

    //4 - envia o link via email para o usuario
    const html = `Testendo e-mail com link:<br/><a href="${resetLink}">Resetar a sua senha</a>`;
    const text = `Testando e-mail com libk: ${resetLink}`;
    const to = `${user.name} <${user.email}>`

    mailHandler.send({
        to,
        subject:'Solicitação de alteração de senha',
        html,
        text,
    });

    //5 - usuario vai acessa o link para trocar a senha
    req.flash('success', `${mailMessage}`);
    res.redirect('/users/login');

};

exports.forgetToken = async (req, res)=>{
    //verifica se o Token existe e se ainda está válido
    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {$gt: Date.now()}
    }).exec();

    if(!user){
        req.flash('error', 'Token expirado!');
        res.redirect('/users/forget');
        return;
    }
    res.render('forgetPassword');
};

exports.forgetTokenAction = async (req,res)=>{
    //verifica se o Token existe e se ainda está válido
    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {$gt: Date.now()}
    }).exec();
    
    if(!user){
        req.flash('error', 'Token expirado!');
        res.redirect('/users/forget');
        return;
    }
    
    if(req.body.password != req.body['password-confirm']){
        req.flash('error', 'As senhas não coincidem');
        res.redirect('back');
        return;
    }
    //diferente de authMiddleware, não será usado req.user para trocar a senha
    //pois o mesmo não se encontrará logado na tela de nova senha via recuperação de senha
    //sendo assim, usa-se o usuário que está sendo acessado do bd (user) pela rota de recuperação de senha
    user.setPassword(req.body.password, async ()=>{
        await user.save();
        req.flash('success', 'A senha foi alterada com sucesso!');
        res.redirect('/');
    });
};