import { useState, useEffect } from 'react'
import { useGameContext } from '../utils/gameContext'

const SIZE_TO_GRID = [
  { size: 4, grid: '2x2' },
  { size: 12, grid: '3x4' },
  { size: 20, grid: '4x5' },
]

const TYPE_OPTIONS = [
  { value: 'icons', label: 'Icons' },
  { value: 'flags', label: 'Flags' },
  { value: 'flag-name', label: 'Flag-Country' },
]

async function loadConfigData() {
  const configData = []

  for (const typeOption of TYPE_OPTIONS) {
    try {
      const { default: config } = await import(
        `../assets/${typeOption.value}.json`
      )
      configData.push({
        ...config.metadata,
        configName: typeOption.value,
      })
    } catch (error) {
      console.warn(`Failed to load config for ${typeOption.value}:`, error)
    }
  }

  return configData
}

export function GameSelector() {
  const { state, dispatch, ACTIONS } = useGameContext()
  const [configData, setConfigData] = useState([])

  useEffect(() => {
    loadConfigData().then(setConfigData)
  }, [])

  // Calculate responsive sizes with proportional scaling (same as GameDashboard)
  const getResponsiveSizes = () => {
    const screenWidth = window.innerWidth
    const screenHeight = window.innerHeight

    // Base size factor from viewport (using smaller dimension for consistency)
    const baseFactor = Math.min(screenWidth, screenHeight) / 500 // 500px as base reference
    const clampedFactor = Math.max(0.7, Math.min(baseFactor, 2.5)) // Constrain scaling

    // Button sizes scale proportionally
    const typeButtonWidth = Math.floor(120 * clampedFactor) // Base 120px
    const typeButtonHeight = Math.floor(40 * clampedFactor) // Base 40px
    const sizeButtonWidth = Math.floor(80 * clampedFactor) // Base 80px
    const sizeButtonHeight = Math.floor(50 * clampedFactor) // Base 50px

    // Font sizes scale with same factor
    const labelFontSize = Math.floor(14 * clampedFactor) // Base 14px
    const gridFontSize = Math.floor(16 * clampedFactor) // Base 16px
    const cardsFontSize = Math.floor(11 * clampedFactor) // Base 11px

    // Spacing scales proportionally
    const gap = Math.floor(8 * clampedFactor) // Base 8px
    const rowGap = Math.floor(12 * clampedFactor) // Base 12px
    const padding = Math.floor(16 * clampedFactor) // Base 16px
    const containerPadding = Math.floor(20 * clampedFactor) // Base 20px
    const borderRadius = Math.floor(8 * clampedFactor) // Base 8px
    const borderWidth = Math.max(1, Math.floor(2 * clampedFactor)) // Base 2px

    return {
      typeButtonWidth,
      typeButtonHeight,
      sizeButtonWidth,
      sizeButtonHeight,
      labelFontSize,
      gridFontSize,
      cardsFontSize,
      gap,
      rowGap,
      padding,
      containerPadding,
      borderRadius,
      borderWidth,
      scaleFactor: clampedFactor,
    }
  }

  const handleTypeChange = contentType => {
    dispatch({
      type: ACTIONS.CHANGE_CONTENT_TYPE,
      payload: {
        contentType,
        size: state.size || 20,
      },
    })
  }

  const handleSizeChange = size => {
    dispatch({
      type: ACTIONS.CHANGE_SIZE,
      payload: {
        contentType: state.contentType,
        size,
      },
    })
  }

  const sizes = getResponsiveSizes()

  return (
    <div
      className="w-full bg-gray-200 shadow-lg border-b-2 border-gray-200"
      style={{
        borderRadius: `${sizes.borderRadius}px`,
        padding: `${sizes.containerPadding}px ${sizes.padding}px`,
        marginBottom: `${sizes.rowGap}px`,
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col" style={{ gap: `${sizes.rowGap}px` }}>
          {/* Game Type Selection */}
          <div
            className="flex justify-center items-center flex-wrap"
            style={{ gap: `${sizes.gap}px` }}
          >
            {TYPE_OPTIONS.map(option => (
              <button
                key={option.value}
                onClick={event => {
                  event.target.blur()
                  handleTypeChange(option.value)
                }}
                className={`
                  transition-all duration-200 transform hover:scale-105 text-center font-medium
                  ${
                    state.contentType === option.value
                      ? 'bg-ccblue text-white shadow-lg'
                      : 'bg-gray-50 text-gray-700 hover:border-blue-300'
                  }
                `}
                style={{
                  width: `${sizes.typeButtonWidth}px`,
                  height: `${sizes.typeButtonHeight}px`,
                  borderRadius: `${sizes.borderRadius}px`,
                  borderWidth: `${sizes.borderWidth}px`,
                  borderStyle: 'solid',
                  borderColor:
                    state.contentType === option.value ? '#ccblue' : '#d1d5db',
                  fontSize: `${sizes.labelFontSize}px`,
                  padding: `${Math.floor(sizes.padding * 0.3)}px`,
                }}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Grid Size Selection */}
          <div
            className="flex justify-center items-center flex-wrap"
            style={{ gap: `${sizes.gap}px` }}
          >
            {SIZE_TO_GRID.map(sizeOption => (
              <button
                key={sizeOption.size}
                onClick={event => {
                  event.target.blur()
                  handleSizeChange(sizeOption.size)
                }}
                className={`
                  transition-all duration-200 transform hover:scale-105 text-center font-medium
                  ${
                    state.size === sizeOption.size
                      ? 'bg-ccblue text-white shadow-lg'
                      : 'bg-gray-50 text-gray-700 hover:border-blue-300'
                  }
                `}
                style={{
                  width: `${sizes.sizeButtonWidth}px`,
                  height: `${sizes.sizeButtonHeight}px`,
                  borderRadius: `${sizes.borderRadius}px`,
                  borderWidth: `${sizes.borderWidth}px`,
                  borderStyle: 'solid',
                  borderColor:
                    state.size === sizeOption.size ? '#ccblue' : '#d1d5db',
                  padding: `${Math.floor(sizes.padding * 0.2)}px`,
                }}
              >
                <div>
                  <div
                    className="font-bold"
                    style={{ fontSize: `${sizes.gridFontSize}px` }}
                  >
                    {sizeOption.grid}
                  </div>
                  <div
                    className="opacity-80"
                    style={{ fontSize: `${sizes.cardsFontSize}px` }}
                  >
                    {sizeOption.size} cards
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
