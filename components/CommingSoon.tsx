import { GiButterflyWarning } from 'react-icons/gi'

const CommingSoon = () => {
  return (
    <div className='w-full lg:w-[50%] h-72 flex flex-col items-center justify-center gap-1 rounded-xl bg-cyan-100 p-6'>
      <GiButterflyWarning
        size={64}
        color='blue'
      />
      <p className='text-2xl text-center flex justify-center text-blue-700 uppercase'>Coming Soon!</p>
    </div>
  )
}

export default CommingSoon
