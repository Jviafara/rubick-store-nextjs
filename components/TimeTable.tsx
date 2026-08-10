import { Averages, ISolves } from '@/lib/types'
import { formatearTiempo } from '@/lib/utils'

interface TimesTableProps {
  solves?: ISolves
  lowests?: Averages
  highest?: Averages
  handleDeleteSolve: (id: string) => void
}

const TimeTable = ({ solves, handleDeleteSolve, lowests, highest }: TimesTableProps) => {
  return (
    <div className='rounded-xl h-fit max-h-full border border-muted scrollbar-none overflow-x-hidden min-h-0'>
      <div className='h-full min-h-0 overflow-y-auto scrollbar-none'>
        <table className='w-full text-sm text-center '>
          <thead className='border bg-muted/70  rounded-xl'>
            <tr className='w-full divide-x divide-muted '>
              <th></th>
              <th>Time</th>
              <th>ao5</th>
              <th>ao12</th>
              <th></th>
            </tr>
          </thead>
          <tbody className='w-full divide-y divide-muted '>
            {solves &&
              solves.solvesHistory.map((solve, index) => (
                <tr
                  className='w-full divide-x divide-muted text-center'
                  key={solve._id.toString()}
                >
                  <td className='text-center'>
                    <h1>{solves.solvesHistory.length - index}</h1>
                  </td>
                  <td>
                    <h1
                      className={`text-center ${lowests?.time.time === solve.time && 'text-green-400'} ${highest?.time.time === solve.time && 'text-red-400'}`}
                    >
                      {formatearTiempo('stop', solve.time)}
                    </h1>
                  </td>
                  <td>
                    <h1
                      className={`text-center ${lowests?.mo3 && lowests.ao5 === solve && 'text-green-400'} ${highest?.ao5 && highest.ao5.ao5 === solve.ao5 && 'text-red-400'}`}
                    >
                      {solve.ao5 ? formatearTiempo('stop', solve.ao5) : '-'}
                    </h1>
                  </td>
                  <td>
                    <h1
                      className={`text-center ${lowests?.ao5 && lowests.ao12 === solve && 'text-green-400'} ${highest?.ao12 && highest.ao12.ao12 === solve.ao12 && 'text-red-400'}`}
                    >
                      {solve.ao12 ? formatearTiempo('stop', solve.ao12) : '-'}
                    </h1>
                  </td>
                  <td>
                    <button onClick={() => handleDeleteSolve(solve._id.toString())}>X</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TimeTable
