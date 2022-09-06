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

exports.abstractAPIKey = process.env.ABSTRACTAPI_KEY;
exports.forbidenEmailDomains = ["vpsrec"]

//Storage image
//Set value to server (to strore in image folder) or mongoDB (to store on mongoDB ATLAS)

exports.storeIMG = 'mongoDB';

//Authentification pour l'accès aux images des sauces

exports.authAccessImg = false;