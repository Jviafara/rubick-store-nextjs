import { IFavorite } from '../types'
import './user'
import mongoose, { Schema } from 'mongoose'

const favoriteSchema = new Schema<IFavorite>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  },
  { timestamps: true },
)

const Favorite = mongoose.models.Favorite || mongoose.model<IFavorite>('Favorite', favoriteSchema)
export default Favorite
