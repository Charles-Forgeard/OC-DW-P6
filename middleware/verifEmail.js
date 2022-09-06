const fetch = require('node-fetch');
const config = require('../config');

module.exports = (req, res, next) => {
    const key = config.abstractAPIKey;
    if(key !== 'undefined'){
        fetch(`https://emailvalidation.abstractapi.com/v1/?api_key=${key}&email=${req.body.email}`).then(res => res.json()).then(
            emailValidationReport => {
                if(config.forbidenEmailDomains.indexOf(emailValidationReport.email.split('.').slice(0, -1).join('.').split('@').pop()) != -1){
                    emailValidationReport.is_in_orbidenEmailDomain_list = true;
                }else{
                    emailValidationReport.is_in_orbidenEmailDomain_list = false;
                }
                if(emailValidationReport.error){
                    console.log('==========')
                    console.log("abstract API:")
                    console.log(emailValidationReport)
                    console.log('==========')
                    res.status(500).json(emailValidationReport)
                }else{
                    if( 
                        emailValidationReport.is_in_orbidenEmailDomain_list === false &&
                        emailValidationReport.deliverability === "DELIVERABLE" && 
                        emailValidationReport.is_valid_format.value === true &&
                        emailValidationReport.is_disposable_email.value === false && 
                        emailValidationReport.is_mx_found.value === true && 
                        emailValidationReport.is_smtp_valid.value === true
                    ){
                        next();
                    }else{
                        console.log('==========')
                        console.log("email rejeté par l'abstract API:")
                        console.log(emailValidationReport)
                        console.log('==========')
                        res.status(401).json(emailValidationReport)
                    }
                }
                
        } 
        ).catch(err => {
            console.log(err)
            res.status(500).json({message: err})
        })
    }else{
        console.log("pas d'utilisation d'abstractAPI")
        next()
    }
}