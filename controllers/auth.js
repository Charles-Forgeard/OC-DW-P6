const Users = require('../models/Users');
//const bcrypt = require('bcrypt');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const generator = require('generate-password');
const config = require('../config')
const lockedTimeout = 1 * 60 * 1000;

exports.mdpToken = generator.generate({
    length: 60,
    numbers: true,
    symbols: true
});

exports.postSignup = (req, res, next) => {

    argon2.hash(req.body.password, {
        type: argon2.argon2i,
        memoryCost: 2 ** 16,
        hashLength: 50,
        timecost: 10,
        parallelism: 4
    })
        .then( hash => {
                delete req.body._id;
                req.body.email = jwt.sign(
                    `${req.body.email}`,
                    config.crypt.emailInBD
                    //no expiration time
                )
                const user = new Users({
                    email: req.body.email,
                    password: hash
                });
                user.save()
                    .then(() => res.status(201).json({message: "Nouvel utilisateur ajouté"}))
                    .catch(err => res.status(400).json({err})) 
            }
        )
        .catch(err => res.status(500).json({err}));

}

exports.postLogin = (req, res, next) => {

    req.body.cryptEmail = jwt.sign(
        `${req.body.email}`,
        config.crypt.emailInBD
    )
    Users.findOne({email: req.body.cryptEmail})
    .then(user => {
        switch(true){
            case user === null:
                console.log("utilisateur n'existe pas en BD")
                res.status(401).json({message: 'Identifiant et/ou mot de passe incorrecte'})
                break;
            case user.locked > Date.now() - lockedTimeout:
                console.log("Compte bloqué")
                res.status(401).json({message: 'proposition réinitialisation mdp par email'})
                break;
            case user.locked > 3 && auth.locked < Date.now() - lockedTimeout:
                console.log("Compte débloqué")
                user.lock = 0;
            default:
                console.log("vérification mot de passe")
                argon2.verify(user.password, req.body.password)
                .then(valid => {
                    if(!valid){
                        user.locked = user.locked === 2 ? Date.now() : ++user.locked;
                        switch(user.locked){
                            case 1:
                                console.log("1 erreur")
                                break;
                            case 2:
                                console.log("2 erreurs")
                                break;
                            default:
                                console.log("3 erreurs")
                                console.log("bloquage du compte")
                        }
                        user.save();
                        res.status(401).json({message: 'Identifiant et/ou mot de passe incorrecte'});
                    }else{
                        console.log("autentification réussie");
                        if(user.locked > 0){
                            user.locked = 0;
                            user.save();
                        }
                        res.status(200).json({
                            userId: user._id,
                            token: jwt.sign(
                                {userId: user._id},
                                this.mdpToken,
                                {expiresIn: '2h'}
                            )
                        })
                    }
                })
                .catch(err => res.status(500).json({err}))
        }
    })
    .catch(err => {
        res.status(500).json({err});
    })
}