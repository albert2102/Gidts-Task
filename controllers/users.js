const { validationResult } =require('express-validator');
const bcrypt = require('bcryptjs');
const jwt =require('jsonwebtoken');

const User = require('../models/users');
// user / signup
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
            const  user =new User({
                firstName:firstName,
                lastName:lastName,
                email:email,
                phoneNumber:phoneNumber,
                password:hashPW
            });
            return user.save();
         })
        .then(result =>{
        res.status(201).json({status: 201,message : 'User Created.',userId:result._id});
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
// user / login
exports.login =(req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;
    let loadeduser;
      User.findOne({email:email})
      .then(user =>{
          if(!user){
            const error =new Error('No Such User Exist!');
            error.statusCode = 401;
            throw error; 
          }
          loadeduser = user;
          return bcrypt.compare(password,user.password);
      })
      .then(isEqual =>{
          if(!isEqual){
            const error =new Error('Wrong Password!');
            error.statusCode = 401;
            throw error; 
          }
          const token = jwt.sign({
              email: loadeduser.email,
              userId: loadeduser._id.toString()
          }, 'beornottobethisisthequestion', 
          {expiresIn: '1h'}
          );
          res.status(200).json({status:200,message:'User Exists.',token:token, userId: loadeduser._id.toString()
          })
      })
      .catch(err =>{
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
         });
};

