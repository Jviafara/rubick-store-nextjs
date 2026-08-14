'use client'

import { motion, Variants } from 'motion/react'

export default function LoadingThreeDotsPulse() {
  const dotVariants: Variants = {
    pulse: {
      scale: [1, 1.5, 1],
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  }

  return (
    <motion.div
      animate='pulse'
      transition={{ staggerChildren: -0.2, staggerDirection: -1 }}
      className='flex justify-center items-center gap-5 p-2'
    >
      <motion.div
        className='w-3 h-3 rounded-full bg-primary'
        variants={dotVariants}
      />
      <motion.div
        className='w-3 h-3 rounded-full bg-primary'
        variants={dotVariants}
      />
      <motion.div
        className='w-3 h-3 rounded-full bg-primary'
        variants={dotVariants}
      />
    </motion.div>
  )
}
