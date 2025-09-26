import { Request, Response } from "express";
import Product from "../model/productModel";

async function saveProduct(req: Request, res: Response) {
  try {
    const { name, price, description, imageUrl, category } = req.body;
    const newProduct = await Product.create({name, price, description, imageUrl, category});
    return res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error saving product:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
}

async function deleteProduct(req: Request, res: Response) {
  try {
    console.log(req.params.id);
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    
    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found." });
    }
    
    return res.status(200).json({ message: "Product deleted successfully." });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
}

async function updateProduct(req: Request, res: Response) {
  try {
    console.log(req.params.id);
    const { name, price, description, imageUrl, category } = req.body;
    
    // Fix: Pass the update data and return the updated document
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, description, imageUrl, category },
      { new: true } // This returns the updated document
    );
    
    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found." });
    }
    
    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
}

async function getProductbyid(req: Request, res: Response) {
  try {
    console.log(req.params.id);
    
    // Fix: Store the result and return it
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }
    
    return res.status(200).json(product);
  } catch (error) {
    console.error("Error getting product:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
}

async function getAllProducts(req: Request, res: Response) {
  try {
    const products = await Product.find();
    return res.status(200).json(products);
  } catch (error) {
    console.error("Error getting products:", error);
    return res.status(500).json({ error: "Internal server error." });
  }}
const productController = {saveProduct, deleteProduct, updateProduct, getProductbyid, getAllProducts};

export default productController;