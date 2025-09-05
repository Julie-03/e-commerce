import express from 'express';
const productRouter = express.Router();
import productController from '../controllers/productController';
import { get } from 'mongoose';
const { saveProduct, deleteProduct, updateProduct, getProductbyid, getAllProducts} = productController;


productRouter.post('/', saveProduct);
productRouter.delete('/:id', deleteProduct);
productRouter.put('/:id', updateProduct);
productRouter.get('/:id', getProductbyid);
productRouter.get('/', getAllProducts);



export default productRouter;