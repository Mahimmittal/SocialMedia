const express= require('express');
const mongoose = require('mongoose');
const dotenv=require("dotenv");
const morgan = require("morgan");
const helmet = require("helmet");

const app=express();
const userRoute=require("./routes/users");
const authRoute=require("./routes/auth");
const postRoute=require("./routes/posts");
dotenv.config();

mongoose.connect(process.env.MONGO_URL,{
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Middlewares
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use("/api/users", userRoute);
app.use("/api/auth",authRoute);
app.use("/api/posts",postRoute);
app.get("/",(req,res)=>{
  res.send("Welcome to homepage");
})




app.listen(8000,()=>{
  console.log('Backend server is runningdsfs');
})
