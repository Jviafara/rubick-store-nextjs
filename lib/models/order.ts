import mongoose from 'mongoose'
import { IOrder } from '../types'

const orderSchema = new mongoose.Schema(
  {
    orderItems: [
      {
        slug: { type: String, required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        images: { type: [String], required: true },
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
      },
    ],
    shippingAddress: { type: mongoose.Types.ObjectId, ref: 'Address', required: true },
    paymentId: { type: String },
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    isPaid: { type: Boolean, default: false },
    paidAt: Date,
    shippingStatus: { type: String, default: 'processing' },
    deliveredAt: Date,
  },
  { timestamps: true },
)

const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema)

export default Order
