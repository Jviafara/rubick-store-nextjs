import { useSession } from '@/lib/auth/auth-client'
import { Averages, ISolves } from '@/lib/types'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import TimeTable from './TimeTable'
import AveragesTable from './AveragesTable'
import { clearSolveHistory, findHighest, findLowest, getSolves, removeSolve } from '@/lib/utils'

const SolvesHistory = ({ time }: { time: number }) => {
  const { data: session } = useSession()
  const [solves, setSolves] = useState<ISolves>()
  const [lowests, setLowests] = useState<Averages>()
  const [highest, setHighest] = useState<Averages>()

  const refreshSolves = async () => {
    const res = await getSolves()
    if (!res) return

    if (res.solvesHistory.length > 0) {
      setHighest(findHighest(res.solvesHistory))
      setLowests(findLowest(res.solvesHistory))
    } else {
      setHighest(undefined)
      setLowests(undefined)
    }

    setSolves(res)
  }

  useEffect(() => {
    const refreshSolves = async () => {
      const res = await getSolves()
      if (!res) return

      if (res.solvesHistory.length > 0) {
        setHighest(findHighest(res.solvesHistory))
        setLowests(findLowest(res.solvesHistory))
      } else {
        setHighest(undefined)
        setLowests(undefined)
      }

      setSolves(res)
    }
    refreshSolves()
  }, [time])

  const handleDeleteSolve = async (id: string) => {
    await removeSolve(id)
    await refreshSolves()
  }

  const handleClearTimes = async () => {
    await clearSolveHistory()
    await refreshSolves()
  }

  return (
    <aside className='flex flex-col min-w-fit h-[calc(100vh-76px)] overflow-y-hidden w-[30%] bg-surface/70 px-4 py-8 space-y-4'>
      <div className='w-full flex-none flex flex-col'>
        <h1 className='text-2xl text-center'>Solves History</h1>
        {!session?.user && (
          <h1 className='text-main mt-4'>
            To see your solves history and averages
            <Link
              href={'/sign-in'}
              className='underline text-primary font-plus-jakarta-sans ml-2'
            >
              Sign In
            </Link>
            .
          </h1>
        )}
      </div>
      <div className='flex flex-col w-full space-y-4 min-h-0 flex-1 overflow-hidden'>
        <AveragesTable
          current={solves?.solvesHistory[0]}
          lowests={lowests}
          handleClearTimes={handleClearTimes}
        />
        <div className='flex-1 min-h-0 overflow-hidden'>
          <TimeTable
            solves={solves}
            lowests={lowests}
            highest={highest}
            handleDeleteSolve={handleDeleteSolve}
          />
        </div>
      </div>
    </aside>
  )
}

export default SolvesHistory
