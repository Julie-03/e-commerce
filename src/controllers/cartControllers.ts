import { Request, Response } from "express";
import CartItem from "../model/cartModel";
import Product from "../model/productModel";

async function saveCartItem(req: Request, res: Response) {
  try {
    const { productId, quantity } = req.body;
    const userId = (req as any).user._id;
    
    if (!productId || !quantity) {
      return res.status(400).json({ 
        success: false, 
        message: "ProductId and quantity are required" 
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: "Product not found" 
      });
    }

    const existingItem = await CartItem.findOne({ userId, productId });
    if (existingItem) {
      return res.status(400).json({ 
        success: false, 
        message: "Product is already in cart. You can edit the quantity from your cart." 
      });
    }

    const newCartItem = await CartItem.create({ userId, productId, quantity });
    const subtotal = product.price * quantity;
    
    return res.status(201).json({ 
      success: true, 
      data: { ...newCartItem.toObject(), subtotal },
      message: "Item added to cart successfully" 
    });
  } catch (error) {
    console.error("Error saving cart item:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
}

async function getAllCartItems(req: Request, res: Response) {
  try {
    const userId = (req as any).user._id;
    const cartItems = await CartItem.find({ userId }).populate('productId');
    
    const itemsWithSubtotal = cartItems.map(item => {
      const product = item.productId as any;
      const subtotal = product.price * item.quantity;
      return { ...item.toObject(), subtotal };
    });
    
    return res.status(200).json({ 
      success: true, 
      data: itemsWithSubtotal 
    });
  } catch (error) {
    console.error("Error getting cart items:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
}

async function updateCartItem(req: Request, res: Response) {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const userId = (req as any).user._id;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ 
        success: false, 
        message: "Quantity must be greater than 0" 
      });
    }

    const cartItem = await CartItem.findOneAndUpdate(
      { userId, productId }, 
      { quantity }, 
      { new: true }
    ).populate('productId');
    
    if (!cartItem) {
      return res.status(404).json({ 
        success: false, 
        message: "Cart item not found" 
      });
    }

    const product = cartItem.productId as any;
    const subtotal = product.price * cartItem.quantity;
    
    return res.status(200).json({ 
      success: true, 
      data: { ...cartItem.toObject(), subtotal },
      message: "Cart item updated successfully" 
    });
  } catch (error) {
    console.error("Error updating cart item:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
}

async function deleteCartItem(req: Request, res: Response) {
  try {
    const { productId } = req.params;
    const userId = (req as any).user._id;
    
    const cartItem = await CartItem.findOneAndDelete({ userId, productId });
    
    if (!cartItem) {
      return res.status(404).json({ 
        success: false, 
        message: "Cart item not found" 
      });
    }
    
    return res.status(200).json({ 
      success: true, 
      message: "Cart item removed successfully" 
    });
  } catch (error) {
    console.error("Error deleting cart item:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
}

async function getCartItemById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const userId = (req as any).user._id;
    const cartItem = await CartItem.findOne({ _id: id, userId }).populate("productId");

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    const product = cartItem.productId as any;
    const subtotal = product.price * cartItem.quantity;

    return res.status(200).json({
      success: true,
      data: { ...cartItem.toObject(), subtotal },
    });
  } catch (error) {
    console.error("Error getting cart item:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
async function clearCart(req: Request, res: Response) {
  try {
    const userId = (req as any).user._id;
    const result = await CartItem.deleteMany({ userId });
    
    return res.status(200).json({ 
      success: true, 
      message: "Cart cleared successfully",
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
}

const cartController = { saveCartItem,clearCart,deleteCartItem, updateCartItem, getAllCartItems, getCartItemById };
export default cartController;