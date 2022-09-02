const fetch = require('node-fetch');
const config = require('../config');

module.exports = (req, res, next) => {
    const key = config.abstractAPIKey;
    if(key !== 'undefined'){
        console.log("utilisation d'abstractAPI")
        fetch(`https://emailvalidation.abstractapi.com/v1/?api_key=${key}&email=${req.body.email}`).then(res => res.json()).then(
            emailValidationReport => {
                if(
                    emailValidationReport.deliverability === "DELIVERABLE" && 
                    emailValidationReport.is_valid_format.value === true && 
                    emailValidationReport.is_mx_found.value === true && 
                    emailValidationReport.is_smtp_valid.value === true
                ){
                    next();
                }else{
                    console.log(emailValidationReport)
                    res.status(401).json(emailValidationReport)
                }
        } 
        ).catch(err => {
            console.log(err)
            res.status(401).json({err})
        })
    }else{
        console.log("pas d'utilisation d'abstractAPI")
        next()
    }
}