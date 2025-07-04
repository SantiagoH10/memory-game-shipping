//#region Imports
import { useEffect } from 'react'

import { RotateCcw, Trophy, Brain } from 'lucide-react'

import { useMemoryGame } from './hooks/useMemoryGame.js'

import { GameSelector } from "./sharedComponents/gameSelector.jsx"

import { useGameContext, GameProvider } from './utils/gameContext.jsx'

import { IMAGE_SET_OPTIONS } from './utils/IMAGE_SET_OPTIONS.js'

import { MySociabble} from "./sharedComponents/mySociabble.jsx"

import { GameOverlay } from './sharedComponents/gameOverlay.jsx'

import { GameDashboard} from './sharedComponents/gameDashboard.jsx'

import './App.css'

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

//#region Image dashboard
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
//#endregion

//#region Icon dashboard
function IconGameDashboard() {
  const { state, dispatch, ACTIONS } = useGameContext()

  const totalCards = 64
  const getOptimalDimensions = (screenWidth) => {
    if (screenWidth >= 1400) return { cols: 16, rows: 4 }
    if (screenWidth >= 1000) return { cols: 12, rows: 6 }
    if (screenWidth >= 800) return { cols: 8, rows: 8 }
    if (screenWidth >= 600) return { cols: 6, rows: 11 }
    return { cols: 4, rows: 16 }
  }

  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1000
  const { cols, rows } = getOptimalDimensions(screenWidth)

  const rowLabels = Array.from({ length: rows }, (_, i) =>
    String.fromCharCode(65 + i)
  )

  return (
    <div className='flex items-center justify-center w-full p-4'>
      <div className='flex flex-col gap-1'>
        {rowLabels.map((letter, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className='flex gap-1'
          >
            {state.images
              .slice(rowIndex * cols, (rowIndex + 1) * cols)
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
                      relative rounded-lg border-2 w-16 h-16 transition-all duration-300 flex-shrink-0
                      ${
                        item.isFlipped
                          ? 'bg-white border-purple-400 shadow-lg scale-105'
                          : 'bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 border-blue-400'
                      }
                      ${
                        item.isMatched
                          ? 'bg-white border-green-400 shadow-green-400/60 shadow-lg'
                          : 'cursor-pointer transform hover:scale-110 active:scale-95'
                      }
                    `}
                    style={
                      item.isMatched
                        ? {
                            boxShadow: '0 0 15px rgba(34, 197, 94, 0.6), 0 0 25px rgba(34, 197, 94, 0.3)',
                          }
                        : {}
                    }
                  >
                    {item.isFlipped ? (
                      <div className='w-full h-full flex items-center justify-center'>
                        {IconComponent && (
                          <IconComponent
                            size={28}
                            style={{ color: item.color }}
                            className='drop-shadow-sm'
                          />
                        )}
                      </div>
                    ) : (
                      <div className='w-full h-full flex items-center justify-center'>
                        <div className='text-white text-sm font-bold'>
                          {item.coordinate}
                        </div>
                      </div>
                    )}
                  </button>
                )
              })}
          </div>
        ))}
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
