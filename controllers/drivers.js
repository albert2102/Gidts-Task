const { validationResult } =require('express-validator');
const bcrypt = require('bcryptjs');
const jwt =require('jsonwebtoken');

const drivers = require('../models/drivers');

// Admin /Driver/signup
exports.signup = (req,res,next)=>{
  const errors = validationResult(req) ;
      if(!errors.isEmpty()){
           const error =new Error('Validation Failed!');
           error.statusCode = 422;
           error.data =errors.array();
           throw error; 
      }
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const phoneNumber = req.body.phoneNumber;
  const password = req.body.password;
  const passwordconfig = req.body.passwordconfig;
  if(password === passwordconfig){
      bcrypt.hash(password, 15)
          .then(hashPW =>{
          const  driver =new drivers({
              firstName:firstName,
              lastName:lastName,
              email:email,
              phoneNumber:phoneNumber,
              password:hashPW
          });
          return driver.save();
       })
      .then(result =>{
      res.status(201).json({status: 201,message : 'Driver Created.',driverId:result._id});
      })
       .catch(err =>{
      if(!err.statusCode){
          err.statusCode = 500;
      }
      next(err);
       });
  }
  else{
      const error =new Error('Password doesnot Math!');
      error.statusCode = 423;
      error.data =errors.array();
      throw error;    
   }
};

// driver /login
exports.login =(req,res,next)=>{
  const email = req.body.email;
  const password = req.body.password;
  let loadeddriver;
    drivers.findOne({email:email})
    .then(driver =>{
        if(!driver){
          const error =new Error('No Such Deriver Exist!');
          error.statusCode = 401;
          throw error; 
        }
        loadeddriver = driver;
        return bcrypt.compare(password,driver.password);
    })
    .then(isEqual =>{
        if(!isEqual){
          const error =new Error('Wrong Password!');
          error.statusCode = 401;
          throw error; 
        }
        const token = jwt.sign({
            email: loadeddriver.email,
            driverId: loadeddriver._id.toString()
        }, 'beornottobethisisthequestiondriver', 
        {expiresIn: '1h'}
        );
        res.status(200).json({status:200,message:'Driver Exists.',token:token, userId: loadeddriver._id.toString(),
          fristName:loadeddriver.firstName,lastName:loadeddriver.lastName,ordersToDeliver:loadeddriver.ordersToDeliver,
        })
    })
    .catch(err =>{
      if(!err.statusCode){
          err.statusCode = 500;
      }
      next(err);
       });
};
// Admin /getDriver
exports.getDriver = (req, res, next) => {
    drivers.find()
      .then(driver => {
        if (!driver) {
          const error = new Error('Could not find driver.');
          error.statusCode = 404;
          throw error;
        }
        res.status(200).json({ status:200,message: 'driver fetched.', drivers: driver });
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  };
// Admin /updateDriver
  exports.updateDriver = (req, res, next) => {
    const driverId = req.params.driverId;
    

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      throw error;
    }
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const phoneNumber = req.body.phoneNumber;
    const email =req.body.email;
    const password =req.body.password;
    let loadeddriver;
    drivers.findById(driverId)
      .then(driver => {
        if (!driver) {
          const error = new Error('Could not find driver.');
          error.statusCode = 404;
          throw error;
        }
        loadeddriver =driver;
        return bcrypt.hash(password, 15);
      })
      .then(hasPW =>{
        loadeddriver.firstName = firstName;
        loadeddriver.lastName = lastName;
        loadeddriver.phoneNumber = phoneNumber;
        loadeddriver.email = email;
        loadeddriver.password = hasPW;
        return loadeddriver.save();
      })
      .then(result => {
        res.status(200).json({ status:200, message: 'Driver updated!', driver: result });
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  };
// Admin /deleteDriver
  exports.deleteDriver = (req, res, next) => {
    const driverId = req.params.driverId;
    drivers.findById(driverId)
      .then(driver => {
        if (!driver) {
          const error = new Error('Could not find driver.');
          error.statusCode = 404;
          throw error;
        }
        return drivers.findByIdAndRemove(driverId);
      })
      .then(result => {
        res.status(200).json({ status:200, message: 'Deleted driver.' });
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  };