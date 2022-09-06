require('dotenv').config()

exports.env = process.env.NODE_ENV;

exports.app = {
    host: 'localhost',
    port: 3000
}

exports.siteDomain = 'http://localhost:4200';

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

//Conditions de verrouillage du compte utilisateur

//Nombre de login(s) autorisés par minutes
exports.loginLimitation = 6;
//Nombre de tentatives de connections autorisées avant verrouillage du compte utilisateur, 0 = pas de limitation du nombre de tentatives.
exports.longinsFailedLimitation = 3;
//Temps de verrouillage de l'accès au compte utilisateur après "longinsFailedLimitation" échec(s) de login(s)
exports.userLockedTimeout = 1 * 60 * 1000;

//Authentification pour l'accès aux images des sauces

exports.authAccessImg = false;