const path = require('path');
const express = require('express');
const badyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const uuidv4 = require('uuid/v4')
require('dotenv').config();

const userRoutes =require('./routes/users');
const giftsRoutes =require('./routes/gifts');
const driversRoutes =require('./routes/drivers');
const ordersRoutes =require('./routes/orders');
const adminRoutes = require('./routes/admin');

const app =express();
app.use(express.json());

const fileStorage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, 'images');
  },
  filename: function(req, file, cb) {
      cb(null, new Date().toISOString() + file.originalname);
  }
});
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

app.use(
    multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
  );

app.use('/images', express.static(path.join(__dirname, 'images')));


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

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


const port =process.env.PORT || 3000;
const connectionString =  process.env.DATABASE_URI || 'mongodb+srv://admin:admin@cluster0-4lrxe.mongodb.net/gifts?retryWrites=true&w=majority' || 'mongodb://localhost:27017/gifts';

mongoose.connect(
  connectionString ,
   { useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false}
).then(result =>
    {
        app.listen(port);
        console.log('Server is connected');
    }).catch(err => {
        console.log(err);
    });
