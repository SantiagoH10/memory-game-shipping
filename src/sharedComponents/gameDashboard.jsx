import { useGameContext } from '../utils/gameContext.jsx'
import { formatTime } from '../utils/helpers.js'

export function GameDashboard() {
  const {
    state,
    dispatch,
    elapsedTime,
    gridSize,
    isValidGrid,
    rowLabels,
    columnLabels,
    formatTime,
    ACTIONS,
  } = useGameContext()
  return (
    <div className='inset-0 p-1 sm:p-2 m-1 mb-2 sm:mb-3 bg-opacity-75 backdrop-blur-sm flex flex-col items-center justify-center z-50 gap-2 sm:gap-4'>
      <div className='flex justify-center items-center gap-2 sm:gap-4 flex-wrap'>
        <div
          className='px-3 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg w-[100px] sm:w-[140px] h-12 sm:h-14 flex items-center justify-center'
          style={{
            backgroundColor: '#096B68',
            borderColor: '#096B68',
            borderWidth: '2px',
          }}
        >
          <span
            className='text-sm sm:text-lg font-bold'
            style={{ color: '#FFFBDE' }}
          >
            Moves: {state.moves}
          </span>
        </div>

        <div
          className='px-3 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg w-[100px] sm:w-[140px] h-12 sm:h-14 flex items-center justify-center'
          style={{
            backgroundColor: '#90D1CA',
            borderColor: '#90D1CA',
            borderWidth: '2px',
          }}
        >
          <span
            className='text-lg sm:text-2xl'
            style={{ color: '#096B68' }}
          >
            {formatTime(elapsedTime)}
          </span>
        </div>

        <div
          className='px-3 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg w-[100px] sm:w-[140px] h-12 sm:h-14 flex items-center justify-center'
          style={{
            backgroundColor: '#096B68',
            borderColor: '#096B68',
            borderWidth: '2px',
          }}
        >
          <span
            className='text-sm sm:text-lg font-bold'
            style={{ color: '#FFFBDE' }}
          >
            Mistakes: {state.mistakes}
          </span>
        </div>
      </div>

      <div
        className='px-2 sm:px-4 py-1 sm:py-2 rounded-lg shadow-md w-[35px] sm:w-[45px] h-[35px] sm:h-[45px] flex items-center justify-center'
        style={{
          backgroundColor: '#FFFBDE',
          borderColor: '#FFFBDE',
          borderWidth: '2px',
        }}
      >
        <span
          className='text-lg sm:text-xl font-bold'
          style={{ color: '#096B68' }}
        >
          {state.coords || '\u00A0'}
        </span>
      </div>
    </div>
  )
}