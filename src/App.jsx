//#region Imports
import { useEffect, createContext, useContext } from 'react'

import { Play, RotateCcw, Trophy, Brain } from 'lucide-react'

import { useMemoryGame } from './hooks/useMemoryGame.js'

import ccLogo from './assets/cma.png'
import './App.css'

const IMAGE_SET_OPTIONS = [
  { title: 'Vessels', folderName: 'vessels', dim: '4x4' },
  { title: 'Containers', folderName: 'containers', dim: '6x6' },
  { title: 'Symbols', folderName: 'symbols', dim: '6x6' },
]
//#endregion

//#region MS header
function MySociabble() {
  return (
    <header className='w-full bg-ccblue shadow-lg border-b-2 border-blue-700 -mt-2'>
      <div className='container mx-auto py-8 px-6 text-center'>
        <p className='font-ssp text-white text-lg md:text-2xl lg:text-3xl font-bold tracking-wide mb-6 max-w-4xl mx-auto leading-tight'>
          WE IMAGINE BETTER WAYS TO SERVE A WORLD IN MOTION
        </p>
        <img
          src={ccLogo}
          alt='CMA CGM Logo'
          className='mx-auto h-12 md:h-16 lg:h-20 filter brightness-0 invert transition-transform duration-300 hover:scale-105'
        />
      </div>
    </header>
  )
}
//#endregion

//#region Game Context
const GameContext = createContext()

export function useGameContext() {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGameContext must be used within GameProvider')
  }
  return context
}

function GameProvider({ children }) {
  const gameState = useMemoryGame()
  return (
    <GameContext.Provider value={gameState}>{children}</GameContext.Provider>
  )
}
//#endregion

//#region Memory Game
function MemoryGame() {
  return (
    <GameProvider>
      <MemoryGameContent />
    </GameProvider>
  )
}

function MemoryGameContent() {
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

  if (!isValidGrid) {
    return (
      <div className='p-6 bg-gray-200 min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-red-600 mb-4'>Invalid Grid</h2>
          <p className='text-gray-700'>
            Incorrect number of cards ({state.images.length}). Need a perfect
            square number like 16, 25, or 36 cards.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen p-3 bg-ccblue'>
      <GameSelector />
      <div className='relative bg-gray-200 rounded-lg pb-10 pt-1'>
        <GameDashboard />
        {state.contentType === 'icon' ? (
          <IconGameDashboard />
        ) : (
          <ImageGameDashboard />
        )}{' '}
        {(state.gameStatus === 'newGame' ||
          state.gameStatus === 'gameOver') && <GameOverlay />}
      </div>
    </div>
  )
}
//#endregion

//#region Image vs. Icon dashboards
function ImageGameDashboard() {
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
    <div
      className={`grid gap-4 max-w-5xl mx-auto`}
      style={{
        gridTemplateColumns: `auto repeat(${gridSize}, 1fr)`,
        gridTemplateRows: `auto repeat(${gridSize}, 1fr)`,
      }}
    >
      {/* Empty top-left corner */}
      <div className='flex items-center justify-center'></div>

      {/* Column numbers header */}
      {columnLabels.map((num, index) => (
        <div
          key={`col-${index}`}
          className='flex items-center justify-center h-8'
        >
          <span className='text-lg font-bold text-gray-600 bg-gray-300 px-3 py-1 rounded-md'>
            {num}
          </span>
        </div>
      ))}

      {/* Rows with labels and cards */}
      {rowLabels.map((letter, rowIndex) => (
        <>
          {/* Row letter label */}
          <div
            key={`row-${rowIndex}`}
            className='flex items-center justify-center'
          >
            <span className='text-lg font-bold text-gray-600 bg-gray-300 px-3 py-1 rounded-md'>
              {letter}
            </span>
          </div>

          {/* Cards for this row */}
          {state.images
            .slice(rowIndex * gridSize, (rowIndex + 1) * gridSize)
            .map((img) => (
              <button
                key={img.id}
                disabled={img.isMatched || img.isFlipped}
                onClick={() => {
                  dispatch({ type: ACTIONS.CARD_CLICK, payload: img.id })
                }}
                className={`
                relative p-1 rounded-lg border-2 h-32
                ${
                  img.isFlipped
                    ? 'bg-white border-ccaqua shadow-lg'
                    : 'bg-blue-500 hover:bg-blue-400'
                }
                ${
                  img.isMatched
                    ? 'bg-green-100 border-green-400 shadow-green-400/50 shadow-xl'
                    : 'cursor-pointer transition-all duration-300 transform hover:scale-105'
                }
                `}
              >
                {img.isFlipped ? (
                  <>
                    <img
                      src={img.src}
                      alt={img.name}
                      className='w-full h-24 object-cover rounded-md mb-1'
                    />
                    <p className='text-sm font-bold text-gray-800'>
                      {img.name}
                    </p>
                  </>
                ) : (
                  <div className='w-full h-16 flex items-center justify-center'>
                    <div className='text-white text-2xl font-bold'>
                      {img.coordinate}
                    </div>
                  </div>
                )}
              </button>
            ))}
        </>
      ))}
    </div>
  )
}

