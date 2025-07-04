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
    ACTIONS,
  } = useGameContext()

  // Calculate responsive sizes with proportional scaling
  const getResponsiveSizes = () => {
    const screenWidth = window.innerWidth
    const screenHeight = window.innerHeight
    
    // Base size factor from viewport (using smaller dimension for consistency)
    const baseFactor = Math.min(screenWidth, screenHeight) / 500 // 500px as base reference
    const clampedFactor = Math.max(0.7, Math.min(baseFactor, 2.5)) // Constrain scaling
    
    // All sizes scale proportionally with the base factor
    const cardWidth = Math.floor(110 * clampedFactor)   // Base 120px
    const cardHeight = Math.floor(40 * clampedFactor)   // Base 60px
    const coordSize = Math.floor(30 * clampedFactor)    // Base 45px
    
    // Font sizes scale with same factor
    const labelFontSize = Math.floor(14 * clampedFactor)   // Base 14px
    const timeFontSize = Math.floor(18 * clampedFactor)    // Base 18px
    const coordFontSize = Math.floor(16 * clampedFactor)   // Base 16px
    
    // Spacing scales proportionally
    const gap = Math.floor(8 * clampedFactor)         // Base 12px
    const padding = Math.floor(8 * clampedFactor)      // Base 8px
    const borderRadius = Math.floor(12 * clampedFactor) // Base 12px
    const borderWidth = Math.max(1, Math.floor(2 * clampedFactor)) // Base 2px
    
    return {
      cardWidth,
      cardHeight,
      coordSize,
      labelFontSize,
      timeFontSize,
      coordFontSize,
      gap,
      padding,
      borderRadius,
      borderWidth,
      scaleFactor: clampedFactor
    }
  }

  const sizes = getResponsiveSizes()
  const isMobile = window.innerWidth < 768; 

  return (
    <div 
      className="inset-0 bg-opacity-75 backdrop-blur-sm flex flex-col items-center justify-center z-50"
      style={{ 
        padding: `${sizes.padding}px`,
        gap: `${Math.floor(sizes.gap * 1.5)}px` // Slightly larger gap between rows
      }}
    >
      <div 
        className="flex justify-center items-center flex-wrap"
        style={{ gap: `${sizes.gap}px` }}
      >
        {/* Moves Card */}
        <div
          className="shadow-lg flex items-center justify-center"
          style={{
            backgroundColor: '#096B68',
            borderColor: '#096B68',
            borderWidth: `${sizes.borderWidth}px`,
            borderStyle: 'solid',
            borderRadius: `${sizes.borderRadius}px`,
            width: `${sizes.cardWidth}px`,
            height: `${sizes.cardHeight}px`,
            padding: `${Math.floor(sizes.padding * 0.8)}px`
          }}
        >
          <span
            className="font-bold text-center leading-tight"
            style={{ 
              color: '#FFFBDE',
              fontSize: `${sizes.labelFontSize}px`
            }}
          >
            Moves: {state.moves}
          </span>
        </div>

        {/* Timer Card */}
        <div
          className="shadow-lg flex items-center justify-center"
          style={{
            backgroundColor: '#90D1CA',
            borderColor: '#90D1CA',
            borderWidth: `${sizes.borderWidth}px`,
            borderStyle: 'solid',
            borderRadius: `${sizes.borderRadius}px`,
            width: `${sizes.cardWidth}px`,
            height: `${sizes.cardHeight}px`,
            padding: `${Math.floor(sizes.padding * 0.8)}px`
          }}
        >
          <span 
            className="font-bold text-center"
            style={{ 
              color: '#096B68',
              fontSize: `${sizes.timeFontSize}px`
            }}
          >
            {formatTime(elapsedTime)}
          </span>
        </div>

        {/* Mistakes Card */}
        <div
          className="shadow-lg flex items-center justify-center"
          style={{
            backgroundColor: '#096B68',
            borderColor: '#096B68',
            borderWidth: `${sizes.borderWidth}px`,
            borderStyle: 'solid',
            borderRadius: `${sizes.borderRadius}px`,
            width: `${sizes.cardWidth}px`,
            height: `${sizes.cardHeight}px`,
            padding: `${Math.floor(sizes.padding * 0.8)}px`
          }}
        >
          <span
            className="font-bold text-center leading-tight"
            style={{ 
              color: '#FFFBDE',
              fontSize: `${sizes.labelFontSize}px`
            }}
          >
            Mistakes: {state.mistakes}
          </span>
        </div>
      </div>
      
      {/* Coordinate Input Display */}
      {isMobile ? '' :
      <div
        className="shadow-md flex items-center justify-center"
        style={{
          backgroundColor: '#FFFBDE',
          borderColor: '#FFFBDE',
          borderWidth: `${sizes.borderWidth}px`,
          borderStyle: 'solid',
          borderRadius: `${Math.floor(sizes.borderRadius * 0.8)}px`, // Slightly smaller radius
          width: `${sizes.coordSize}px`,
          height: `${sizes.coordSize}px`,
        }}
      >
        <span
          className="font-bold text-center"
          style={{ 
            color: '#096B68',
            fontSize: `${sizes.coordFontSize}px`
          }}
        >
          {state.coords || '\u00A0'}

        </span>
      </div>
      }
    </div>
  )
}