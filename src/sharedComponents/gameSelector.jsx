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

  return (
    <div className="w-full bg-gray-200 rounded-lg shadow-lg border-b-2 border-gray-200 py-4 px-6 mb-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-4">
          <div className="flex justify-center items-center gap-3 flex-wrap">
            {TYPE_OPTIONS.map(option => (
              <button
                key={option.value}
                onClick={() => handleTypeChange(option.value)}
                className={`
                  px-4 py-2 rounded-lg border-2 transition-all duration-200 transform hover:scale-105
                  ${
                    state.contentType === option.value
                      ? 'border-ccblue bg-ccblue text-white shadow-lg'
                      : 'bg-gray-50 border-gray-300 text-gray-700 hover:border-blue-300'
                  }
                  min-w-[120px] text-center font-medium text-sm
                `}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="flex justify-center items-center gap-3 flex-wrap">
            {SIZE_TO_GRID.map(sizeOption => (
              <button
                key={sizeOption.size}
                onClick={event => {
                  event.target.blur()
                  handleSizeChange(sizeOption.size)
                }}
                className={`
                  px-4 py-2 rounded-lg border-2 transition-all duration-200 transform hover:scale-105
                  ${
                    state.size === sizeOption.size
                      ? 'border-ccblue bg-ccblue text-white shadow-lg'
                      : 'bg-gray-50 border-gray-300 text-gray-700 hover:border-blue-300'
                  }
                  min-w-[80px] text-center font-medium text-sm
                `}
              >
                <div>
                  <div className="font-bold">{sizeOption.grid}</div>
                  <div className="text-xs opacity-80">
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
