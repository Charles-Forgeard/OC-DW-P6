const express = require('express');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const imageOpti = require('../middleware/imageOpti');
const router = express.Router();


const sauceCtrl = require('../controllers/sauces');

router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.post('/', auth, multer, imageOpti, sauceCtrl.addSauces);
router.put('/:id', auth, multer, imageOpti, sauceCtrl.updateSauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.likeOneSauce);

module.exports = router;