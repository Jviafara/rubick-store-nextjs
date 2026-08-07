'use client'

import CubeScrambler from '@/components/CubeScrambler'
import SolvesHistory from '@/components/SolvesHistory'
import { addNewSolve, formatearTiempo } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'
import { MdScreenshotMonitor } from 'react-icons/md'

const TimerPage = () => {
  const [segundos, setSegundos] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [ready, setReady] = useState(false)
  const [timeLeft, setTimeLeft] = useState(15)
  const [finalTime, setFinalTime] = useState(0)
  const [isInspectionRunning, setInspectionRunning] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isPressedRef = useRef(false)
  const isRunningRef = useRef(isRunning)
  const inspection = true
  const inspectionRef = useRef(inspection)
  const readyRef = useRef(ready)
  const isInspectionRunningRef = useRef(isInspectionRunning)
  const timeLeftRef = useRef(timeLeft)
  const [scramble, setScramble] = useState('')
  const [scrambleHistory, setScrambleHistory] = useState<string[]>([])

  useEffect(() => {
    isRunningRef.current = isRunning
  }, [isRunning])

  useEffect(() => {
    inspectionRef.current = inspection
  }, [inspection])

  useEffect(() => {
    readyRef.current = ready
  }, [ready])

  useEffect(() => {
    isInspectionRunningRef.current = isInspectionRunning
  }, [isInspectionRunning])

  useEffect(() => {
    timeLeftRef.current = timeLeft
  }, [timeLeft])

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>

    if (isRunning) {
      intervalId = setInterval(() => {
        setSegundos(prevSegundos => prevSegundos + 0.01)
      }, 10)
    }
    if (timeLeft <= 0) return

    if (isInspectionRunning) {
      intervalId = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    }

    return () => {
      clearInterval(intervalId)
    }
  }, [isRunning, isInspectionRunning, timeLeft])

  useEffect(() => {
    const cleanupLongPress = () => {
      isPressedRef.current = false
      setReady(false)
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== ' ') return
      if (isPressedRef.current) return
      isPressedRef.current = true
      timerRef.current = setTimeout(() => {
        setReady(true)
      }, 300)
    }

    const handleKeyup = async (event: KeyboardEvent) => {
      event.preventDefault() // Stops page scroll
      if (event.key !== ' ') return
      if (inspectionRef.current) {
        if (!isInspectionRunningRef.current && !isRunningRef.current) {
          cleanupLongPress()
          setSegundos(0)
          setInspectionRunning(true)
          setFinalTime(segundos)
          return
        }
        if (isInspectionRunningRef.current && readyRef.current) {
          cleanupLongPress()
          setInspectionRunning(false)
          setIsRunning(true)
          setFinalTime(segundos)
          setTimeLeft(15)

          if (timeLeftRef.current <= 0) {
            setSegundos(2)
          }
          return
        }
        if (isRunningRef.current) {
          cleanupLongPress()
          setInspectionRunning(false)
          setIsRunning(false)
          await addNewSolve(segundos, scramble)
          setFinalTime(segundos)
          return
        }
      }

      cleanupLongPress()
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyup)

    return () => {
      document.removeEventListener('keyup', handleKeyup)
      document.removeEventListener('keydown', handleKeyDown)
      isPressedRef.current = false
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [segundos, scramble])

  return (
    <>
      <div className='flex flex-col items-center gap-8 w-full p-8 text-center text-xl uppercase font-plus-jakarta-sans font-semibold lg:hidden'>
        <MdScreenshotMonitor size={48} />
        <h1>Onli available on desktop or bigger screens!!!</h1>
      </div>
      <div className='text-main w-screen max-h-screen h-[calc(100vh-76px)] max-w-screen hidden lg:flex items-center justify-center '>
        <section className={`${isRunning || isInspectionRunning ? 'hidden' : ''}`}>
          <SolvesHistory time={finalTime} />
        </section>
        <div className='relative not-only-of-type:flex flex-col w-full h-full items-center'>
          <section>
            {!isRunning && !isInspectionRunning && (
              <CubeScrambler
                scramble={scramble}
                setScramble={setScramble}
                scrambleHistory={scrambleHistory}
                setScrambleHistory={setScrambleHistory}
              />
            )}
          </section>
          <section className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
            <p className='flex items-center'>
              <strong
                style={{
                  fontFamily: 'Courier, sans-serif',
                }}
                className={`text-[12rem] font-bold text-main ${isInspectionRunning && ready && 'text-green-500!'} ${timeLeft < 5 && 'text-red-500'}`}
              >
                {isRunning && formatearTiempo('running', segundos)}
                {isInspectionRunning && formatearTiempo('sec', segundos, timeLeft)}
                {!isRunning && !isInspectionRunning && formatearTiempo('stop', segundos)}
              </strong>
              {timeLeft <= 0 && <strong className='text-red-500 text-[4rem]'>+2</strong>}
            </p>
          </section>
        </div>
      </div>
    </>
  )
}

export default TimerPage
