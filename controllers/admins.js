const { validationResult } =require('express-validator');
const bcrypt = require('bcryptjs');
const jwt =require('jsonwebtoken');

const admin = require('../models/admins');
// Admin /login
exports.login =(req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;
    let loadedadmin;
      admin.findOne({email:email})
      .then(admin =>{
          if(!admin){
            const error =new Error('No Such admin Exist!');
            error.statusCode = 401;
            throw error; 
          }
          loadedadmin = admin;
          return bcrypt.compare(password,admin.password);
      })
      .then(isEqual =>{
          if(!isEqual){
            const error =new Error('Wrong Password!');
            error.statusCode = 401;
            throw error; 
          }
          const token = jwt.sign({
              email: loadedadmin.email,
              adminId: loadedadmin._id.toString()
          }, 'beornottobethisisthequestionadmin', 
          {expiresIn: '1h'}
          );
          res.status(200).json({status:200,message:'Admin Exists.',token:token, adminId: loadedadmin._id.toString(),
            fristName:loadedadmin.firstName,lastName:loadedadmin.lastName
          })
      })
      .catch(err =>{
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
         });
  };
  