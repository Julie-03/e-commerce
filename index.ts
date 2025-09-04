import express from "express"
import productRouter from "./src/routes/productRoutes"
import mongoose from "mongoose"
const port = 7000
const app = express()
app.use(express.json())




mongoose.connect("mongodb+srv://Julie:Bazera@cluster0.mkw79iu.mongodb.net/e-commerce")
  .then(()=>{
    console.log("well connected")
     app.listen(port ,()=>{
  console.log(`your server is up and running on port : ${port}`)
})
  })
 
  .catch(err=>{
    console.log("failed to connect ", err.message)
  })

  app.use("/products",productRouter)





