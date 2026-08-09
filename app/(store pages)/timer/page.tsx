'use client'

import CubeScrambler from '@/components/CubeScrambler'
import { useEffect, useRef, useState } from 'react'

const TimerPage = () => {
  const [segundos, setSegundos] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [inspection, setInspection] = useState(true)
  const [ready, setReady] = useState(false)
  const [timeLeft, setTimeLeft] = useState(15)
  const [isInspectionRunning, setInspectionRunning] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isPressedRef = useRef(false)
  const isRunningRef = useRef(isRunning)
  const inspectionRef = useRef(inspection)
  const readyRef = useRef(ready)
  const isInspectionRunningRef = useRef(isInspectionRunning)
  const timeLeftRef = useRef(timeLeft)

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
        setSegundos(prevSegundos => prevSegundos + 0.1)
      }, 100) // Cambiado a 100ms para que avance rápido
    }
    if (timeLeft <= 0) return

    if (isInspectionRunning) {
      intervalId = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000) // Cambiado a 100ms para que avance rápido
    }

    return () => {
      clearInterval(intervalId)
    }
  }, [isRunning, isInspectionRunning, timeLeft])

  const reiniciarCronometro = () => {
    setSegundos(0)
    setTimeLeft(15)
    setIsRunning(false)
  }

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
      if (isPressedRef.current) return // Prevents auto-repeat triggers
      isPressedRef.current = true
      timerRef.current = setTimeout(() => {
        setReady(true)
      }, 500)
    }

    const handleKeyup = (event: KeyboardEvent) => {
      event.preventDefault() // Stops page scroll
      if (event.key !== ' ') return
      if (inspectionRef.current) {
        if (!isInspectionRunningRef.current && !isRunningRef.current) {
          cleanupLongPress()
          reiniciarCronometro()
          setInspectionRunning(true)
          // iniciarDetenerInspectionCronometro()
          return
        }
        if (isInspectionRunningRef.current && readyRef.current) {
          cleanupLongPress()
          setInspectionRunning(false)
          reiniciarCronometro()
          setIsRunning(true)

          if (timeLeftRef.current <= 0) {
            setSegundos(2)
          }
          return
        }
        if (isRunningRef.current) {
          cleanupLongPress()
          setInspectionRunning(false)
          setIsRunning(false)
          return
        }
      }

      cleanupLongPress()
      // reiniciarCronometro()
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
  }, [])

  // Formatear los segundos en MM:SS.d
  const formatearTiempo = (type: string) => {
    if (type === 'main') {
      const minutos = Math.floor((segundos % 3600) / 60)
      const segundosRestantes = Math.floor(segundos % 60)
      const decimal = Math.floor((segundos - Math.floor(segundos)) * 10)

      const formatoMinutos = minutos.toString().padStart(2, '0')
      const formatoSegundos = segundosRestantes.toString().padStart(2, '0')
      const formatoDecimal = decimal.toString()

      return `${formatoMinutos !== '00' ? formatoMinutos + ':' : ''}${formatoSegundos}.${formatoDecimal}`
    }

    const segundosRestantes = timeLeft % 60
    const formatoSegundos = segundosRestantes.toString().padStart(2, '0')
    return `${formatoSegundos}`
  }

  return (
    <div className='text-main w-screen max-h-screen h-[calc(100vh-76px)] max-w-screen flex items-center justify-center'>
      <div className='flex flex-col w-full h-full items-center'>
        <section>
          <CubeScrambler />
        </section>
        <section className=''>
          <p className='flex items-center'>
            <strong
              style={{
                fontFamily: 'Courier, sans-serif',
              }}
              className={`text-[12rem] font-bold text-main ${isInspectionRunning && ready && 'text-green-500!'} ${timeLeft < 10 && 'text-red-500'}`}
            >
              {isRunning && formatearTiempo('main')}
              {isInspectionRunning && formatearTiempo('sec')}
              {!isRunning && !isInspectionRunning && formatearTiempo('main')}
            </strong>
            {timeLeft <= 0 && <strong className='text-red-500 text-[4rem]'>+2</strong>}
          </p>
        </section>
        <button onClick={reiniciarCronometro}>Reiniciar</button>
      </div>
    </div>
  )
}

export default TimerPage