function IconGameDashboard() {
  const { state, dispatch, gridSize, rowLabels, columnLabels, ACTIONS } =
    useGameContext()

  return (
    <div className='flex items-center justify-center w-full'>
      <div
        className='grid gap-1'
        style={{
          gridTemplateColumns: `30px repeat(${gridSize}, 80px)`,
          gridTemplateRows: `30px repeat(${gridSize}, 80px)`,
        }}
      >
        <div></div>

        {columnLabels.map((num, index) => (
          <div
            key={`col-${index}`}
            className='flex items-center justify-center'
          >
            <span className='text-sm font-bold text-gray-700 bg-gray-200 w-6 h-6 rounded flex items-center justify-center'>
              {num}
            </span>
          </div>
        ))}

        {rowLabels.map((letter, rowIndex) => (
          <>
            <div
              key={`row-${rowIndex}`}
              className='flex items-center justify-center'
            >
              <span className='text-sm font-bold text-gray-700 bg-gray-200 w-6 h-6 rounded flex items-center justify-center'>
                {letter}
              </span>
            </div>

            {state.images
              .slice(rowIndex * gridSize, (rowIndex + 1) * gridSize)
              .map((item) => {
                const IconComponent = item.iconComponent

                return (
                  <button
                    key={item.id}
                    disabled={item.isMatched || item.isFlipped}
                    onClick={() =>
                      dispatch({ type: ACTIONS.CARD_CLICK, payload: item.id })
                    }
                    className={`
                      relative rounded-xl border-2 w-20 h-20 transition-all duration-300
                      ${
                        item.isFlipped
                          ? 'bg-white border-purple-400 shadow-lg scale-105'
                          : 'bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 border-blue-400'
                      }
                      ${
                        item.isMatched
                          ? 'bg-gradient-to-br from-green-400 to-emerald-500 border-green-300 shadow-emerald-400/50 shadow-xl'
                          : 'cursor-pointer transform hover:scale-110 active:scale-95'
                      }
                    `}
                  >
                    {item.isFlipped ? (
                      <div className='w-full h-full flex items-center justify-center'>
                        {IconComponent && (
                          <IconComponent
                            size={32}
                            style={{ color: item.color }}
                            className='drop-shadow-sm'
                          />
                        )}
                      </div>
                    ) : (
                      <div className='w-full h-full flex items-center justify-center'>
                        <div className='text-white text-lg font-bold'>
                          {item.coordinate}
                        </div>
                      </div>
                    )}
                  </button>
                )
              })}
          </>
        ))}
      </div>
    </div>
  )
}
//#endregion

