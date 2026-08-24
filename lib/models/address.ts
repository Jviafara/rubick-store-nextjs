import mongoose from 'mongoose'
import { IShippingAddress } from '../types'

const addressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  { timestamps: true },
)

const Address = mongoose.models.Address || mongoose.model<IShippingAddress>('Address', addressSchema)
export default Address
