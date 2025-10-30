import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 8000;

connectDB()
.then(()=>{
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  })
})
.catch((err)=>{
  console.log('erorr in connecting db',err);
  
})

/*
import express from 'express'

const app=new express();

(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    app.on("error",(error)=>{
      console.log('error in connecting..',error);
      throw error
    })
    app.listen(process.env.PORT,()=>{
      console.log(`my app is listening at port ${process.env.PORT}`);
      
    })
  } catch (error) {
    console.error("errors:", error);
    throw error;
  }
})();
*/
