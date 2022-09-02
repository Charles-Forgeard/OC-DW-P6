const path = require('path');
const fs = require('fs');
const config = require('../config');
const Images = require('../models/Images');

const MIME_TYPES = {
    'jpg': 'image/jpg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'webp': 'image/webp',
    'avif': 'image/avif'
};

exports.getImage = (req, res, next) => {
    if(config.storeIMG === 'mongoDB'){
        Images.findOne({name: req.params.fileName})
        .then(image => {
            if(image === null){
                res.status(404).json({message: "L'image demandée n'est pas présente en db"})
            }else{
                res.set('Content-Type', image.img.contentType);
                res.send(image.img.data)
                res.status(200)
            }
        })
        .catch(err => res.status(400).json({err}))
    }else if(config.storeIMG === 'server'){
        const filePath = path.join(__dirname, '../images', req.params.fileName);
        const file = fs.createReadStream(filePath);
        file.on('open', () => {
            const mimeType = MIME_TYPES[req.params.fileName.split('.').pop()];
            res.set('Content-Type', mimeType);
            file.pipe(res);
            res.status(200);
        })
        file.on('error', err => {
            res.set('Content-Type', 'text/plain');
            res.status(404).end('Not found');
        })
    }else{
        console.log('valeur storeIMG invalide. Valeurs acceptée = mongoDB || server')
            res.status(500)
    }
    
}