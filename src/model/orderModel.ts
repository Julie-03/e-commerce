import mongoose, { Schema, Document } from "mongoose";

interface OrderItem {
  productId: mongoose.Types.ObjectId;
  quantity: number;
}

export interface IOrder extends Document {
  items: OrderItem[];
  totalPrice: number;
  createdAt: Date;
}

const orderItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Products", required: true },
  quantity: { type: Number, required: true, min: 1 }
});

const orderSchema: Schema = new Schema(
  {
    items: [orderItemSchema],
    totalPrice: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
  }
);

const Order = mongoose.model<IOrder>("Order", orderSchema);
export default Order;