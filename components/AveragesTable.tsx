import { Averages, ISolve } from '@/lib/types'
import { formatearTiempo } from '@/lib/utils'
import { Trash2 } from 'lucide-react'

interface TimesTableProps {
  current?: ISolve
  lowests?: Averages
  handleClearTimes: () => void
}
const AveragesTable = ({ current, handleClearTimes, lowests }: TimesTableProps) => {
  return (
    <div className='relative overflow-x-hidden rounded-xl  border border-dashed border-muted text-center'>
      <table className='w-full'>
        <thead>
          <tr>
            <th className='flex items-center justify-center'>
              <button
                onClick={handleClearTimes}
                className='hover:text-red-500 cursor-pointer'
              >
                {current && <Trash2 />}
              </button>
            </th>
            <th>
              <h1 className='text-center'>Time</h1>
            </th>
            <th>
              <h1 className='text-center'>Best</h1>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className='text-center!'>
              <h1>Time</h1>
            </td>
            <td className='text-center!'>{current?.time ? formatearTiempo('stop', current.time) : '-'}</td>
            <td className='text-center!'>{lowests?.time ? formatearTiempo('stop', lowests.time.time) : '-'}</td>
          </tr>
          {current && current.mo3 && (
            <tr>
              <td className='text-center!'>
                <h1>mo3</h1>
              </td>
              <td className='text-center!'>{formatearTiempo('stop', current.mo3)}</td>
              <td className='text-center!'>{lowests?.mo3 ? formatearTiempo('stop', lowests.mo3.mo3!) : '-'}</td>
            </tr>
          )}
          {current && current.ao5 && (
            <tr>
              <td className='text-center!'>
                <h1>ao5</h1>
              </td>
              <td className='text-center!'>{formatearTiempo('stop', current.ao5)}</td>
              <td className='text-center!'>{lowests?.ao5 ? formatearTiempo('stop', lowests.ao5.ao5!) : '-'}</td>
            </tr>
          )}
          {current && current.ao12 && (
            <tr>
              <td className='text-center!'>
                <h1>ao12</h1>
              </td>
              <td className='text-center!'>{formatearTiempo('stop', current.ao12)}</td>
              <td className='text-center!'>{lowests?.ao12 ? formatearTiempo('stop', lowests.ao12.ao12!) : '-'}</td>
            </tr>
          )}
          {current && current.ao25 && (
            <tr>
              <td className='text-center!'>
                <h1>ao25</h1>
              </td>
              <td className='text-center!'>{formatearTiempo('stop', current.ao25)}</td>
              <td className='text-center!'>{lowests?.ao25 ? formatearTiempo('stop', lowests.ao25.ao25!) : '-'}</td>
            </tr>
          )}
          {current && current.ao50 && (
            <tr>
              <td className='text-center!'>
                <h1>ao50</h1>
              </td>
              <td className='text-center!'>{formatearTiempo('stop', current.ao50)}</td>
              <td className='text-center!'>{lowests?.ao50 ? formatearTiempo('stop', lowests.ao50.ao50!) : '-'}</td>
            </tr>
          )}
          {current && current.ao100 && (
            <tr>
              <td className='text-center!'>
                <h1>ao100</h1>
              </td>
              <td className='text-center!'>{formatearTiempo('stop', current.ao100)}</td>
              <td className='text-center!'>{lowests?.ao100 ? formatearTiempo('stop', lowests.ao100.ao100!) : '-'}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default AveragesTable
