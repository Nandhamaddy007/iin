const { default: mongoose } = require("mongoose");
const userModel= require("./userSchema");

const addUser=(data)=>{
    // console.log(process.env.DbLoc)
    mongoose.connect(
        process.env.dbLoc,
        { useNewUrlParser: true, useUnifiedTopology: true },
        function (error) {
          if (error) {
            console.log("Error! " + error);
          }
        }
      );
      userModel.insertMany(data,(err,success)=>{
        console.log(success)
      })
      
}
module.exports={addUser}

  

