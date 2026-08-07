'use client'

import { ScrambleGeneratorProps } from '@/lib/types'
import { useState, useEffect } from 'react'

export default function ScrambleGenerator({
  scramble,
  setScramble,
  scrambleHistory,
  setScrambleHistory,
}: ScrambleGeneratorProps) {
  const [lastSave, setLastSave] = useState('')

  async function fetchScramble() {
    const res = await fetch(`/api/scramble?type=${'333'}`)
    const data = await res.json()
    if (data) {
      setScramble(data)
      setScrambleHistory(prev => {
        const next = [...prev, data]
        if (next.length > 10) next.shift()
        return next
      })
    }
  }

  async function prevScramble() {
    const index = scrambleHistory.findIndex(s => s === scramble)
    if (index <= 0) {
      setLastSave(scramble)
      return
    }
    setScramble(scrambleHistory[index - 1])
  }

  async function nextScramble() {
    const lastIndex = scrambleHistory.length - 1
    const index = scrambleHistory.findIndex(s => s === scramble)
    if (index === -1 || index === lastIndex) {
      fetchScramble()
      return
    }
    setScramble(scrambleHistory[index + 1])
  }

  useEffect(() => {
    let active = true
    async function loadScramble() {
      const res = await fetch(`/api/scramble?type=${''}`)
      const data = await res.json()
      if (active && data) {
        setScramble(data)
        setScrambleHistory(prev => {
          const next = [...prev, data]
          if (next.length > 10) next.shift()
          return next
        })
      }
    }

    loadScramble()
    return () => {
      active = false
    }
  }, [setScramble, setScrambleHistory])

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
