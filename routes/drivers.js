const express = require('express');
const {body} =require('express-validator');
const isAuth = require('../middleware/is-adminAuth');

const driversController = require('../controllers/drivers')
const driver = require('../models/drivers');

const router =express.Router();

//Admin create/driver
router.post('/driverSignup',
 isAuth,
[
  body('email').
  isEmail()
  .withMessage('Enter Availd Email.')
  .custom((value,{req})=>{
      return driver.findOne({email: value}).then(driverDoc => {
          if(driverDoc){
              return Promise.reject('E-mail address already exists!');
          }
      })
  })
  .normalizeEmail(),
  body('password').trim().isLength({min:8}),
  body('firstName').trim().not().isEmpty(),
  body('lastName').trim().not().isEmpty(),
  body('phoneNumber').trim().not().isEmpty().isLength({min:11,max:11}).isInt(),

],driversController.signup);

//Driver login
router.post('/login',driversController.login);

//Admin get/driver
router.get('/getDriver/',isAuth, driversController.getDriver);

//Admin update/driver
  router.put(
    '/updateDriver/:driverId',
    isAuth,
    [
      body('email').
      isEmail()
      .withMessage('Enter Availd Email.')
      .custom((value,{req})=>{
          return driver.findOne({email: value}).then(driverDoc => {
              if(driverDoc){
                  return Promise.reject('E-mail address already exists!');
              }
          })
      })
      .normalizeEmail(),
      body('password').trim().isLength({min:8}),
      body('firstName').trim().not().isEmpty(),
      body('lastName').trim().not().isEmpty(),
      body('phoneNumber').trim().not().isEmpty().isLength({min:11,max:11}).isInt(),
    
    ],
    driversController.updateDriver
  );
  
  //Admin delete/driver
  router.delete('/deleteDriver/:driverId',isAuth, driversController.deleteDriver);

module.exports = router;