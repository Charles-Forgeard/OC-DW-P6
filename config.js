require('dotenv').config()

exports.env = process.env.NODE_ENV;

exports.app = {
    host: process.env.HOST,
    port: process.env.PORT
}

exports.mongoDB = {
    name: process.env.MONGODB_NAME,
    username: process.env.MONGODB_USERNAME,
    password: process.env.MONGODB_PASSWORD
}

exports.crypt = {
    emailInBD: process.env.CRYPT_EMAIL
}

//Filtres emails utilisateurs en base de donnée

//Clé de l'API abstract => https://www.abstractapi.com/
exports.abstractAPIKey = process.env.ABSTRACTAPI_KEY;
//Liste de domaines d'email temporaires à interdire lors de l'enregistrement utilisateur.
exports.forbidenEmailDomains = ["vpsrec","boxomail","cool.fr","jetable.fr","courriel.fr","moncourrier.fr","monemail.fr","@monmail.fr","hide.biz","mymail.infos","trashmail"];

//Storage image
//Set value to server (to strore in image folder) or mongoDB (to store on mongoDB ATLAS)

exports.storeIMG = 'mongoDB';

//Authentification pour l'accès aux images des sauces

exports.authAccessImg = false;