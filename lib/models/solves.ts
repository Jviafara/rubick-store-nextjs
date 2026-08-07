import mongoose from 'mongoose'
import { ISolves } from '../types'

const solvesSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    solvesHistory: [
      {
        scramble: { type: String, required: true },
        time: { type: Number, required: true },
        mo3: { type: Number },
        ao5: { type: Number },
        ao12: { type: Number },
        ao25: { type: Number },
        ao50: { type: Number },
        ao100: { type: Number },
      },
    ],
  },
  { timestamps: true },
)

const Solves = mongoose.models.Solves || mongoose.model<ISolves>('Solves', solvesSchema)

export default Solves
