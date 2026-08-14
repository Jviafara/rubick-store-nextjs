import { SingleMove } from './RubiksCube'

interface ScrambrlerProps {
  scrambleInput: string
  setScrambleInput: (vale: string) => void
  handleSolve: () => void
  handleScramble: () => void
  queue: SingleMove[]
  solutionMoves: string
}

const Scrambler = ({
  scrambleInput,
  setScrambleInput,
  handleSolve,
  handleScramble,
  queue,
  solutionMoves,
}: ScrambrlerProps) => {
  return (
    <div className='w-full flex flex-col gap-4 items-center justify-between'>
      <input
        type='text'
        value={scrambleInput}
        onChange={e => setScrambleInput(e.target.value)}
        placeholder='Enter scramble notation'
        className='text-main rounded-2xl px-4 py-2 bg-foreground-accent w-full border border-primary focus:outline-none focus:ring-0'
      />
      <div className='flex gap-2 items-center justify-end text-nowrap w-full'>
        <button
          onClick={handleScramble}
          disabled={queue.length > 0}
          className='border-2 border-secondary hover:bg-secondary/80 text-center uppercase px-4 py-2 rounded-2xl w-fit font-bold font-plus-jakarta-sans cursor-pointer'
        >
          Scramble
        </button>

        <button
          onClick={handleSolve}
          disabled={queue.length > 0}
          className='border-2 border-primary hover:bg-primary/80  text-center uppercase px-4 py-2 rounded-2xl w-fit font-bold font-plus-jakarta-sans cursor-pointer'
        >
          {queue.length > 0 ? `Animating (${queue.length})...` : 'Solve Cube'}
        </button>
      </div>
      {solutionMoves && (
        <div className='text-main rounded-2xl px-4 py-2 bg-foreground-accent w-full border border-primary flex flex-col gap-2'>
          <span className='text-lg text-muted'>Solution:</span>
          <h1 className='text-wrap'>{solutionMoves}</h1>
        </div>
      )}
    </div>
  )
}

export default Scrambler
