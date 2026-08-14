import Product from '@/lib/models/product'
import { User } from '@/lib/models/user'
import connectDB from '@/lib/mongodb'
import { getRamdomInt } from '@/lib/utils'

const USER_ID = '6a6776dd664af3fff52362af'

async function populateTotalSold() {
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

      if (true) {
        const totalSold = getRamdomInt(product.numReviews, product.numReviews * 4)
        product.totalSold = totalSold
        await product.save()
        console.log('Product: ', product.name, ' total sold = ', totalSold, ', updated successfully!')
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

populateTotalSold()
