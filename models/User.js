const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const passportLocalMongoose = require('passport-local-mongoose');


const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
});

//adiciona plugin do passport dentro do model
//o 1º parâmetro é o plugin de integração entre o mongoose e o passport
//o 2º parâmetro específica o campo dentro do model de usuário que é relacionado ao usuário
userSchema.plugin(passportLocalMongoose, { usernameField: 'email'}); 

module.exports = mongoose.model('User', userSchema);