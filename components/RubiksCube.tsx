'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei'
import CubeSolver from 'cubejs'
import * as THREE from 'three'
import { FaCube, FaRandom, FaRedoAlt, FaRocket, FaTrophy } from 'react-icons/fa'

import Cube, { BaseMove, SingleMove } from './Cube'
import { useWindowWidth } from '@/lib/hooks/useWindowWidth'
import HeroHeading from './HeroHeading'
import HeroFeatureRow from './HeroFeatureRow'
import { MOVE_CONFIGS } from '@/lib/constants'
import { CubeStatus } from '@/lib/types'

CubeSolver.initSolver()

export function parseMoveString(moveStr: string): SingleMove[] {
  if (!moveStr) return []

  const tokens = moveStr.trim().split(/\s+/)

  const moves: SingleMove[] = []

  tokens.forEach(token => {
    if (token.endsWith('2')) {
      const baseMove = token.slice(0, -1) as BaseMove

      if (MOVE_CONFIGS[baseMove]) {
        moves.push(baseMove, baseMove)
      }
    } else if (token in MOVE_CONFIGS) {
      moves.push(token as SingleMove)
    }
  })

  return moves
}

export default function RubiksCube() {
  const [scrambleInput, setScrambleInput] = useState('')
  const [solutionMoves, setSolutionMoves] = useState('')
  const [queue, setQueue] = useState<SingleMove[]>([])
  const [status, setStatus] = useState<CubeStatus>('ready')

  const cubeStateRef = useRef(new CubeSolver())
  const currentAnimationRef = useRef<'idle' | 'scramble' | 'solve'>('idle')

  const width = useWindowWidth() || 1024

  const isBusy = queue.length > 0

  const cubeScale = useMemo(() => {
    if (width < 390) return 0.45
    if (width < 480) return 0.5
    if (width < 640) return 0.56
    if (width < 768) return 0.64
    if (width < 1024) return 0.7
    if (width < 1280) return 0.78
    if (width < 1536) return 0.86

    return 0.94
  }, [width])

  const cameraPosition = useMemo<[number, number, number]>(() => {
    if (width < 480) return [5.8, 5.8, 5.8]

    if (width < 768) return [5.6, 5.6, 5.6]

    if (width < 1280) return [5.4, 5.4, 5.4]

    return [5.2, 5.2, 5.2]
  }, [width])

  const loadScramble = useCallback(async () => {
    try {
      const res = await fetch('/api/scramble?type=')

      if (!res.ok) return

      const data = await res.json()

      if (data) {
        setScrambleInput(data)
      }
    } catch {
      // Silently keep the current scramble.
    }
  }, [])

  useEffect(() => {
    const firstScramble = async () => {
      await loadScramble()
    }
    firstScramble()
  }, [loadScramble])

  const handleScramble = useCallback(() => {
    if (isBusy) return

    const parsedMoves = parseMoveString(scrambleInput)

    if (parsedMoves.length === 0) return

    currentAnimationRef.current = 'scramble'

    cubeStateRef.current.move(scrambleInput)

    setSolutionMoves('')
    setStatus('scrambling')
    setQueue(parsedMoves)
  }, [isBusy, scrambleInput])

  const handleSolve = useCallback(() => {
    if (isBusy) return

    const solutionString = cubeStateRef.current.solve()
    const parsedSolution = parseMoveString(solutionString)

    if (parsedSolution.length === 0) {
      setStatus('solved')
      return
    }

    currentAnimationRef.current = 'solve'

    cubeStateRef.current.move(solutionString)

    setSolutionMoves(solutionString)
    setStatus('solving')
    setQueue(parsedSolution)
  }, [isBusy])

  const handleReset = useCallback(() => {
    window.location.reload()
  }, [])

  const handleMoveComplete = useCallback(() => {
    setQueue(prev => {
      const next = prev.slice(1)

      if (next.length === 0) {
        const mode = currentAnimationRef.current

        currentAnimationRef.current = 'idle'

        if (mode === 'solve') {
          setStatus('solved')
          loadScramble()
        } else if (mode === 'scramble') {
          setStatus('ready')
        }
      }

      return next
    })
  }, [loadScramble])

  const statusConfig = {
    ready: {
      label: 'Ready',
      className: 'text-primary',
      dot: 'bg-primary',
    },
    scrambling: {
      label: 'Scrambling',
      className: 'text-secondary',
      dot: 'bg-secondary animate-pulse',
    },
    solving: {
      label: 'Solving',
      className: 'text-priamry',
      dot: 'bg-primary animate-pulse',
    },
    solved: {
      label: 'Solved',
      className: 'text-tertiary',
      dot: 'bg-tertiary',
    },
  }[status]

  const solutionCount = parseMoveString(solutionMoves).length

  return (
    <section className='relative isolate w-full overflow-hidden '>
      {/* Background glow */}
      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-0 -z-20'
      >
        <div className='absolute left-[8%] top-[20%] h-105 w-105 rounded-full bg-primary/8 blur-[120px]' />

        <div className='absolute right-[8%] top-[25%] h-115 w-115 rounded-full bg-secondary/8 blur-[140px]' />

        <div className='absolute bottom-[-10%] left-[35%] h-90 w-90 rounded-full bg-purple-500/8 blur-[130px]' />
      </div>

      {/* Geometric background */}
      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-0 -z-10 opacity-40'
      >
        <div className='absolute left-[7%] top-[14%] h-52 w-52 rotate-45 border border-primary/10' />
        <div className='absolute right-[12%] top-[20%] h-64 w-64 -rotate-12 border border-secondary/10' />
        <div className='absolute bottom-[12%] left-[18%] h-40 w-40 rotate-12 border border-primary/10' />
      </div>

      <div className='mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8'>
        {/* Heading */}
        <HeroHeading />

        {/* Main experience */}
        <div className='grid items-center gap-5 xl:grid-cols-[250px_minmax(0,1fr)_250px]'>
          <section className='flex flex-col xl:flex-row gap-5 w-full col-span-2'>
            {/* LEFT PANEL */}
            <div className=' space-y-5  shrink h-full w-full xl:w-1/4 flex flex-col items-start xl:order-1'>
              {/* Status */}
              <div className='card-base rounded-2xl p-4 w-full'>
                <div className='mb-4 flex items-center gap-3'>
                  <div className='flex h-9 w-9 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary'>
                    <FaCube />
                  </div>

                  <div>
                    <h3 className='text-sm font-bold text-foreground'>CUBE STATUS</h3>

                    <p className='text-[10px] text-foreground/45'>Live state</p>
                  </div>
                </div>

                <div className='space-y-3'>
                  <div className='flex items-center justify-between text-xs'>
                    <span className='text-foreground/50'>Status</span>

                    <span className={`flex items-center gap-2 font-semibold ${statusConfig.className}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${statusConfig.dot}`} />

                      {statusConfig.label}
                    </span>
                  </div>

                  <div className='flex items-center justify-between text-xs'>
                    <span className='text-foreground/50'>Scramble</span>

                    <span className='font-semibold text-foreground'>{parseMoveString(scrambleInput).length}</span>
                  </div>

                  <div className='flex items-center justify-between text-xs'>
                    <span className='text-foreground/50'>Solution</span>

                    <span className='font-semibold text-foreground'>{solutionCount || '—'}</span>
                  </div>
                </div>
              </div>
              {/* Reset */}
              <button
                type='button'
                onClick={handleReset}
                className='flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface/50 text-xs font-bold text-foreground/60 transition hover:border-primary/30 hover:text-primary'
              >
                <FaRedoAlt />
                RESET EXPERIENCE
              </button>
            </div>

            {/* CENTER CUBE */}
            <div className='relative xl:order-2 w-full xl:w-3/4 min-h-115 overflow-hidden rounded-4xl border border-border/70 bg-surface/50 sm:min-h-140 lg:min-h-170'>
              {/* Inner ambient glow */}
              <div
                aria-hidden='true'
                className='pointer-events-none absolute left-1/2 top-1/2 h-[65%] w-[65%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-linear-to-r from-primary/10 via-transparent to-secondary/10 blur-3xl'
              />

              {/* Technical grid */}
              <div
                aria-hidden='true'
                className='pointer-events-none absolute inset-0 opacity-20'
                style={{
                  backgroundImage: 'linear-gradient(rgba(0,240,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,.08) 1px, transparent 1px)',
                  backgroundSize: '48px 48px',
                  maskImage: 'radial-gradient(circle at center, black 25%, transparent 75%)',
                  WebkitMaskImage: 'radial-gradient(circle at center, black 25%, transparent 75%)',
                }}
              />

              {/* Neon platform */}
              <div
                aria-hidden='true'
                className='pointer-events-none absolute left-1/2 bottom-[13%] h-24 w-[55%] -translate-x-1/2 rotate-1 rounded-[25%] border border-primary/60 bg-linear-to-r from-cyan-500/5 via-transparent to-secondary/10 shadow-[0_0_40px_rgba(0,240,255,0.18),0_0_70px_rgba(255,0,122,0.12)]'
                style={{
                  clipPath: 'polygon(12% 0, 88% 0, 100% 50%, 88% 100%, 12% 100%, 0 50%)',
                }}
              />

              <div
                aria-hidden='true'
                className='pointer-events-none absolute left-1/2 bottom-[15%] h-16 w-[40%] -translate-x-1/2 rounded-full bg-primary/10 blur-2xl'
              />

              {/* Canvas */}
              <div className='absolute inset-0'>
                <Canvas
                  camera={{
                    position: cameraPosition,
                    fov: 38,
                  }}
                  gl={{
                    alpha: true,
                    antialias: true,
                  }}
                  shadows={{
                    type: THREE.PCFShadowMap,
                  }}
                  dpr={[1, 1.8]}
                >
                  <Environment
                    preset='studio'
                    environmentIntensity={0.42}
                  />

                  <ambientLight intensity={0.38} />

                  <directionalLight
                    position={[6, 8, 6]}
                    intensity={2.4}
                    castShadow
                  />

                  {/* Cyan rim */}
                  <pointLight
                    position={[-4, 2, 4]}
                    color='#00F0FF'
                    intensity={14}
                    distance={9}
                  />

                  {/* Magenta rim */}
                  <pointLight
                    position={[4, 2, -3]}
                    color='#FF007A'
                    intensity={11}
                    distance={9}
                  />

                  {/* Blue fill */}
                  <pointLight
                    position={[-3, -2, -4]}
                    color='#387CFF'
                    intensity={7}
                    distance={8}
                  />
                  <group
                    rotation={[0.08, -0.15, 0]}
                    scale={cubeScale}
                  >
                    <Cube
                      moveQueue={queue}
                      onMoveComplete={handleMoveComplete}
                    />
                  </group>

                  <OrbitControls
                    makeDefault
                    enablePan={false}
                    enableZoom={false}
                    minPolarAngle={Math.PI / 3}
                    maxPolarAngle={(Math.PI * 2) / 3}
                    rotateSpeed={0.7}
                  />
                </Canvas>
              </div>

              {/* Cube interaction hint */}
              <div className='absolute bottom-6 left-1/2 z-20 -translate-x-1/2'>
                <div className='rounded-xl border border-border bg-surface/80 px-4 py-2.5 backdrop-blur-xl'>
                  <p className='flex items-center gap-2 whitespace-nowrap text-[10px] font-medium text-foreground/60 sm:text-xs'>
                    <span className='text-primary'>⌖</span>
                    Click & drag to rotate
                  </p>
                </div>
              </div>

              {/* Top-left badge */}
              <div className='absolute left-4 top-4 z-20 rounded-xl border border-primary/20 bg-surface/70 px-3 py-2 backdrop-blur-xl'>
                <div className='flex items-center gap-2'>
                  <span className={`h-2 w-2 rounded-full ${statusConfig.dot}`} />

                  <span className={`text-[10px] font-bold uppercase tracking-wider ${statusConfig.className}`}>{statusConfig.label}</span>
                </div>
              </div>

              {/* Top-right move state */}
              <div className='absolute right-4 top-4 z-20 rounded-xl border border-border bg-surface/70 px-3 py-2 backdrop-blur-xl'>
                <p className='text-[10px] text-foreground/40'>QUEUE</p>

                <p className='text-sm font-bold text-foreground'>{queue.length.toString().padStart(2, '0')}</p>
              </div>
            </div>
          </section>

          {/* RIGHT PANEL */}
          <div className='order-3 space-y-5 flex flex-col md:flex-row xl:flex-col gap-5 items-center md:items-stretch xl:items-start h-full w-full'>
            {/* Scramble */}
            <div className='card-base relative overflow-hidden rounded-2xl p-4 w-full h-full xl:h-fit flex flex-col justify-between'>
              <div className='mb-4 flex items-center  gap-3'>
                <div className='flex h-9 w-9 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary'>
                  <FaRandom />
                </div>

                <div>
                  <h3 className='text-sm font-bold tracking-wide text-foreground'>SCRAMBLE</h3>

                  <p className='text-[10px] text-foreground/45'>Current sequence</p>
                </div>
              </div>

              <div className='rounded-xl border border-border bg-black/10 p-3'>
                <p className='wrap-break-words text-xs leading-5 text-foreground/70'>{scrambleInput || 'Loading scramble...'}</p>
              </div>

              <button
                type='button'
                onClick={handleScramble}
                disabled={isBusy || !scrambleInput}
                className='gradient-button'
              >
                <FaRandom />
                SCRAMBLE CUBE
              </button>
            </div>

            {/* Solution */}
            <div className='card-base rounded-2xl p-4 w-full'>
              <div className='mb-4 flex items-center gap-3'>
                <div className='flex h-9 w-9 items-center justify-center rounded-xl border border-secondary/20 bg-secondary/10 text-fuchsia-300'>
                  <FaTrophy />
                </div>

                <div>
                  <h3 className='text-sm font-bold text-foreground'>SOLUTION</h3>

                  <p className='text-[10px] text-foreground/45'>Generated by CubeJS</p>
                </div>
              </div>

              <div className='min-h-25 rounded-xl border border-border bg-black/10 p-3'>
                {solutionMoves ? (
                  <p className='wrap-break-words text-xs leading-5 text-foreground/70'>{solutionMoves}</p>
                ) : (
                  <div className='flex min-h-18.5 items-center justify-center text-center'>
                    <p className='max-w-45 text-xs leading-5 text-foreground/40'>
                      Scramble the cube and press <span className='font-semibold text-primary'>Solve</span> to generate a solution.
                    </p>
                  </div>
                )}
              </div>

              <button
                type='button'
                onClick={handleSolve}
                disabled={isBusy}
                className='gradient-button'
              >
                <FaRocket />
                SOLVE CUBE
              </button>
            </div>
          </div>
        </div>

        {/* Small feature row */}
        <HeroFeatureRow />
      </div>
    </section>
  )
}
