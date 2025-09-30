import dotenv from "dotenv";
dotenv.config();
import express from "express"
import cors from "cors"
import productRouter from "./src/routes/productRoutes"
import cartRoutes from "./src/routes/cartRoutes"  
import mongoose from "mongoose"
import orderRoutes from "./src/routes/orderRoutes"
import userRouter from "./src/routes/userRoutes";
import contactRouter from "./src/routes/contactRoutes";

const port = parseInt(process.env.PORT || "7000", 10);
const app = express()
app.use(express.json())
// Configure CORS
const allowedOrigin = process.env.CORS_ORIGIN || "*"
app.use(cors({
  origin: allowedOrigin,
  credentials: true,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}))
app.use((req, res, next)=>{
  console.log(`${req.method} - ${req.url} -`);
  next()
})

app.get("/", (req, res) => {
  res.json({
    message: "E-commerce API is running successfully!",
    status: "active",
    endpoints: {
      products: "/products",
      cart: "/cart", 
      orders: "/order"
    },
    timestamp: new Date().toISOString()
  });
});

app.use("/products", productRouter);
app.use("/cart", cartRoutes);
app.use("/order", orderRoutes);
app.use("/api_v1/user", userRouter);
app.use("/api_v1/contact", contactRouter);

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