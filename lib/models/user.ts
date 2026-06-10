import { Schema, models, model } from 'mongoose'

const UserSchema = new Schema(
  {
    name: String,
    email: String,
    image: String,
    emailVerified: Boolean,
  },
  {
    collection: 'user', // Better Auth collection name
    timestamps: true,
  },
)

export const User = models.User || model('User', UserSchema)
