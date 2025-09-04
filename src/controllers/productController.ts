import { Request, Response } from "express";
import Product from "../model/productModel";

async function saveProduct(req: Request, res: Response) {
  try {
    const { name, price, description, imageUrl, category } = req.body;
    
    const newProduct = await Product.create({name,price,description,imageUrl,category});
    return res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error saving product:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
}
async function deleteProduct(req: Request, res: Response) {
    try {
        console.log(req.params.id);
        await Product.findByIdAndDelete(req.params.id);
        return res.status(201).json({ message: "Product deleted successfully." });
       
    } catch (error) {
         console.error("Error deleting product:", error);
    return res.status(500).json({ error: "Internal server error." });
    }
}

async function updateProduct(req: Request, res: Response) {
    try {
        console.log(req.params.id);
        await Product.findByIdAndUpdate(req.params.id);
        return res.status(201).json({ message: "Product updated successfully." });
       
    } catch (error) {
         console.error("Error updating product:", error);
    return res.status(500).json({ error: "Internal server error." });
    }
}

const productController = {saveProduct, deleteProduct, updateProduct};
export default productController;