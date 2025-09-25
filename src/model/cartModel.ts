import mongoose, { Schema, Document } from "mongoose";

export interface ICartItem extends Document {
  userId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  quantity: number;
}

const cartSchema: Schema = new Schema(
  {
      userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    productId: { type: Schema.Types.ObjectId, ref: "Products", required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { timestamps: true }
);

const CartItem = mongoose.model<ICartItem>("CartItem", cartSchema);
export default CartItem;