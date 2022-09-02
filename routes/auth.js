const express = require('express');
const verifEmail = require('../middleware/verifEmail');
const router = express.Router();
const rateLimit = require('../middleware/rate-limit');

const authCtrl = require('../controllers/auth');

router.post('/signup', verifEmail, authCtrl.postSignup);
router.post('/login', rateLimit.loginRequest, authCtrl.postLogin);

module.exports = router;