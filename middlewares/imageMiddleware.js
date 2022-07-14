const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

//criação dos middleware
const multerOptions = {
    storage:multer.memoryStorage(), //função do multer que salva o arquivo na memória, para processá-la depois
    fileFilter:(req, file, next)=>{
        //configuração dos memetypes permetidos, para segurança do sistema
        const allowed = ['image/jpeg', 'image/jpg', 'image/png'];
        if(allowed.includes(file.mimetype)){
            //next - 1º parâmetro identifica se houve erro
            //next - 2º parâmetro valida se houve sucesso na validação
            next(null, true);
        }else{
            next({message:'Arquivo não suportado'}, false);
        }
    }
};

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next)=>{
    if(!req.file){
        next();
        return;
    }

    const ext = req.file.mimetype.split('/')[1];
    //uuid.v4 - função que cria o hash code de cada arquivo uploaded
    let filename = `${uuid.v4()}.${ext}`;
    req.body.photo = filename;

    //redimencionamento da imagem
    const photo = await jimp.read(req.file.buffer); //faz a leitura da imagem que foi salva na memória
    await photo.resize(800, jimp.AUTO); //configuração da dimensão da imagem
    await photo.write(`./public/media/${filename}`); //salva na pasta de media o projeto
    next();
};
