import menuConfigs from '@/lib/configs/menu.config'
import { AdminAsideProps } from '@/lib/types'

const AdminSideBar = ({ mainView, setView }: AdminAsideProps) => {
  return (
    <div className='h-[calc(100vh-76px)] col-span-1 text-nowrap bg-gray-200/50 backdrop-blur-2xl py-12 md:px-4 text-black'>
      <ul className='flex flex-col gap-2  justify-center  text-primary text-lg'>
        {menuConfigs.admin.map((item, index) => (
          <li
            key={index}
            onClick={() => setView(item.state)}
            className={`flex max-w-max items-center gap-2 rounded-lg py-1 px-2 ${mainView === item.state && 'bg-gray-400'} hover:bg-gray-400 hover:scale-105`}
          >
            <item.icon size={24} />
            <h6 className='font-medium'>{item.display.toUpperCase()}</h6>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AdminSideBar
