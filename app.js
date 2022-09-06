const express = require('express');
const config = require('./config');
const app = express();
const helmet = require('helmet');
const authRoutes = require('./routes/auth');
const rateLimit = require('./middleware/rate-limit');
const saucesRoutes = require('./routes/sauces');
const imagesRoutes = require('./routes/images');
const siteDomain = config.siteDomain;
const path = require('path');
const mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://${config.mongoDB.username}:${config.mongoDB.password}@${config.mongoDB.name}.mmpdy.mongodb.net/?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: config.env === 'development' ? true : false})
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(rateLimit.appRequest)

app.use(helmet());

app.use((req, res, next) => {
  if(req.headers.referer.slice(0,-1) !== siteDomain){
    res.status(401).json({message: 'access denied'})
  }else{
    console.log(siteDomain)
    res.setHeader('Access-Control-Allow-Origin', siteDomain);
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Cross-Origin-Resource-Policy', siteDomain);
    next();
  }
});

app.use(express.json())

app.use('/api/auth', authRoutes)

/* Si l'accès aux images n'est pas sécurisé et qu'elle ne sont pas stockées en BD, il est possible de donner l'accès au fichier images en 
supprimant "imagesRoutes" et en décommentant "express.static(path.join(__dirname, 'images'))".
Tout le contenu du répertoire "images" sera alors librement accessible*/
app.use('/images', imagesRoutes /*express.static(path.join(__dirname, 'images'))*/)

app.use('/api/sauces', saucesRoutes)

module.exports = app;