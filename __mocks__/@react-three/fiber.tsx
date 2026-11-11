import React from 'react'

export const Canvas = ({ children }: { children: React.ReactNode }) => <div data-testid='three-canvas'>{children}</div>

export const useThree = jest.fn()
export const useFrame = jest.fn()
