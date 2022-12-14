const multer = require('multer');

/*const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/avif': 'avif'
};*/

const storage = multer.memoryStorage(
    /*{
        destination: (req, file, callback) => {
            callback(null, 'images')
        },
        filename: (req, file, callback) => {
            const extension = MIME_TYPES[file.mimetype];
            const name = file.originalname.replace(/ /g, '_').replace(new RegExp('.' + extension + '$'), '');
            callback(null, name + Date.now() + '.' + extension);
        }
    }*/
);

module.exports = multer({storage}).single('image');