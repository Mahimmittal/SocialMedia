const express= require('express');
const mongoose = require('mongoose');
const dotenv=require("dotenv");
const morgan = require("morgan");
const helmet = require("helmet");
const cors= require('cors');
const app=express();
const userRoute=require("./routes/users");
const authRoute=require("./routes/auth");
const postRoute=require("./routes/posts");
dotenv.config();

mongoose.connect(process.env.MONGO_URL,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  
},(err)=>{
  if(err)
  console.log(err);
  console.log("Connected to mongoDB Server");
});

// Middlewares
app.use(cors());
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
  console.log('Backend server is running on port 8000');
})
