const mongoose = require('mongoose');

const schema = mongoose.Schema;

//driver Schema
const driverSchema = new schema({
  firstName:{
    type:String,
    required:true
},
lastName:{
  type:String,
  required:true
 },
 email:{
  type:String,
  required:true
},
password:{
  type:String,
  required:true
},
phoneNumber:{
  type:String,
  required:true
},
  deliveryDates:[{
    type:String
  }],
  ordersToDeliver:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Orders'
}]
});

module.exports = mongoose.model('Driver',driverSchema);