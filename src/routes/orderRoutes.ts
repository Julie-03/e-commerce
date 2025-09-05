import express from 'express';
const orderRoutes = express.Router();
import orderController from '../controllers/orderController';
const { saveOrder, deleteOrder, getOrderById, getAllOrders } = orderController;

orderRoutes.post('/', saveOrder);
orderRoutes.get('/', getAllOrders);
orderRoutes.get('/:id', getOrderById);
orderRoutes.delete('/:id', deleteOrder);

export default orderRoutes;