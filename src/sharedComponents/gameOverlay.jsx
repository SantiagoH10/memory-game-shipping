import { useEffect } from 'react'
import { Trophy, Brain, RotateCcw } from 'lucide-react'
import { useGameContext } from '../utils/gameContext.jsx'
import { formatTime } from '../utils/helpers.js'

export const GameOverlay = () => {
  const { state, dispatch, ACTIONS, finalTime } = useGameContext()

  // Calculate responsive sizes with proportional scaling (same as other components)
  const getResponsiveSizes = () => {
    const screenWidth = window.innerWidth
    const screenHeight = window.innerHeight

    // Base size factor from viewport (using smaller dimension for consistency)
    const baseFactor = Math.min(screenWidth, screenHeight) / 500 // 500px as base reference
    const clampedFactor = Math.max(0.7, Math.min(baseFactor, 2.5)) // Constrain scaling

    // All sizes scale proportionally with the base factor
    const containerMaxWidth = Math.floor(400 * clampedFactor) // Base 400px
    const containerPadding = Math.floor(24 * clampedFactor) // Base 24px
    const iconSize = Math.floor(48 * clampedFactor) // Base 48px
    const iconInnerSize = Math.floor(24 * clampedFactor) // Base 24px

    // Font sizes scale with smaller factor for better readability
    const textScaleFactor = clampedFactor * 0.8 // Reduce text scaling by 20%
    const titleFontSize = Math.floor(24 * textScaleFactor) // Base 24px
    const subtitleFontSize = Math.floor(12 * textScaleFactor) // Base 12px
    const statsFontSize = Math.floor(28 * textScaleFactor) // Increased from 18px to 28px
    const statsLabelFontSize = Math.floor(14 * textScaleFactor) // Increased from 10px to 14px
    const buttonTextFontSize = Math.floor(14 * textScaleFactor) // Base 14px
    const efficiencyFontSize = Math.floor(12 * textScaleFactor) // Increased from 9px to 12px

    // Responsive title font size for game over
    let gameOverTitleSize = titleFontSize
    if (screenWidth < 400) {
      gameOverTitleSize = Math.floor(titleFontSize * 0.8) // Smaller on very small screens
    } else if (screenWidth > 800) {
      gameOverTitleSize = Math.floor(titleFontSize * 1.2) // Larger on big screens
    }

    // Spacing scales proportionally
    const gap = Math.floor(16 * clampedFactor) // Base 16px
    const buttonPadding = Math.floor(16 * clampedFactor) // Base 16px
    const borderRadius = Math.floor(16 * clampedFactor) // Base 16px (larger for overlay)
    const cardPadding = Math.floor(16 * clampedFactor) // Base 16px

    return {
      containerMaxWidth,
      containerPadding,
      iconSize,
      iconInnerSize,
      titleFontSize,
      gameOverTitleSize,
      subtitleFontSize,
      statsFontSize,
      statsLabelFontSize,
      buttonTextFontSize,
      efficiencyFontSize,
      gap,
      buttonPadding,
      borderRadius,
      cardPadding,
      scaleFactor: clampedFactor,
    }
  }

  useEffect(() => {
    const handleKeyPress = event => {
      if (
        event.key === 'Enter' &&
        (state.gameStatus === 'newGame' || state.gameStatus === 'gameOver')
      ) {
        dispatch({ type: ACTIONS.NEW_GAME })
      }
    }

    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [dispatch, ACTIONS, state.gameStatus])

  const isGameOver = state.gameStatus === 'gameOver'

  const sizes = getResponsiveSizes()

  return (
    <div className="absolute inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50">
      <div
        className="bg-gradient-to-br from-slate-800 via-slate-900 to-black shadow-2xl border border-slate-700 w-full mx-4 transform transition-all duration-300 hover:scale-105"
        style={{
          padding: `${sizes.containerPadding}px`,
          maxWidth: `${sizes.containerMaxWidth}px`,
          borderRadius: `${sizes.borderRadius}px`,
        }}
      >
        <div
          className="text-center"
          style={{ marginBottom: `${Math.floor(sizes.gap * 1.5)}px` }}
        >
          {isGameOver ? (
            <div
              className="flex items-center justify-center flex-wrap"
              style={{ gap: `${Math.floor(sizes.gap * 0.75)}px` }}
            >
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center shadow-lg flex-shrink-0"
                style={{
                  width: `${sizes.iconSize}px`,
                  height: `${sizes.iconSize}px`,
                  borderRadius: '50%',
                }}
              >
                <Trophy className="text-white" size={sizes.iconInnerSize} />
              </div>

              <h1
                className="font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-400 text-center"
                style={{
                  fontSize: `${sizes.gameOverTitleSize}px`,
                  lineHeight: '1.2',
                  wordBreak: 'break-word',
                }}
              >
                Congratulations!
              </h1>
            </div>
          ) : (
            <>
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mx-auto shadow-lg"
                style={{
                  width: `${sizes.iconSize}px`,
                  height: `${sizes.iconSize}px`,
                  marginBottom: `${Math.floor(sizes.gap * 0.75)}px`,
                  borderRadius: '50%',
                }}
              >
                <Brain className="text-white" size={sizes.iconInnerSize} />
              </div>

              <h1
                className="font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
                style={{
                  fontSize: `${sizes.titleFontSize}px`,
                  marginBottom: `${Math.floor(sizes.gap * 0.5)}px`,
                }}
              >
                MySociabble Memory
              </h1>

              <p
                className="text-slate-400"
                style={{ fontSize: `${sizes.subtitleFontSize}px` }}
              >
                Press Enter to start
              </p>
            </>
          )}
        </div>

        {isGameOver && (
          <div
            className="bg-slate-700/50 border border-slate-600"
            style={{
              padding: `${sizes.cardPadding}px`,
              marginBottom: `${sizes.gap}px`,
              borderRadius: `${Math.floor(sizes.borderRadius * 0.75)}px`,
            }}
          >
            <div
              className="grid grid-cols-3 text-center"
              style={{ gap: `${sizes.gap}px` }}
            >
              <div>
                <div
                  className="font-bold text-white"
                  style={{ fontSize: `${sizes.statsFontSize}px` }}
                >
                  {state.moves}
                </div>
                <div
                  className="text-slate-400"
                  style={{ fontSize: `${sizes.statsLabelFontSize}px` }}
                >
                  Moves
                </div>
              </div>
              <div>
                <div
                  className="font-bold text-white"
                  style={{ fontSize: `${sizes.statsFontSize}px` }}
                >
                  {state.mistakes}
                </div>
                <div
                  className="text-slate-400"
                  style={{ fontSize: `${sizes.statsLabelFontSize}px` }}
                >
                  Mistakes
                </div>
              </div>
              <div>
                <div
                  className="font-bold text-white"
                  style={{ fontSize: `${sizes.statsFontSize}px` }}
                >
                  {formatTime(finalTime)}
                </div>
                <div
                  className="text-slate-400"
                  style={{ fontSize: `${sizes.statsLabelFontSize}px` }}
                >
                  Time
                </div>
              </div>
            </div>

            <div
              className="text-center"
              style={{ marginTop: `${Math.floor(sizes.gap * 0.75)}px` }}
            >
              {state.mistakes === 0 ? (
                <div
                  className="flex items-center justify-center"
                  style={{ gap: `${Math.floor(sizes.gap * 0.5)}px` }}
                >
                  <Brain
                    className="text-purple-400"
                    size={Math.floor(sizes.iconInnerSize * 0.6)}
                  />
                  <span
                    className="font-medium text-purple-400"
                    style={{ fontSize: `${sizes.statsLabelFontSize}px` }}
                  >
                    Perfect Memory!
                  </span>
                </div>
              ) : (
                <div
                  style={{ gap: `${Math.floor(sizes.gap * 0.25)}px` }}
                  className="space-y-1"
                >
                  <span
                    className="font-medium text-orange-400"
                    style={{ fontSize: `${sizes.statsLabelFontSize}px` }}
                  >
                    'Keep practicing!'
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        <button
          onClick={() => {
            dispatch({ type: ACTIONS.NEW_GAME })
          }}
          className={`w-full font-semibold transition-all duration-200 transform hover:scale-102 active:scale-98 shadow-lg hover:shadow-xl flex items-center justify-center group text-white ${
            isGameOver
              ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
          }`}
          style={{
            padding: `${sizes.buttonPadding}px`,
            gap: `${Math.floor(sizes.gap * 0.75)}px`,
            borderRadius: `${Math.floor(sizes.borderRadius * 0.75)}px`,
          }}
        >
          <RotateCcw
            className="group-hover:rotate-180 transition-transform duration-300"
            size={Math.floor(sizes.iconInnerSize * 0.8)}
          />
          <span style={{ fontSize: `${sizes.buttonTextFontSize}px` }}>
            {isGameOver ? 'Play Again' : 'New Round'}
          </span>
        </button>

        <div
          className="flex justify-center"
          style={{
            marginTop: `${sizes.gap}px`,
            gap: `${Math.floor(sizes.gap * 0.5)}px`,
          }}
        >
          <div
            className={`rounded-full animate-pulse ${
              isGameOver ? 'bg-green-500' : 'bg-blue-500'
            }`}
            style={{
              width: `${Math.floor(sizes.iconInnerSize * 0.3)}px`,
              height: `${Math.floor(sizes.iconInnerSize * 0.3)}px`,
            }}
          ></div>
          <div
            className={`rounded-full animate-pulse delay-100 ${
              isGameOver ? 'bg-emerald-500' : 'bg-purple-500'
            }`}
            style={{
              width: `${Math.floor(sizes.iconInnerSize * 0.3)}px`,
              height: `${Math.floor(sizes.iconInnerSize * 0.3)}px`,
            }}
          ></div>
          <div
            className={`rounded-full animate-pulse delay-200 ${
              isGameOver ? 'bg-teal-500' : 'bg-pink-500'
            }`}
            style={{
              width: `${Math.floor(sizes.iconInnerSize * 0.3)}px`,
              height: `${Math.floor(sizes.iconInnerSize * 0.3)}px`,
            }}
          ></div>
        </div>

        <div
          className={`absolute inset-0 pointer-events-none ${
            isGameOver
              ? 'bg-gradient-to-r from-green-500/5 to-emerald-500/5'
              : 'bg-gradient-to-r from-blue-500/5 to-purple-500/5'
          }`}
          style={{ borderRadius: `${sizes.borderRadius}px` }}
        ></div>
      </div>
    </div>
  )
}
