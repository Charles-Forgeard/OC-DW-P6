const sharp = require('sharp');
const path = require('path');
const Images = require('../models/Images');
const config = require('../config');
const { resolve } = require('path');
const { ifError } = require('assert');

const MIME_TYPES_to_ext = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/avif': 'avif'
};

const ext_to_MIME_TYPES = {
    'jpg': 'image/jpg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'webp': 'image/webp',
    'avif': 'image/avif'
}

const resizeAndStoreImg = function (data, fileName, extension, destination, moreExtensions){
    
    const imgPipeline = sharp(data).resize(300);
    const optiImgPipesObject = {};
    
    extension = extension === 'jpeg' ? 'jpg' : extension;
    if(moreExtensions.indexOf('jpeg') >= 0){
        moreExtensions = moreExtensions.filter(extension => extension != 'jpeg');
        moreExtensions.push('jpg')
    }
    if(moreExtensions.indexOf(extension) === -1){
        moreExtensions.push(extension)
    }

    moreExtensions.forEach((extension) => {
        switch(extension){
            case 'jpg':
                optiImgPipesObject.jpg = imgPipeline.clone().jpeg();
                break;
            case 'webp':
                optiImgPipesObject.webp = imgPipeline.clone().webp();                
                break;
            case 'avif':
                optiImgPipesObject.avif = imgPipeline.clone().avif();                
                break;
            case 'png':
                optiImgPipesObject.png = imgPipeline.clone().png();                
                break;
            default:
                optiImgPipesObject.jpg = imgPipeline.clone().jpeg();        
            }
    })

    if(destination === 'server'){
        filePathToStore = path.join(__dirname, '../images/');
        for(const [extension, potiImgPipe] of Object.entries(optiImgPipesObject)){
            potiImgPipe.toFile(`${filePathToStore}${fileName}.${extension}`)
        }
    }else if(destination === 'mongoDB'){
        for(const [extension, optiImgPipe] of Object.entries(optiImgPipesObject)){
            optiImgPipe.toBuffer().then(data => {
               
                const img = new Images({
                    name: `${fileName}.${extension}`,
                    img : {
                        data: data,
                        contentType: ext_to_MIME_TYPES[extension]
                    }
                })
                img.save()
            })
        }
    }
}

module.exports = async (req, res, next) => {
    if(req.file){
        const extension = MIME_TYPES_to_ext[req.file.mimetype];
        const fileName = Date.now() + req.file.originalname.replace(/ /g, '_').split('.').slice(0, -1).join('');
        req.file.filename = fileName + '.' + extension;
        resizeAndStoreImg(req.file.buffer, fileName, extension, config.storeIMG, ['jpg', 'webp', 'avif'])
        next()
    }else{
        next()
    }
}