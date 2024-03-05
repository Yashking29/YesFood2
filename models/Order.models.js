import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: String, required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Food_items', required: true },
     
    }
  ],
 
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);


export {Order}