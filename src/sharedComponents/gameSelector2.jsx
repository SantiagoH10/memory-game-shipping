import { useState, useEffect } from 'react'
import { useGameContext } from '../utils/gameContext'

const SIZE_TO_GRID = [
  { size: 4, grid: '2x2' },
  { size: 12, grid: '3x4' },
  { size: 20, grid: '4x5' },
]
const TYPE_OPTIONS = ['icons', 'flags', 'flag-name']

async function loadConfigData() {
  const configData = []

  for (const configName of TYPE_OPTIONS) {
    try {
      const { default: config } = await import(`../assets/${configName}.json`)
      options.push({
        ...config.configData,
        configName: configName,
      })
    } catch (error) {
      console.warn(`Failed to load config for ${configName}:`, error)
    }
  }

  return configData
}

//add size to init state
//replace imageSet with contentType

//Adapt change IMAGE SET

export function GameSelector() {
  const { state, dispatch, ACTIONS } = useGameContext()
  const [configData, setconfigData] = useState([])

  useEffect(() => {
    loadConfigData().then(setConfigData)
  }, [])

  const isMobile = window.innerWidth < 768

  return (
    <div className="w-full bg-gray-200 rounded-lg shadow-lg border-b-2 border-gray-200 py-4 px-6 mb-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center items-center gap-5 flex-wrap">
          {configData.map((data, i) => (
            <button
              key={i}
              onClick={async event => {
                event.target.blur()
                const { default: config } = await import(
                  `../assets/${data.configName}.json`
                )
                dispatch({
                  type: ACTIONS.CHANGE_IMAGE_SET,
                  payload: {
                    contentType: data.configName,
                  },
                })
              }}
              className={`
                  px-6 py-3 rounded-lg border-2 transition-all duration-200 transform hover:scale-105 hover:shadow-md
                  ${
                    state.contentType === data.configName
                      ? 'border-ccblue bg-ccblue text-white shadow-lg'
                      : 'bg-gray-50 border-gray-300 text-gray-700 hover:border-blue-300'
                  }
                                    min-w-[140px] text-center font-medium
                                    `}
              title={
                state.contentType === set.configName
                  ? 'Click to restart this game'
                  : `Switch to ${data.title}`
              }
            >
              <div className="flex items-center justify-center gap-2">
                {state.contentType === data.configName ? (
                  <span className="text-sm font-bold">Restart</span>
                ) : (
                  <>
                    <span className="text-sm font-bold">{data.title}</span>
                  </>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
