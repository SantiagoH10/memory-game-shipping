//#region Imports
import { useGameContext, GameProvider } from './utils/gameContext.jsx'
import { MySociabble } from './sharedComponents/mySociabble.jsx'
import { GameOverlay } from './sharedComponents/gameOverlay.jsx'
import { GameDashboard } from './sharedComponents/gameDashboard.jsx'
import { GameSelector } from './sharedComponents/gameSelector.jsx'
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
  const { state } = useGameContext()

  return (
    <div className="min-h-screen p-3 bg-ccblue">
      <GameSelector />
      <div className="relative bg-gray-200 rounded-lg pb-10 pt-1">
        <GameDashboard />
        <IconGameDashboard />
        {(state.gameStatus === 'newGame' ||
          state.gameStatus === 'gameOver') && <GameOverlay />}
      </div>
    </div>
  )
}
//#endregion

//#region Icon dashboard
function IconGameDashboard() {
  const { state, dispatch, gridSize, rowLabels, columnLabels, ACTIONS } =
    useGameContext()

  // Return early if grid data isn't loaded yet
  if (
    !gridSize ||
    !gridSize.rows ||
    !gridSize.cols ||
    !rowLabels ||
    !columnLabels
  ) {
    return (
      <div className="flex items-center justify-center w-full p-4">
        <div className="text-gray-500">Loading game...</div>
      </div>
    )
  }

  const isMobile = window.innerWidth < 768

  return (
    <div className="flex items-center justify-center w-full p-4">
      <div className="flex flex-col gap-2">
        {rowLabels.map((letter, rowIndex) => (
          <div key={`row-${rowIndex}`} className="flex gap-2">
            {state.images
              .filter(item => item.gridRow === rowIndex + 1)
              .sort((a, b) => a.gridCol - b.gridCol)
              .map(item => {
                const IconComponent = item.iconComponent

                return (
                  <button
                    key={item.id}
                    disabled={
                      item.isMatched ||
                      item.isFlipped ||
                      state.gameStatus === 'evaluating'
                    }
                    onClick={() =>
                      dispatch({ type: ACTIONS.CARD_CLICK, payload: item.id })
                    }
                    className={`
                    relative rounded-lg border-2 w-16 h-16 transition-all duration-300 flex-shrink-0
                    ${
                      item.isFlipped
                        ? item.type === 'text'
                          ? 'bg-gray-100 border-purple-400 shadow-lg scale-105'
                          : 'bg-white border-purple-400 shadow-lg scale-105'
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
                            boxShadow:
                              '0 0 15px rgba(34, 197, 94, 0.6), 0 0 25px rgba(34, 197, 94, 0.3)',
                          }
                        : {}
                    }
                  >
                    {item.isFlipped ? (
                      <div className="w-full h-full flex items-center justify-center">
                        {item.type === 'text' ? (
                          <div
                            className="text-center text-xs font-bold px-1 leading-tight"
                            style={{ color: item.color }}
                          >
                            {item.displayText}
                          </div>
                        ) : (
                          IconComponent && (
                            <IconComponent
                              size={28}
                              style={{ color: item.color }}
                              className="drop-shadow-sm"
                            />
                          )
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-white text-sm font-bold">
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
    <div className="m-0 p-0">
      <MySociabble />
      <MemoryGame />
    </div>
  )
}

export default App
//#endregion
