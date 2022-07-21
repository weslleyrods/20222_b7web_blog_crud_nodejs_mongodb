//Chamada do express
const express = require('express');
const mongoose = require('mongoose'); 
//chamada das rotas somente do usuário
const mustache = require('mustache-express');

const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');

const router = require('./routes/index');
const helpers = require ('./helpers');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


const app = express();
const errorHandler = require('./handlers/errorHandler');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static(__dirname+'/public'))

app.use(cookieParser(process.env.SECRET));
app.use(session({
    secret: process.env.SECRET,
    resave: false, //se a sessão nao for alterada, diz para a sessão que não precisa ser destruida e recriada a cada req
    saveUninitialized: false, //não salva a sessão se não houver dados para serem salvos
}));
app.use(flash());
const User = require('./models/User');

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next)=>{
    //o operador spread passa os valores de helpers para o h, e não o helpers em si
    //para que após login, as demais opções do menus para guest não sejam excluídas após logout
    res.locals.h = {...helpers};
    res.locals.flashes = req.flash();
    res.locals.user = req.user;

    if(req.isAuthenticated()){
        //filtrar menu para guest ou logged
        res.locals.h.menu = res.locals.h.menu.filter(i=>i.logged);
    }else{
        //filtrar menu para guest
        res.locals.h.menu = res.locals.h.menu.filter(i=>i.guest);
    }

    next();
});

//configurações relacionadas ao passport 
passport.use(new LocalStrategy(User.authenticate())); 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Configurações
app.use('/', router);

app.use(errorHandler.notFound)

app.engine('mst', mustache(__dirname+'/views/partials', '.mst'));//especifica o motor visual
app.set('view engine', 'mst');
app.set('views', __dirname+'/views'); //configura caminho absoluto da pasta views

module.exports = app 