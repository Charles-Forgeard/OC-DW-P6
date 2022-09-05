const jwt = require('jsonwebtoken');
const mdpToken = require('../controllers/auth').mdpToken;

module.exports = (req, res, next) => {
    if(req.headers.authorization){
        try{
            const token = req.headers.authorization.split(' ')[1];
            const decodedToken = jwt.verify(token, mdpToken);
            const userId = decodedToken.userId;
            req.auth = {
                userId: userId
            }
            next();
        }catch(err){
            console.log(err)
            res.status(401).json({err});
        }
    }else{
        console.error('token manquant')
        res.status(401).end()
    }
    

};