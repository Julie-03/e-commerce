import express from 'express';
const productRouter = express.Router();
import productController from '../controllers/productController';
const { saveProduct, deleteProduct, updateProduct } = productController;


productRouter.post('/', saveProduct);
productRouter.delete('/:id', deleteProduct);
productRouter.update('/:id', updateProduct);



export default productRouter;