const mongoose = require('mongoose');

const schema = mongoose.Schema;

const orderSchema = new schema({
  gifts:[{
     type: mongoose.Schema.Types.ObjectId,
      ref: 'Gifts',
      required:true
  }],
   location:[ {
      type: Number,
      required: true
   }],
    destinationAddress: {
       street:{
         type:String,
         required:true
      },
      block:{
         type:Number,
         required:true
      },
      floor:{
         type:Number,
         required:true
      }
   }
  ,
  isdeliveried:{
     type:Boolean,
     default:false,
  }
  ,
   date:{
    type:String,
    required:true
   },
  driverInfo:{
      type: mongoose.Schema.Types.ObjectID,
      ref: 'Driver'
   },
   userInfo:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
 }
},
{ timestamps: true }
  );

module.exports = mongoose.model('Orders',orderSchema);