import { useState, useEffect } from 'react'
import { useGameContext } from '../utils/gameContext'
import { loadSetOptions } from '../utils/setLoader'

export function GameSelector() {
  const [setOptions, setSetOptions] = useState([])
  const { state, dispatch, ACTIONS } = useGameContext()

  useEffect(() => {
    loadSetOptions().then(setSetOptions)
  }, [])

  const isMobile = window.innerWidth < 768

  return (
    <div className='w-full bg-gray-200 rounded-lg shadow-lg border-b-2 border-gray-200 py-4 px-6 mb-6'>
      <div className='max-w-6xl mx-auto'>
        <div className='flex justify-center items-center gap-5 flex-wrap'>
          {setOptions
            .filter((set) => (isMobile ? set.type === 'icon' : true))
            .map((set, i) => (
              <button
                key={i}
                onClick={async (event) => {
                  event.target.blur()
                  const { default: config } = await import(
                    `../assets/${set.folderName}/config.json`
                  )
                  dispatch({
                    type: ACTIONS.CHANGE_IMAGE_SET,
                    payload: {
                      imageSet: set.folderName,
                    },
                  })
                }}
                className={`
                  px-6 py-3 rounded-lg border-2 transition-all duration-200 transform hover:scale-105 hover:shadow-md
                  ${state.imageSet === set.folderName
                    ? 'border-ccblue bg-ccblue text-white shadow-lg'
                    : 'bg-gray-50 border-gray-300 text-gray-700 hover:border-blue-300'
                  }
                  min-w-[140px] text-center font-medium
                `}
                title={
                  state.imageSet === set.folderName
                    ? 'Click to restart this game'
                    : `Switch to ${set.title}`
                }
              >
                <div className='flex items-center justify-center gap-2'>
                  {state.imageSet === set.folderName ? (
                    <span className='text-sm font-bold'>Restart</span>
                  ) : (
                    <>
                      <span className='text-sm font-bold'>{set.title}</span>
                      <span className='text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-600'>
                        {set.dim}
                      </span>
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
