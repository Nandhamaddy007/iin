const mongoose=require('mongoose')
var userSchema = new mongoose.Schema({
    
        firstName: String,
        lastName: String,
        email: String,
        age: String
      },
  );
  module.exports= mongoose.model("userDetails",userSchema)