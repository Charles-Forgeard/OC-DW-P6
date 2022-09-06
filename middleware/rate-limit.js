const rateLimit = require('express-rate-limit');
const config = require('../config');

exports.appRequest = rateLimit({
    windowsMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: false,
    legacyHeaders: false
})

exports.loginRequest = rateLimit({
    windowsMs: 1 * 60 * 1000,
    max: config.loginLimitation,
    message: () =>{
        console.log('Logins too frequent')
        return 'Logins too frequent'
    },
    standardHeaders: false,
    legacyHeaders: false
})