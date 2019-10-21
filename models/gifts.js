const mongoose = require('mongoose');

const schema = mongoose.Schema;

const giftsSchema = new schema({
  title:{
      type:String,
      required:true
  },
  imageUrl:{
    type:String,
    required:true
   },
   description:{
    type:String,
    required:true
  }
});

module.exports = mongoose.model('Gifts',giftsSchema);