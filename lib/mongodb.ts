import mongoose from 'mongoose'
import dns from 'node:dns/promises'

interface MongooseCache {
  conn: typeof import('mongoose') | null
  promise: Promise<typeof import('mongoose')> | null
}

declare global {
  var mongoose: MongooseCache | undefined
}

const cached: MongooseCache = global.mongoose || { conn: null, promise: null }

if (!global.mongoose) {
  global.mongoose = cached
}

const MONGODB_URI = process.env.MONGODB_URI
dns.setServers(['1.1.1.1', '8.8.8.8'])

async function connectDB() {
  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
  }
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10, // Increase this based on your server capacity
      serverSelectionTimeoutMS: 5000, // Faster failure feedback
    }
    cached.promise = mongoose.connect(MONGODB_URI, opts).then(mongoose => {
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default connectDB
