const rateLimit = require('express-rate-limit');

exports.appRequest = rateLimit({
    windowsMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: false,
    legacyHeaders: false
})

exports.loginRequest = rateLimit({
    windowsMs: 2 * 60 * 1000,
    max: 5,
    message: () =>{
        console.log('Logins too frequent')
        return 'Logins too frequent'
    },
    standardHeaders: false,
    legacyHeaders: false
})