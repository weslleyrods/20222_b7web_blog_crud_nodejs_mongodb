const nodemailer = require('nodemailer'); 

//O 1º parâmetroo do create transport, são config do serviço de SMTP
//O 2º parâmetro do create transport, serve para config padrão do envio de email
const transporter = nodemailer.createTransport({
    //configurações de conexão do servidor SMTP
    host:process.env.SMTP_HOST,
    port:process.env.SMTP_PORT,
    auth:{
        user:process.env.SMTP_USER,
        pass:process.env.SMTP_PASS,
    }

},{
    from:`${process.env.SMTP_NAME} <${process.env.SMTP_EMAIL}>`
});

exports.send = async (options)=>{
    await transporter.sendMail(options);

};