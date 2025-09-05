import mongoose, { Schema, Document } from "mongoose";

export interface ICartItem extends Document {
  productId: mongoose.Types.ObjectId;
  quantity: number;
}

const cartSchema: Schema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Products", required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { timestamps: true }
);

const CartItem = mongoose.model<ICartItem>("CartItem", cartSchema);
export default CartItem;