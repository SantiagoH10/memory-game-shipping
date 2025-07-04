import { useEffect } from 'react'
import { Trophy, Brain, RotateCcw } from 'lucide-react'
import { useGameContext } from '../utils/gameContext.jsx'

export const GameOverlay = () => {
  const { state, dispatch, elapsedTime, formatTime, ACTIONS } = useGameContext()

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (
        event.key === 'Enter' &&
        (state.gameStatus === 'newGame' || state.gameStatus === 'gameOver')
      ) {
        dispatch({ type: ACTIONS.NEW_GAME })
      }
    }

    document.addEventListener('keydown', handleKeyPress)

    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [dispatch, ACTIONS, state.gameStatus])

  const isGameOver = state.gameStatus === 'gameOver'

  const totalCards = state.images.length ? state.images.length : 0
  const optimalMoves = totalCards + totalCards / (2 - 1)

  const efficiency =
    state.moves > 0 ? Math.round((optimalMoves / state.moves) * 100) : 0

  const isPerfectMemory = state.moves === optimalMoves

  return (
    <div className='absolute inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50'>
      <div className='bg-gradient-to-br from-slate-800 via-slate-900 to-black p-4 sm:p-6 lg:p-8 rounded-2xl shadow-2xl border border-slate-700 max-w-xs sm:max-w-md w-full mx-4 transform transition-all duration-300 hover:scale-105'>
        <div className='text-center mb-6 sm:mb-8'>
          <div
            className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg ${
              isGameOver
                ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                : 'bg-gradient-to-r from-blue-500 to-purple-600'
            }`}
          >
            {isGameOver ? (
              <Trophy className='w-6 h-6 sm:w-8 sm:h-8 text-white' />
            ) : (
              <Brain className='w-6 h-6 sm:w-8 sm:h-8 text-white' />
            )}
          </div>

          <h1
            className={`text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 bg-clip-text text-transparent ${
              isGameOver
                ? 'bg-gradient-to-r from-green-400 to-emerald-400'
                : 'bg-gradient-to-r from-blue-400 to-purple-400'
            }`}
          >
            {isGameOver ? 'Congratulations!' : 'MySociabble Memory'}
          </h1>

          <p className='text-slate-400 text-xs sm:text-sm'>
            {isGameOver
              ? 'You completed the memory game!'
              : 'Press Enter to start'}
          </p>
        </div>

        {isGameOver && (
          <div className='bg-slate-700/50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 border border-slate-600'>
            <div className='grid grid-cols-3 gap-2 sm:gap-4 text-center'>
              <div>
                <div className='text-lg sm:text-2xl font-bold text-white'>
                  {state.moves}
                </div>
                <div className='text-xs sm:text-sm text-slate-400'>Moves</div>
              </div>
              <div>
                <div className='text-lg sm:text-2xl font-bold text-white'>
                  {state.mistakes}
                </div>
                <div className='text-xs sm:text-sm text-slate-400'>
                  Mistakes
                </div>
              </div>
              <div>
                <div className='text-lg sm:text-2xl font-bold text-white'>
                  {formatTime(elapsedTime)}
                </div>
                <div className='text-xs sm:text-sm text-slate-400'>Time</div>
              </div>
            </div>

            <div className='mt-3 text-center'>
              {isPerfectMemory ? (
                <div className='flex items-center justify-center gap-2'>
                  <Brain className='w-4 h-4 sm:w-5 sm:h-5 text-purple-400' />
                  <span className='text-xs sm:text-sm font-medium text-purple-400'>
                    Perfect Memory!
                  </span>
                </div>
              ) : (
                <div className='space-y-1'>
                  <span
                    className={`text-xs sm:text-sm font-medium ${
                      state.mistakes <= 2
                        ? 'text-green-400'
                        : state.mistakes <= 5
                        ? 'text-yellow-400'
                        : 'text-orange-400'
                    }`}
                  >
                    {state.mistakes <= 2
                      ? 'Excellent memory!'
                      : state.mistakes <= 5
                      ? 'Good job!'
                      : 'Keep practicing!'}
                  </span>
                  <div className='text-xs text-slate-500'>
                    Optimal: {optimalMoves} moves ({efficiency}% efficiency)
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <button
          onClick={() => {
            dispatch({ type: ACTIONS.NEW_GAME })
          }}
          className={`w-full font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl transition-all duration-200 transform hover:scale-102 active:scale-98 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 sm:gap-3 group text-white ${
            isGameOver
              ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
          }`}
        >
          <RotateCcw className='w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-180 transition-transform duration-300' />
          <span className='text-sm sm:text-lg'>
            {isGameOver ? 'Play Again' : 'New Round'}
          </span>
        </button>

        <div className='mt-4 sm:mt-6 flex justify-center space-x-2'>
          <div
            className={`w-2 h-2 rounded-full animate-pulse ${
              isGameOver ? 'bg-green-500' : 'bg-blue-500'
            }`}
          ></div>
          <div
            className={`w-2 h-2 rounded-full animate-pulse delay-100 ${
              isGameOver ? 'bg-emerald-500' : 'bg-purple-500'
            }`}
          ></div>
          <div
            className={`w-2 h-2 rounded-full animate-pulse delay-200 ${
              isGameOver ? 'bg-teal-500' : 'bg-pink-500'
            }`}
          ></div>
        </div>

        <div
          className={`absolute inset-0 rounded-2xl pointer-events-none ${
            isGameOver
              ? 'bg-gradient-to-r from-green-500/5 to-emerald-500/5'
              : 'bg-gradient-to-r from-blue-500/5 to-purple-500/5'
          }`}
        ></div>
      </div>
    </div>
  )
}