//#region Game selector
function GameSelector() {
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
    <div className='w-full bg-gray-200 rounded-lg shadow-lg border-b-2 border-gray-200 py-4 px-6 mb-6'>
      <div className='max-w-6xl mx-auto'>
        <div className='flex justify-center items-center gap-5 flex-wrap'>
          {IMAGE_SET_OPTIONS.map((set, i) => (
            <button
              key={i}
              onClick={async () => {
                const { default: config } = await import(
                  `./assets/${set.folderName}/config.json`
                )
                dispatch({
                  type: ACTIONS.CHANGE_IMAGE_SET,
                  payload: {
                    imageSet: set.folderName,
                    contentType: config.type || 'image',
                  },
                })
              }}
              className={`
                px-6 py-3 rounded-lg border-2 transition-all duration-200 transform hover:scale-105 hover:shadow-md
                ${
                  state.imageSet === set.folderName
                    ? 'border-ccblue bg-ccblue text-white shadow-lg'
                    : 'bg-gray-50 border-gray-300 text-gray-700 hover:border-blue-300'
                }
                min-w-[140px] text-center font-medium
              `}
            >
              <div className='flex items-center justify-center gap-2'>
                <span className='text-sm font-bold'>{set.title}</span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    state.imageSet === set.folderName
                      ? 'bg-white/20 text-white/90'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {set.dim}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
//#endregion

//#region Game Dashboard
function GameDashboard() {
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
    <div className='inset-0 p-2 m-1 mb-3 bg-opacity-75 backdrop-blur-sm flex flex-col items-center justify-center z-50 gap-4'>
      <div className='flex justify-center items-center gap-4'>
        <div
          className='px-6 py-3 rounded-xl shadow-lg w-[140px] h-14 flex items-center justify-center'
          style={{
            backgroundColor: '#096B68',
            borderColor: '#096B68',
            borderWidth: '2px',
          }}
        >
          <span
            className='text-lg font-bold'
            style={{ color: '#FFFBDE' }}
          >
            Moves: {state.moves}
          </span>
        </div>

        <div
          className='px-6 py-3 rounded-xl shadow-lg w-[140px] h-14 flex items-center justify-center'
          style={{
            backgroundColor: '#90D1CA',
            borderColor: '#90D1CA',
            borderWidth: '2px',
          }}
        >
          <span
            className='text-2xl'
            style={{ color: '#096B68' }}
          >
            {formatTime(elapsedTime)}
          </span>
        </div>

        <div
          className='px-6 py-3 rounded-xl shadow-lg w-[140px] h-14 flex items-center justify-center'
          style={{
            backgroundColor: '#096B68',
            borderColor: '#096B68',
            borderWidth: '2px',
          }}
        >
          <span
            className='text-lg font-bold'
            style={{ color: '#FFFBDE' }}
          >
            Mistakes: {state.mistakes}
          </span>
        </div>
      </div>

      <div
        className='px-4 py-2 rounded-lg shadow-md w-[45px] h-[45px] flex items-center justify-center'
        style={{
          backgroundColor: '#FFFBDE',
          borderColor: '#FFFBDE',
          borderWidth: '2px',
        }}
      >
        <span
          className='text-xl font-bold'
          style={{ color: '#096B68' }}
        >
          {state.coords || '\u00A0'}
        </span>
      </div>
    </div>
  )
}
//#endregion

//#region Game Overlay
const GameOverlay = () => {
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

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        dispatch({ type: ACTIONS.NEW_GAME })
      }
    }

    document.addEventListener('keydown', handleKeyPress)

    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [dispatch, ACTIONS])

  const isGameOver = state.gameStatus === 'gameOver'

  const totalCards = state.images.length ? state.images.length : 0
  const optimalMoves = totalCards + totalCards / (2 - 1)

  const efficiency =
    state.moves > 0 ? Math.round((optimalMoves / state.moves) * 100) : 0

  const isPerfectMemory = state.moves === optimalMoves

  return (
    <div className='absolute inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50'>
      <div className='bg-gradient-to-br from-slate-800 via-slate-900 to-black p-8 rounded-2xl shadow-2xl border border-slate-700 max-w-md w-full mx-4 transform transition-all duration-300 hover:scale-105'>
        <div className='text-center mb-8'>
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg ${
              isGameOver
                ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                : 'bg-gradient-to-r from-blue-500 to-purple-600'
            }`}
          >
            {isGameOver ? (
              <Trophy className='w-8 h-8 text-white' />
            ) : (
              <Play className='w-8 h-8 text-white ml-1' />
            )}
          </div>

          <h1
            className={`text-3xl font-bold text-white mb-2 bg-clip-text text-transparent ${
              isGameOver
                ? 'bg-gradient-to-r from-green-400 to-emerald-400'
                : 'bg-gradient-to-r from-blue-400 to-purple-400'
            }`}
          >
            {isGameOver ? 'Congratulations!' : 'Game Ready'}
          </h1>

          <p className='text-slate-400 text-sm'>
            {isGameOver
              ? 'You completed the memory game!'
              : 'Press Enter to start a new game'}
          </p>
        </div>

        {isGameOver && (
          <div className='bg-slate-700/50 rounded-lg p-4 mb-6 border border-slate-600'>
            <div className='grid grid-cols-3 gap-4 text-center'>
              <div>
                <div className='text-2xl font-bold text-white'>
                  {state.moves}
                </div>
                <div className='text-sm text-slate-400'>Moves</div>
              </div>
              <div>
                <div className='text-2xl font-bold text-white'>
                  {state.mistakes}
                </div>
                <div className='text-sm text-slate-400'>Mistakes</div>
              </div>
              <div>
                <div className='text-2xl font-bold text-white'>
                  {formatTime(elapsedTime)}
                </div>
                <div className='text-sm text-slate-400'>Time</div>
              </div>
            </div>

            <div className='mt-3 text-center'>
              {isPerfectMemory ? (
                <div className='flex items-center justify-center gap-2'>
                  <Brain className='w-5 h-5 text-purple-400' />
                  <span className='text-sm font-medium text-purple-400'>
                    Perfect Memory!
                  </span>
                </div>
              ) : (
                <div className='space-y-1'>
                  <span
                    className={`text-sm font-medium ${
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

        {/* New Game Button */}
        <button
          onClick={() => {
            dispatch({ type: ACTIONS.NEW_GAME })
          }}
          className={`w-full font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-102 active:scale-98 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group text-white ${
            isGameOver
              ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
          }`}
        >
          <RotateCcw className='w-5 h-5 group-hover:rotate-180 transition-transform duration-300' />
          <span className='text-lg'>
            {isGameOver ? 'Play Again' : 'Start New Game'}
          </span>
        </button>

        {/* Decorative Elements */}
        <div className='mt-6 flex justify-center space-x-2'>
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

        {/* Subtle Pattern */}
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
//#endregion

//#region App
function App() {
  return (
    <div className='m-0 p-0'>
      <MySociabble />
      <MemoryGame />
    </div>
  )
}

export default App
//#endregion
