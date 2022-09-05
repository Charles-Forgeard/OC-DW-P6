const Sauces = require('../models/Sauces');
const Images = require('../models/Images');
const fs = require('fs');
const config = require('../config');
const { findSourceMap } = require('module');
const { ifError } = require('assert');

function deleteAllFilesNamed(fileNameToDeleteWithoutExtension, folderRelativePath){
    if(config.storeIMG === 'server'){
        fs.readdir(__dirname + folderRelativePath, (err, files) => {
            if(err){
                console.log(err);
            }else{
                files.forEach(fileName => {
                        if(fileName.split('.').slice(0,-1).join('') === fileNameToDeleteWithoutExtension){
                            fs.unlink(`images/${fileName}`, (err) => {
                                if(err) console.log(err);
                            })
                        }
                    }
                )
            }

        })
    }else if(config.storeIMG === 'mongoDB'){
        const regex = new RegExp(`^${fileNameToDeleteWithoutExtension}`)
        Images.deleteMany({ name: regex}).then(result => {
            if(result === 0){
                console.log('aucune image supprimée')
            }
        });
    }else{
        console.log('valeur storeIMG invalide. Valeurs acceptée = mongoDB || server')
        res.status(500)
    }
}

exports.getAllSauces = (req, res, next) => {
    Sauces.find()
        .then(sauces => {
            res.status(200).json(sauces)
        })
        .catch(err => res.status(400).json({err}));
}

exports.getOneSauce = (req, res, next) => {
    Sauces.findOne({_id: req.params.id})
        .then(sauce => {
            if(sauce === null){
                res.status(404).json({message: "La sauce demandée n'est pas présente en db"})
            }else{
                res.status(200).json(sauce)
            }
        })
        .catch(err => res.status(400).json({err}))
}

exports.addSauces = (req, res, next) => {
    const bodySauce = JSON.parse(req.body.sauce)
    delete bodySauce._id;
    delete bodySauce._userId;
    const sauce = new Sauces({
        ...bodySauce,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    })
    sauce.save()
        .then(
            () => res.status(201).json({message: "Nouvelle sauce ajoutée"})
        )
        .catch(
            err => res.status(400).json({err})
        )
}

exports.updateSauce = (req, res, next) => {
    const hasImage = req.file ? true : false;
    const bodySauce = hasImage ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {
        ...req.body
    }
    bodySauce.userId = req.auth.userId;
    Sauces.findOne({_id: req.params.id})
        .then((sauce) => {
            if(sauce.userId != bodySauce.userId){
                console.log("sauce n'appartient pas à l'utilisateur")
                res.status(401).json({message: "Modification non autorisée"})
            }else{
                Sauces.findOneAndUpdate({_id: sauce._id}, bodySauce)
                .then(lastSauce => {
                    if(hasImage){
                        console.log('4' + res.headersSent)
                        const imgFileName = lastSauce.imageUrl.replace(`${req.protocol}://${req.get('host')}/images/`, '').split('.').slice(0,-1).join('');
                        deleteAllFilesNamed(imgFileName, '/../images/');
                    }
                })
                .then(()=> {
                    res.status(200).json({message: "Modification réussie"})
                })
                .catch((err) => {
                    console.log(err)
                    res.status(401).json(err)
                })
            }
        })
        .catch(
            (err) => {
                console.log(err)
                res.status(400).json({message: err})
            }
        )
}

exports.deleteSauce = (req, res, next) => {
    Sauces.findOne({_id: req.params.id}).then(
        sauce => {
            if(sauce.userId != req.auth.userId){
                res.status(401).json({message: "Suppression non autorisée"})
            }else{
                const imgFileName = sauce.imageUrl.split('/images/')[1].split('.').slice(0,-1).join('');

                deleteAllFilesNamed(imgFileName, '/../images/');

                Sauces.deleteOne({_id: req.params.id})
                        .then(() => {res.status(200).json({message: "Suppression réussie"})})
                        .catch(err => res.status(500).json({err}))
            }
        }
    )
}

exports.likeOneSauce = (req, res, next) => {
    const userId = req.body.userId = req.auth.userId;
    Sauces.findOne({_id: req.params.id}).then(
        sauce => {
            const userHasAllreadyLiked = sauce.usersLiked.includes(userId);
            const userHasAllreadyDisliked = sauce.usersDisliked.includes(userId);
            switch(req.body.like){
                case 1:
                    if(userHasAllreadyLiked){
                        res.status(401).json({message: "Like non autorisé"})
                    }else{
                        sauce.likes += 1;
                        if(userHasAllreadyDisliked){
                            sauce.usersDisliked.splice(sauce.usersLiked.indexOf(userId), 1);
                        }
                        sauce.usersLiked.push(userId);
                        Sauces.updateOne({_id: req.params.id}, sauce)
                            .then(()=> res.status(200).json({message: "Ajout du like réussi"}))
                            .catch(err => res.status(401).json({err}))
                    }
                    break;
                case -1:
                    if(userHasAllreadyDisliked){
                        res.status(401).json({message: "Dislike déjà pris en compte"})
                    }else if(userHasAllreadyLiked){
                        sauce.likes -= 1;
                        sauce.dislikes += 1;
                        sauce.usersLiked.splice(sauce.usersLiked.indexOf(userId), 1);
                        sauce.usersDisliked.push(userId);
                        Sauces.updateOne({_id: req.params.id}, sauce)
                            .then(()=> res.status(200).json({message: "Suppression du like et ajout du dislike réussis"}))
                            .catch(err => res.status(401).json({err}))
                    }else{
                        sauce.dislikes += 1;
                        sauce.usersDisliked.push(userId);
                        Sauces.updateOne({_id: req.params.id}, sauce)
                            .then(()=> res.status(200).json({message: "Ajout du dislike réussie"}))
                            .catch(err => res.status(401).json({err}))
                    }
                    break;
                case 0:
                    if(userHasAllreadyDisliked){
                        sauce.dislikes -= 1;
                        sauce.usersDisliked.splice(sauce.usersLiked.indexOf(userId), 1);
                        Sauces.updateOne({_id: req.params.id}, sauce)
                            .then(()=> res.status(200).json({message: "Suppression du dislike réussie"}))
                            .catch(err => res.status(401).json({err}))
                    }else if(userHasAllreadyLiked){
                        sauce.likes -= 1;
                        sauce.usersLiked.splice(sauce.usersLiked.indexOf(userId), 1);
                        Sauces.updateOne({_id: req.params.id}, sauce)
                            .then(()=> res.status(200).json({message: "Suppression du like réussie"}))
                            .catch(err => res.status(401).json({err}))
                    }else{
                        res.status(401).json({message: "Il n'y a pas de like ou dislike enregistré pour cette sauce par cet utilisateur"})
                    }
                    break;
                default:
                    res.status(400).json({message: `Valeur de like (${req.body.like}) est invalide`});
            }
        }
    ).catch(err => res.status(500).json({err}))
}