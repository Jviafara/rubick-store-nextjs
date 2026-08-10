'use client'

import { ScrambleGeneratorProps } from '@/lib/types'
import { useState, useEffect } from 'react'

export default function ScrambleGenerator({ scramble, setScramble, scrambleHistory }: ScrambleGeneratorProps) {
  const [lastSave, setLastSave] = useState('')

  async function fetchScramble() {
    const res = await fetch(`/api/scramble?type=${'333'}`)
    const data = await res.json()
    if (data) {
      setScramble(data)
      scrambleHistory.push(data)
      if (scrambleHistory.length >= 11) scrambleHistory.shift()
    }
  }

  async function prevScramble() {
    if (scramble === scrambleHistory[0]) {
      setLastSave(scramble)
      return
    }
    setScramble(scrambleHistory[scrambleHistory.findIndex(s => s === scramble) - 1])
  }

  async function nextScramble() {
    if (scramble === scrambleHistory[scrambleHistory.length - 1]) {
      fetchScramble()
    } else {
      setScramble(scrambleHistory[scrambleHistory.findIndex(s => s === scramble) + 1])
    }
  }

  useEffect(() => {
    let active = true
    async function loadScramble() {
      const res = await fetch(`/api/scramble?type=${''}`)
      const data = await res.json()
      if (active && data) {
        setScramble(data)
        console.log(scrambleHistory)
        scrambleHistory.push(data)
        if (scrambleHistory.length >= 11) scrambleHistory.shift()
      }
    }

    loadScramble()
    return () => {
      active = false
    }
  }, [scrambleHistory, setScramble])

  return (
    <div className='flex flex-col w-full items-center justify-center space-y-2'>
      <div className='flex items-center space-x-2'>
        <button
          onClick={prevScramble}
          disabled={lastSave === scramble}
          className='px-1 py-1 text-muted text-sm text-nowrap hover:bg-surface/60 rounded-full  disabled:text-muted  disabled:cursor-not-allowed'
        >
          Prev Scramble
        </button>
        <p>/</p>
        <button
          onClick={nextScramble}
          className='px-1 py-1 text-muted text-sm text-nowrap hover:bg-surface/60 rounded-full'
        >
          Next Scramble
        </button>
      </div>
      <div className='w-fit h-fit flex items-center justify-center font-bold text-main text-2xl bg-surface/90 rounded-xl p-4 '>
        {scramble || 'Generating...'}
      </div>
    </div>
  )
}
