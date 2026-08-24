declare module 'cubejs' {
  class Cube {
    constructor(state?: string)

    static initSolver(): void
    static random(): Cube

    move(algorithm: string | string[]): void
    solve(): string

    randomize(): void
    identity(): void
    isSolved(): boolean

    asString(): string
    toJSON(): {
      cp: number[]
      co: number[]
      ep: number[]
      eo: number[]
    }

    clone(): Cube
  }

  export default Cube
}
