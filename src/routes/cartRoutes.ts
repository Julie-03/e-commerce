import express from "express";
import { requireSignin } from "../middleware/authenticationFunction"; // Adjust path as needed
import cartController from "../controllers/cartControllers"; // Default import

const cartRouter = express.Router();

// Apply authentication middleware to protect these routes
cartRouter.post("/add", requireSignin, cartController.saveCartItem);
cartRouter.get("/", requireSignin, cartController.getAllCartItems);
cartRouter.get("/:id", requireSignin, cartController.getCartItemById);
cartRouter.put("/update/:productId", requireSignin, cartController.updateCartItem);
cartRouter.delete("/remove/:productId", requireSignin, cartController.deleteCartItem);

// Test route (public)
cartRouter.get("/test", (req, res) => {
    res.json({ message: "Cart router is working!" });
});

export default cartRouter;