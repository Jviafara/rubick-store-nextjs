'use client'

import React, { useRef, useState, useCallback, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import CubeSolver from 'cubejs'
import Cube from './Cube'
import { FaCogs } from 'react-icons/fa'
import Scrambler from './Scrambler'

// Initialize CubeSolver lookup tables
CubeSolver.initSolver()

// --- Types ---
export type BaseMove = 'L' | 'R' | 'U' | 'D' | 'F' | 'B'
export type SingleMove = BaseMove | `${BaseMove}'`
export type ScrambleMove = SingleMove | `${BaseMove}2`

/**
 * Parses scramble or solution strings into SingleMove array
 */
export function parseMoveString(moveStr: string): SingleMove[] {
  if (!moveStr) return []
  const tokens = moveStr.trim().split(/\s+/)
  const moves: SingleMove[] = []

  const MOVE_CONFIGS: Record<string, boolean> = {
    L: true,
    "L'": true,
    R: true,
    "R'": true,
    U: true,
    "U'": true,
    D: true,
    "D'": true,
    F: true,
    "F'": true,
    B: true,
    "B'": true,
  }

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

  const [openScrambler, setOpenScrambler] = useState(false)

  // Track abstract cube state using cubejs solver
  const cubeStateRef = useRef(new CubeSolver())
  const currentAnimationRef = useRef<'idle' | 'scramble' | 'solve'>('idle')

  useEffect(() => {
    let active = true
    async function loadScramble() {
      const res = await fetch(`/api/scramble?type=${''}`)
      const data = await res.json()
      if (active && data) {
        setScrambleInput(data)
      }
    }

    loadScramble()
    return () => {
      active = false
    }
  }, [])

  const handleScramble = async () => {
    const parsedMoves = parseMoveString(scrambleInput)

    if (parsedMoves.length === 0) return

    currentAnimationRef.current = 'scramble'
    cubeStateRef.current.move(scrambleInput)

    setSolutionMoves('')
    setQueue(prev => [...prev, ...parsedMoves])
  }

  const handleSolve = () => {
    const solutionString = cubeStateRef.current.solve()

    const parsedSolution = parseMoveString(solutionString)
    if (parsedSolution.length === 0) return

    setSolutionMoves(solutionString)

    if (parsedSolution.length > 0) {
      currentAnimationRef.current = 'solve'
      cubeStateRef.current.move(solutionString)

      setQueue(prev => [...prev, ...parsedSolution])
    }
  }

  async function loadScramble() {
    const res = await fetch(`/api/scramble?type=${''}`)
    const data = await res.json()
    if (data) {
      setScrambleInput(data)
    }
  }

  const handleMoveComplete = useCallback(() => {
    setQueue(prev => {
      const next = prev.slice(1)

      if (next.length === 0 && currentAnimationRef.current === 'solve') {
        loadScramble()
      }

      if (next.length === 0 && currentAnimationRef.current !== 'idle') {
        currentAnimationRef.current = 'idle'
      }

      return next
    })
  }, [])

  return (
    <div className='w-full max-w-screen h-[calc(100vh-76px)] relative'>
      <div
        className={`absolute ${openScrambler ? 'w-full' : 'w-fit'} max-w-[25%] top-20 right-20 z-50 flex flex-col bg-surface/70 py-3 px-4 rounded-2xl bg-blur-lg gap-4`}
      >
        <div className='w-full flex justify-end'>
          <button
            onClick={() => setOpenScrambler(!openScrambler)}
            className='hover:text-primary cursor-pointer'
          >
            <FaCogs size={32} />
          </button>
        </div>

        {openScrambler && (
          <Scrambler
            scrambleInput={scrambleInput}
            setScrambleInput={setScrambleInput}
            handleSolve={handleSolve}
            handleScramble={handleScramble}
            queue={queue}
            solutionMoves={solutionMoves}
          />
        )}
      </div>

      <Canvas
        camera={{
          position: [5.2, 5.2, 5.2],
          fov: 38,
        }}
        shadows
      >
        <color
          attach='transparent'
          args={['#00000000']}
        />
        <Environment
          preset='studio'
          environmentIntensity={0.45}
        />

        <ambientLight intensity={0.45} />

        <directionalLight
          position={[6, 8, 6]}
          intensity={2.2}
          castShadow
        />

        <directionalLight
          position={[-5, 3, -4]}
          intensity={0.7}
          castShadow
        />

        <group rotation={[0.08, -0.15, 0]}>
          <Cube
            moveQueue={queue}
            onMoveComplete={handleMoveComplete}
          />
        </group>

        <OrbitControls
          makeDefault
          enablePan={false}
          minDistance={7}
          maxDistance={14}
        />
      </Canvas>
    </div>
  )
}
