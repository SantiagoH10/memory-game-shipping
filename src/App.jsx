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

  // Calculate responsive border radius (same system as GameSelector and GameDashboard)
  const getResponsiveBorderRadius = () => {
    const screenWidth = window.innerWidth
    const screenHeight = window.innerHeight
    
    const baseFactor = Math.min(screenWidth, screenHeight) / 500 // 500px as base reference
    const clampedFactor = Math.max(0.7, Math.min(baseFactor, 2.5)) // Constrain scaling
    
    const borderRadius = Math.floor(8 * clampedFactor) // Base 8px, same as GameSelector
    
    return borderRadius
  }

  const borderRadius = getResponsiveBorderRadius()

  return (
    <div className="min-h-screen p-3 sm:p-[0.5vw] md:p-[1vw] lg:p-[1.5vw] xl:p-[2vw] bg-ccblue flex flex-col">
      <GameSelector />
      <div 
        className="relative bg-gray-200 shadow-lg border-b-2 border-gray-200 pb-4 sm:pb-[1.5vh] md:pb-[2.5vh] pt-2 sm:pt-[0.25vh] flex flex-col mb-2"
        style={{
          borderRadius: `${borderRadius}px`
        }}
      >
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

const isMobile = window.innerWidth < 768; 
 // Return early if grid data isn't loaded yet
  if (
    !gridSize ||
    !gridSize.rows ||
    !gridSize.cols ||
    !rowLabels ||
    !columnLabels
  ) {
    return (
      <div className="flex justify-center w-full p-4">
        <div className="text-gray-500">Loading game...</div>
      </div>
    )
  }

  // Calculate optimal card size using viewport units
  const getOptimalCardSize = () => {
    const cols = gridSize.cols
    const rows = gridSize.rows

    // More conservative available space calculation for smaller screens
    const screenWidth = window.innerWidth
    const screenHeight = window.innerHeight
    
    // Adjust available space based on screen size
    let widthRatio = 0.85  // Default 85% of width
    let heightRatio = 0.55 // Default 55% of height
    
    if (screenWidth < 640) { // Small screens
      widthRatio = 0.9   // Use more width on small screens
      heightRatio = 0.5  // Less height due to more UI elements
    } else if (screenWidth < 768) { // Medium screens
      widthRatio = 0.88
      heightRatio = 0.52
    }

    const availableWidth = screenWidth * widthRatio
    const availableHeight = screenHeight * heightRatio

    // Calculate card size based on available space
    const cardWidthFromVW = Math.floor(availableWidth / cols)
    const cardHeightFromVH = Math.floor(availableHeight / rows)
    
    // Use the smaller dimension to ensure cards fit
    const baseCardSize = Math.min(cardWidthFromVW, cardHeightFromVH)
    
    // Apply constraints using viewport-relative units with better small screen support
    const minCardSize = Math.max(screenWidth * 0.12, 48) // Larger minimum for small screens
    const maxCardSize = Math.min(screenWidth * 0.15, 200)
    
    const cardSize = Math.min(Math.max(baseCardSize, minCardSize), maxCardSize)

    return {
      cardSize: Math.floor(cardSize)
    }
  }

  const getIconSize = (cardSize) => {
    // Icon size as percentage of card size, with viewport-relative constraints
    const baseIconSize = cardSize * 0.5
    const minIconSize = Math.max(window.innerWidth * 0.025, 16)
    const maxIconSize = Math.min(window.innerWidth * 0.08, 64)
    
    return Math.min(Math.max(baseIconSize, minIconSize), maxIconSize)
  }

  const getGap = (cardSize) => {
    // Smaller gaps on smaller screens
    const screenWidth = window.innerWidth
    let gapMultiplier = 0.05
    
    if (screenWidth < 640) {
      gapMultiplier = 0.03 // Smaller gaps on small screens
    }
    
    const gapSize = Math.max(cardSize * gapMultiplier, 3)
    return `${Math.floor(gapSize)}px`
  }

  const getTextSize = (cardSize) => {
    // Coordinate text size scales directly with card size
    const baseTextSize = cardSize * 0.22 // 22% of card size for coordinates
    const minTextSize = 10 // Absolute minimum for readability
    const maxTextSize = 28 // Absolute maximum to prevent oversized text
    
    return Math.min(Math.max(baseTextSize, minTextSize), maxTextSize)
  }

  const getCountryTextSize = (cardSize) => {
    // Country name text size scales with card size but smaller than coordinates
    const baseTextSize = cardSize * 0.18 // 18% of card size for country names
    const minTextSize = 8 // Smaller minimum for country names
    const maxTextSize = 22 // Smaller maximum for country names
    
    return Math.min(Math.max(baseTextSize, minTextSize), maxTextSize)
  }

  const { cardSize } = getOptimalCardSize()
  const iconSize = getIconSize(cardSize)
  const gap = getGap(cardSize)
  const coordinateTextSize = getTextSize(cardSize)
  const countryTextSize = getCountryTextSize(cardSize)

  return (
    <div 
      className="w-full flex justify-center"
      style={{ 
        padding: `${Math.max(window.innerWidth * 0.015, 12)}px`,
        paddingBottom: `${Math.max(window.innerWidth * 0.02, 16)}px` // Extra bottom padding
      }}
    >
      <div 
        className="flex flex-col"
        style={{ gap }}
      >
        {rowLabels.map((letter, rowIndex) => (
          <div 
            key={`row-${rowIndex}`} 
            className="flex"
            style={{ gap }}
          >
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
                    relative rounded-lg border-2 transition-all duration-300 flex-shrink-0
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
                    style={{
                      width: `${cardSize}px`,
                      height: `${cardSize}px`,
                      borderRadius: `${Math.max(cardSize * 0.08, 4)}px`,
                      ...(item.isMatched
                        ? {
                            boxShadow:
                              '0 0 15px rgba(34, 197, 94, 0.6), 0 0 25px rgba(34, 197, 94, 0.3)',
                          }
                        : {}),
                    }}
                  >
                    {item.isFlipped ? (
                      <div 
                        className="w-full h-full flex items-center justify-center"
                        style={{ padding: `${Math.max(cardSize * 0.05, 2)}px` }}
                      >
                        {item.type === 'text' ? (
                          <div
                            className="text-center font-bold leading-tight"
                            style={{
                              color: item.color,
                              fontSize: `${countryTextSize}px`,
                            }}
                          >
                            {item.displayText}
                          </div>
                        ) : (
                          IconComponent && (
                            <IconComponent
                              size={iconSize}
                              style={{ color: item.color }}
                              className="drop-shadow-sm"
                            />
                          )
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div
                          className="text-white font-bold"
                          style={{
                            fontSize: `${coordinateTextSize}px`,
                          }}
                        >
                          {isMobile ? "?" : item.coordinate}
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
    <div className="min-h-screen flex flex-col">
      <MySociabble />
      <div className="flex-1">
        <MemoryGame />
      </div>
    </div>
  )
}

export default App
//#endregion