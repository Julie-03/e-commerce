import express from 'express';
const cartRoutes = express.Router();
import cartController from '../controllers/cartControllers';
const { saveCartItem, deleteCartItem, updateCartItem, getAllCartItems, getCartItemById } = cartController;

cartRoutes.post('/', saveCartItem);
cartRoutes.get('/', getAllCartItems);
cartRoutes.put('/:productId', updateCartItem);
cartRoutes.delete('/:productId', deleteCartItem);
cartRoutes.get('/:id', getCartItemById);

export default cartRoutes;