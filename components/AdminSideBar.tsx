import menuConfigs from '@/lib/configs/menu.config'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaRegCaretSquareLeft, FaRegCaretSquareRight } from 'react-icons/fa'

const AdminSideBar = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeTab = searchParams.get('tab')

  const [extended, setExtended] = useState(false)

  const handleTab = (tab: string) => {
    router.push(`?tab=${tab}`)
  }

  return (
    <motion.div
      initial={false}
      animate={{
        width: extended ? '100%' : '3.5rem',
      }}
      transition={{
        duration: 0.45,
        ease: [0.4, 0, 0.2, 1],
      }}
      className={`${extended && 'absolute top-0 left-0 z-999 py-12'} min-w-fit  max-w-[75vw] sm:max-w-[50vw] md:max-w-[40vw] lg:max-w-[25vw] xl:max-w-[20vw]  md:relative  min-h-[calc(100dvh-76px)]  bg-surface/70  overflow-hidden px-2 md:px-4 py-8 flex flex-col space-y-6 rounded-r-2xl `}
    >
      {/* Header */}
      <div className='w-full  flex items-center justify-center shrink-0'>
        {extended && (
          <div className='w-full text-center xl:text-left '>
            <h1 className='text-xl font-semibold uppercase text-nowrap'>Dashboard</h1>
          </div>
        )}
        <button
          onClick={() => setExtended(!extended)}
          className={`w-fit ${extended && 'absolute top-4  right-4'} `}
        >
          {extended ? (
            <FaRegCaretSquareLeft className='w-6 xl:w-8 h-6 xl:h-10' />
          ) : (
            <FaRegCaretSquareRight className='w-6 xl:w-8 h-6 xl:h-8' />
          )}
        </button>
      </div>

      {/* Contracted  Menu */}
      {!extended && (
        <ul className='flex flex-col w-full items-center space-y-4'>
          {menuConfigs.admin.map((item, index) => (
            <motion.li
              initial={{ opacity: 0, x: -200 }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{ opacity: 0, x: -200 }}
              transition={{
                duration: 1,
                ease: [0.4, 0, 0.2, 1],
              }}
              key={index}
            >
              <button
                onClick={() => handleTab(item.state)}
                className='flex max-w-max items-center gap-2 rounded-lg hover:text-primary/70 hover:scale-110'
              >
                <item.icon
                  className={`w-6 xl:w-8 h-6 xl:h-8 ${activeTab === item.state && 'text-primary scale-110 ml-4'} `}
                />
              </button>
            </motion.li>
          ))}
        </ul>
      )}

      {/* Extended Menu */}
      {extended && (
        <ul className={`flex flex-col px-2  space-y-4 w-full`}>
          {menuConfigs.admin.map((item, index) => (
            <motion.li
              initial={{ opacity: 0, x: -200 }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{ opacity: 0, x: -200 }}
              transition={{
                duration: 1,
                ease: [0.4, 0, 0.2, 1],
              }}
              key={index}
            >
              <button
                onClick={() => handleTab(item.state)}
                className={`flex max-w-max items-center gap-2 rounded-lg ${activeTab === item.state && 'text-primary scale-110 ml-4'} hover:text-primary/70 hover:scale-110`}
              >
                <item.icon className='w-6 xl:w-8 h-6 xl:h-8' />
                <h6 className='font-medium '>{item.display.toUpperCase()}</h6>
              </button>
            </motion.li>
          ))}
        </ul>
      )}
    </motion.div>
  )
}

export default AdminSideBar
