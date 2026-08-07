'use client'

import React, { useRef, useCallback, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import JEASINGS, { JEasing } from 'jeasings'
import * as THREE from 'three'
import Cubie from './Cubie'

// --- Types ---
export type BaseMove = 'L' | 'R' | 'U' | 'D' | 'F' | 'B'
export type SingleMove = BaseMove | `${BaseMove}'`
export type RotationAxis = 'x' | 'y' | 'z'

export interface MoveConfig {
  axis: RotationAxis
  limit: number
  mult: number
}

interface CubeProps {
  moveQueue: SingleMove[]
  onMoveComplete: () => void
}

const MOVE_CONFIGS: Record<SingleMove, MoveConfig> = {
  L: { axis: 'x', limit: -0.5, mult: 1 },
  "L'": { axis: 'x', limit: -0.5, mult: -1 },
  R: { axis: 'x', limit: 0.5, mult: -1 },
  "R'": { axis: 'x', limit: 0.5, mult: 1 },
  U: { axis: 'y', limit: 0.5, mult: -1 },
  "U'": { axis: 'y', limit: 0.5, mult: 1 },
  D: { axis: 'y', limit: -0.5, mult: 1 },
  "D'": { axis: 'y', limit: -0.5, mult: -1 },
  F: { axis: 'z', limit: 0.5, mult: -1 },
  "F'": { axis: 'z', limit: 0.5, mult: 1 },
  B: { axis: 'z', limit: -0.5, mult: 1 },
  "B'": { axis: 'z', limit: -0.5, mult: -1 },
}

function snapTransform(object: THREE.Object3D): void {
  object.position.x = Math.round(object.position.x)
  object.position.y = Math.round(object.position.y)
  object.position.z = Math.round(object.position.z)

  const euler = new THREE.Euler().setFromQuaternion(object.quaternion)
  const halfPi = Math.PI / 2
  euler.x = Math.round(euler.x / halfPi) * halfPi
  euler.y = Math.round(euler.y / halfPi) * halfPi
  euler.z = Math.round(euler.z / halfPi) * halfPi
  object.quaternion.setFromEuler(euler)
}

function resetCubeGroup(cubeGroup: THREE.Group, rotationGroup: THREE.Group): void {
  const children = [...rotationGroup.children].reverse()
  children.forEach(child => {
    cubeGroup.attach(child)
    snapTransform(child)
  })
  rotationGroup.quaternion.identity()
  rotationGroup.rotation.set(0, 0, 0)
}

function attachToRotationGroup(
  cubeGroup: THREE.Group,
  rotationGroup: THREE.Group,
  axis: RotationAxis,
  limit: number,
): void {
  const children = [...cubeGroup.children].reverse()
  children
    .filter(child => (limit < 0 ? child.position[axis] < limit : child.position[axis] > limit))
    .forEach(child => rotationGroup.attach(child))
}

function animateRotationGroup(
  rotationGroup: THREE.Group,
  axis: RotationAxis,
  multiplier: number,
  duration: number = 200,
  onComplete?: () => void,
): void {
  const targetRotation = rotationGroup.rotation[axis] + (Math.PI / 2) * multiplier

  new JEasing(rotationGroup.rotation)
    .to({ [axis]: targetRotation }, duration)
    .easing(JEASINGS.Cubic.InOut)
    .onComplete(() => {
      if (onComplete) onComplete()
    })
    .start()
}

export default React.memo(function Cube({ moveQueue, onMoveComplete }: CubeProps) {
  const cubeGroupRef = useRef<THREE.Group>(null)
  const rotationGroupRef = useRef<THREE.Group>(null)
  const isAnimating = useRef<boolean>(false)

  useFrame(() => {
    JEASINGS.update()
  })

  const performMove = useCallback((move: SingleMove, duration: number = 180, callback?: () => void) => {
    if (!cubeGroupRef.current || !rotationGroupRef.current) return

    const config = MOVE_CONFIGS[move]

    if (!config) {
      callback?.()
      return
    }

    isAnimating.current = true

    resetCubeGroup(cubeGroupRef.current, rotationGroupRef.current)

    attachToRotationGroup(cubeGroupRef.current, rotationGroupRef.current, config.axis, config.limit)

    animateRotationGroup(rotationGroupRef.current, config.axis, config.mult, duration, () => {
      if (cubeGroupRef.current && rotationGroupRef.current) {
        resetCubeGroup(cubeGroupRef.current, rotationGroupRef.current)
      }

      isAnimating.current = false
      callback?.()
    })
  }, [])

  useEffect(() => {
    if (moveQueue.length > 0 && !isAnimating.current) {
      const nextMove = moveQueue[0]

      performMove(nextMove, 200, () => {
        onMoveComplete()
      })
    }
  }, [moveQueue, performMove, onMoveComplete])

  const cubiePositions = useMemo(() => {
    const coords = [-1, 0, 1] as const
    const list: Array<[number, number, number]> = []

    coords.forEach(x => {
      coords.forEach(y => {
        coords.forEach(z => {
          list.push([x, y, z])
        })
      })
    })

    return list
  }, [])

  return (
    <>
      <group ref={cubeGroupRef}>
        {cubiePositions.map(pos => (
          <Cubie
            key={pos.join(',')}
            position={pos}
          />
        ))}
      </group>

      <group ref={rotationGroupRef} />
    </>
  )
})
