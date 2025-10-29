import dotenv from 'dotenv'
import connectDB from "./db/index.js";
import express from 'express';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


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