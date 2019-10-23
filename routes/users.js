const express = require('express');
const {body} =require('express-validator');
const user = require('../models/users');
const userController = require('../controllers/users')
const router =express.Router();

//user // signup
router.post('/signup',[
    body('email').
    isEmail()
    .withMessage('Enter Availd Email.')
    .custom((value,{req})=>{
        return user.findOne({email: value}).then(userDoc => {
            if(userDoc){
                return Promise.reject('E-mail address already exists!');
            }
        })
    })
    .normalizeEmail(),
    body('password').trim().isLength({min:8}),
    body('firstName').trim().not().isEmpty(),
    body('lastName').trim().not().isEmpty(),
    body('phoneNumber').trim().not().isEmpty().isLength({min:11,max:11}).isInt(),

],userController.signup);

//user // login
router.post('/login',userController.login);


module.exports = router;