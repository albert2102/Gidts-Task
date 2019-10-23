//Modules  we needed
const path = require('path');
const express = require('express');
const badyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const uuidv4 = require('uuid/v4');
require('dotenv').config();
var http = require('http'), url = require("url");

const userRoutes =require('./routes/users');
const giftsRoutes =require('./routes/gifts');
const driversRoutes =require('./routes/drivers');
const ordersRoutes =require('./routes/orders');
const adminRoutes = require('./routes/admin');

const app =express();
app.use(express.json());

//Images Destinaatio
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  }
});

//Images Extention Fillter
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(badyParser.json());

//Middleware To Handl Image Uploads
app.use( multer({ storage: fileStorage, fileFilter: fileFilter }).single('imageUrl'));

//Middleware To Save Image Uploads
app.use('/images', express.static(path.join(__dirname, 'images')));

//Middleware To Get Headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

  //App's Middlewares To Get Headers
app.use('/user',userRoutes);
app.use('/gift',giftsRoutes);
app.use('/driver',driversRoutes);
app.use('/order',ordersRoutes);
app.use('/admin',adminRoutes);

//Errorhandling Middelware
app.use((err,req,res,next)=>{
   console.log(err);
   const status= err.statusCode || 500;
   const message=err.message;
   const data=err.data;
   res.status(status).json({
       status:status,
       message: message,
       data : data
   });
});

//Node Server's Port on localhost or heroku
const port =process.env.PORT || 3000;

//MongoDB Atlas Server's Port on localhost or heroku or MongoDb Atlas
const connectionString =  process.env.DATABASE_URI || 'mongodb+srv://admin:admin@cluster0-4lrxe.mongodb.net/gifts?retryWrites=true&w=majority' || 'mongodb://localhost:27017/gifts';

//Conection for MongoDB Atlas and Heroku (or localhost)
mongoose.connect(
  connectionString ,
   { useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false}
).then(result =>
    {
      app.use( (req, res,next)=> { 
        // control for favicon
        if (req === '/favicon.ico') {
          res.writeHead(200, {'Content-Type': 'image/x-icon'} );
          res.end();
          return;
        }
        res.write(res);
        res.end(); 
      }).listen(port);
        console.log('Server is connected at:'+port);
    }).catch(err => {
        console.log(err);
    });
