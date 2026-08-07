import { signOut, useSession } from '@/lib/auth/auth-client'
import menuConfigs from '@/lib/configs/menu.config'
import { FullUser } from '@/lib/types'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { AiOutlineLogout } from 'react-icons/ai'
import { FaRegCaretSquareLeft, FaRegCaretSquareRight } from 'react-icons/fa'
import { MdSpaceDashboard } from 'react-icons/md'
import { motion } from 'motion/react'

const UserProfileSidebar = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeTab = searchParams.get('tab')

  const [extended, setExtended] = useState(false)

  const signout = async () => {
    localStorage.removeItem('shippingAddress')
    const result = await signOut()
    if (result.data) {
      router.push('/')
    } else {
      alert('Error cerrar sesión, Intenta nuevamente.')
    }
  }

  const handleTab = (tab: string) => {
    setExtended(false)
    router.push(`/profile?tab=${tab}`)
  }

  return (
    <motion.aside
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
      <div className='w-full  flex items-center justify-center shrink-0'>
        {extended && (
          <div className='w-full text-center xl:text-left '>
            <h1 className='text-xl font-semibold uppercase text-nowrap'>{session?.user.name}</h1>
            <p className='text-nowrap flex flex-col xl:flex-row gap-1'>
              Member since:
              <span className='text-muted '>
                {new Date(session?.user.createdAt || '').toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </p>
          </div>
        )}
        <button
          onClick={() => setExtended(!extended)}
          className={`w-fit ${extended && 'absolute top-4  right-4'} `}
        >
          {extended ? <FaRegCaretSquareLeft className='w-6 xl:w-8 h-6 xl:h-10' /> : <FaRegCaretSquareRight className='w-6 xl:w-8 h-6 xl:h-8' />}
        </button>
      </div>

      {!extended && (
        <ul className='flex flex-col w-full items-center space-y-4'>
          {menuConfigs.user.map((item, index) => (
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
                onClick={() => handleTab(item.tab)}
                className='flex max-w-max items-center gap-2 rounded-lg hover:text-primary/70 hover:scale-110'
              >
                <item.icon className={`w-6 xl:w-8 h-6 xl:h-8 ${activeTab === item.tab && 'text-primary scale-110 ml-4'} `} />
              </button>
            </motion.li>
          ))}
        </ul>
      )}

      {extended && (
        <ul className={`flex flex-col px-2  space-y-4 w-full`}>
          {(session?.user as FullUser)?.role === 'admin' && (
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
            >
              <Link
                href={'/admin/dashboard'}
                className={`flex max-w-max items-center gap-2 rounded-lg  hover:scale-110`}
              >
                <MdSpaceDashboard className='w-6 xl:w-8 h-6 xl:h-8' />
                <h6 className='font-medium '>Dashboard</h6>
              </Link>
            </motion.li>
          )}
          {menuConfigs.user.map((item, index) => (
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
                onClick={() => handleTab(item.tab)}
                className={`flex max-w-max items-center gap-2 rounded-lg ${activeTab === item.tab && 'text-primary scale-110 ml-4'} hover:text-primary/70 hover:scale-110`}
              >
                <item.icon className='w-6 xl:w-8 h-6 xl:h-8' />
                <h6 className='font-medium '>{item.display.toUpperCase()}</h6>
              </button>
            </motion.li>
          ))}

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
          >
            <button
              type='button'
              onClick={signout}
              className='flex gap-2 items-center font-bold hover:bg-gray-300/70 hover:scale-110 hover:cursor-pointer  rounded-lg'
            >
              <AiOutlineLogout className='w-6 lg:w-8 h-6 lg:h-8' />
              <h1>Sign Out</h1>
            </button>
          </motion.li>
        </ul>
      )}
    </motion.aside>
  )
}

export default UserProfileSidebar
