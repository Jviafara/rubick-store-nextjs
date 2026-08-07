'use client'

import React from 'react'
import { RoundedBox, useTexture } from '@react-three/drei'

export interface CubieProps {
  position: [number, number, number]
}

const CUBE_COLORS = {
  orange: '#FF5800',
  red: '#D90429',
  white: '#F5F5F5',
  yellow: '#FFD500',
  green: '#00A651',
  blue: '#0057B8',
  black: '#151515',
}

export default React.memo(function Cubie({ position }: CubieProps) {
  const stickerSize = 0.86
  const stickerOffset = 0.42

  const logoTexture = useTexture('/assets/logo.png')

  return (
    <group position={position}>
      <RoundedBox
        args={[0.9, 0.9, 0.9]}
        radius={0.08}
        smoothness={6}
        bevelSegments={5}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color='#151515'
          roughness={0.22}
          metalness={0.02}
        />
      </RoundedBox>

      {position[0] === 1 && (
        <mesh
          position={[stickerOffset, 0, 0]}
          rotation={[0, -Math.PI / 2, 0]}
        >
          <RoundedBox
            args={[stickerSize, stickerSize, 0.08]}
            radius={0.06}
            smoothness={5}
            bevelSegments={4}
          >
            <meshStandardMaterial
              color={CUBE_COLORS.orange}
              roughness={0.18}
              metalness={0.02}
            />
          </RoundedBox>
        </mesh>
      )}

      {position[0] === -1 && (
        <mesh
          position={[-stickerOffset, 0, 0]}
          rotation={[0, Math.PI / 2, 0]}
        >
          <RoundedBox
            args={[stickerSize, stickerSize, 0.08]}
            radius={0.06}
            smoothness={5}
            bevelSegments={4}
          >
            <meshStandardMaterial
              color={CUBE_COLORS.red}
              roughness={0.18}
              metalness={0.02}
            />
          </RoundedBox>
        </mesh>
      )}

      {position[1] === 1 && (
        <mesh
          position={[0, stickerOffset, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <RoundedBox
            args={[stickerSize, stickerSize, 0.08]}
            radius={0.06}
            smoothness={5}
            bevelSegments={4}
          >
            <meshStandardMaterial
              color={CUBE_COLORS.white}
              roughness={0.18}
              metalness={0.02}
            />
            {position[0] === 0 && position[1] === 1 && position[2] === 0 && (
              <mesh position={[0, 0, 0.05]}>
                <planeGeometry args={[0.62, 0.62]} />
                <meshStandardMaterial
                  map={logoTexture}
                  transparent
                  alphaTest={0.05}
                  roughness={0.25}
                  metalness={0}
                />
              </mesh>
            )}
          </RoundedBox>
        </mesh>
      )}

      {position[1] === -1 && (
        <mesh
          position={[0, -stickerOffset, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <RoundedBox
            args={[stickerSize, stickerSize, 0.08]}
            radius={0.06}
            smoothness={5}
            bevelSegments={4}
          >
            <meshStandardMaterial
              color={CUBE_COLORS.yellow}
              roughness={0.18}
              metalness={0.02}
            />
          </RoundedBox>
        </mesh>
      )}

      {position[2] === 1 && (
        <mesh position={[0, 0, stickerOffset]}>
          <planeGeometry args={[stickerSize, stickerSize]} />
          <RoundedBox
            args={[stickerSize, stickerSize, 0.08]}
            radius={0.06}
            smoothness={5}
            bevelSegments={4}
          >
            <meshStandardMaterial
              color={CUBE_COLORS.green}
              roughness={0.18}
              metalness={0.02}
            />
          </RoundedBox>
        </mesh>
      )}

      {position[2] === -1 && (
        <mesh
          position={[0, 0, -stickerOffset]}
          rotation={[0, Math.PI, 0]}
        >
          <RoundedBox
            args={[stickerSize, stickerSize, 0.08]}
            radius={0.06}
            smoothness={5}
            bevelSegments={4}
          >
            <meshStandardMaterial
              color={CUBE_COLORS.blue}
              roughness={0.18}
              metalness={0.02}
            />
          </RoundedBox>
        </mesh>
      )}
    </group>
  )
})
