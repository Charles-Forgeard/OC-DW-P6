const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const config = require('../config');

const imagesCtrl = require('../controllers/images');

router.get('/:fileName', config.authAccessImg === true ? auth : function (req, res, next){next()}, imagesCtrl.getImage);

module.exports = router;
