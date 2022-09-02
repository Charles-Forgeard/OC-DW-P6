const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const imagesCtrl = require('../controllers/images');

// décommenter "auth" middleware pour sécuriser l'accès aux images (nécessite modification du front avec ajout de token d'identification dans la requête)
router.get('/:fileName', /*auth,*/ imagesCtrl.getImage);

module.exports = router;
