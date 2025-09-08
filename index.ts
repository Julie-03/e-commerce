import dotenv from "dotenv";
dotenv.config();
import express from "express"
import productRouter from "./src/routes/productRoutes"
import cartRoutes from "./src/routes/cartRoutes"  
import mongoose from "mongoose"
import orderRoutes from "./src/routes/orderRoutes"
const port = parseInt(process.env.PORT || "7000", 10);
const app = express()
app.use(express.json())






  app.use("/products",productRouter)
  app.use("/cart", cartRoutes);
  app.use("/order", orderRoutes);



if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is not defined in environment variables");
}

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(()=>{
    console.log("well connected")
     app.listen(port, "0.0.0.0", ()=>{
  console.log(`your server is up and running on port : ${port}`)
})
  })
 
  .catch(err=>{
    console.log("failed to connect ", err.message)
})