const express = require("express");
require("./db/conn");
const User = require("./models/user");
const userRouter=require('./routes/user');



const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(userRouter);

// const test=async (email,password)=>{
//   const user=await User.findOne({email:email});
//   const result= await user.comparePassword(password);
//   console.log(result)
// }

// test('k200984689@gmail.com','12344')



app.listen(port, () => {
  console.log("Conection established at port no. " + port);
});
