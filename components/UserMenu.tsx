import { signOut, useSession } from '@/lib/auth/auth-client'
import menuConfigs from '@/lib/configs/menu.config'
import { userMenuProps } from '@/lib/types'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AiOutlineLogout } from 'react-icons/ai'

const UserMenu = ({ open, toggleMenu }: userMenuProps) => {
  const { data: session } = useSession()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const mountSidebar = () => {
      setMounted(true)
      return () => setMounted(false)
    }
    mountSidebar()
  }, [])

  const signout = async () => {
    toggleMenu()
    localStorage.removeItem('shippingAddress')
    const result = await signOut()
    if (result.data) {
      router.push('/')
    } else {
      alert('Error cerrar sesión, Intenta nuevamente.')
    }
    toggleMenu()
  }
  if (!open || !mounted || typeof document === 'undefined') return null

  return createPortal(
    <div
      className='absolute inset-0 z-9999 max-w-screen max-h-screen w-full h-screen'
      onClick={toggleMenu}
    >
      <div
        className='absolute top-12 right-4 z-9999 mt-4 w-64 bg-blue-400/80 rounded-lg p-4 '
        onClick={e => e.stopPropagation()}
      >
        {session?.user && (
          <div>
            <ul className='flex flex-col gap-2 ml-4 justify-center'>
              {menuConfigs.user.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.path}
                    onClick={() => toggleMenu()}
                    className='flex max-w-max items-center gap-2 rounded-lg py-1 px-2 hover:bg-gray-300/70 hover:scale-110'
                  >
                    <item.icon size={24} />
                    <h6 className='font-medium'>{item.display.toUpperCase()}</h6>
                  </Link>
                </li>
              ))}

              <li>
                <button
                  type='button'
                  onClick={signout}
                  className='flex gap-2 items-center font-bold hover:bg-gray-300/70 hover:scale-110 hover:cursor-pointer py-1 px-2 rounded-lg'
                >
                  <AiOutlineLogout size={24} />
                  <h1>Sign Out</h1>
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}

export default UserMenu
