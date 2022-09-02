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

exports.abstractAPIKey = process.env.ABSTRACTAPI_KEY;

exports.storeIMG = process.env.STORE_IMG;