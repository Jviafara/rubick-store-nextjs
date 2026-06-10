import './user'
import mongoose, { Schema } from 'mongoose'

enum MediaTypeEnum {
  tv = 'tv',
  movie = 'movie',
}

interface IFavoriteModel {
  user: mongoose.Types.ObjectId
  mediaType: MediaTypeEnum
  mediaId: string
  mediaTitle: string
  mediaPoster: string
  mediaRate: number
}

const favoriteSchema = new Schema<IFavoriteModel>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    mediaType: { type: String, enum: ['tv', 'movie'], required: true },
    mediaId: { type: String, required: true },
    mediaTitle: { type: String, required: true },
    mediaPoster: { type: String, required: true },
    mediaRate: { type: Number, required: true },
  },
  { timestamps: true },
)

const Favorite = mongoose.models.Favorite || mongoose.model<IFavoriteModel>('Favorite', favoriteSchema)
export default Favorite
