import Product from '@/lib/models/product'
import { User } from '@/lib/models/user'
import connectDB from '@/lib/mongodb'
import { v2 as cloudinary } from 'cloudinary'

import * as fs from 'fs'
import * as path from 'path'

const USER_ID = '6a6776dd664af3fff52362af'

async function uploadImage() {
  if (!USER_ID) {
    console.error('❌ Error: SEED_USER_ID environment variable is required')
    console.log('Usage: SEED_USER_ID=your-user-id npm run seed')
    process.exit(1)
  }
  let counter = 0

  try {
    await connectDB()
    console.log('✅ Connected to database')

    //   Get User
    const user = await User.findById(USER_ID)
    console.log(user)
    if (user.role !== 'admin' || !user) process.exit(1)

    const products = await Product.find()

    for (const p of products) {
      const product = await Product.findOne({ name: p.name })
      if (!product) continue

      const imagePath = path.join('public/products', `${product.name}.png`)
      let imageBuffer: Buffer | null = null
      try {
        imageBuffer = fs.readFileSync(imagePath)
      } catch (e) {
        continue
      }

      if (imageBuffer) {
        const uploadResult = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ resource_type: 'image', folder: 'RubickStore/Products' }, (error, result) => {
              if (error) {
                reject(error)
              } else {
                resolve(result)
              }
            })
            .end(imageBuffer)
        })

        product.images = []
        product.images.push((uploadResult as { secure_url: string }).secure_url)

        await product.save()
        console.log('Product: ', product.name, ' updated!')
        counter++
      }
    }

    console.log(counter, 'Total products updated!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

uploadImage()
