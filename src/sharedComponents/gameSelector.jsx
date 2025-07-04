import { useGameContext, GameProvider } from '../utils/gameContext'
import { IMAGE_SET_OPTIONS } from '../utils/IMAGE_SET_OPTIONS'

export function GameSelector() {
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
                  `../assets/${set.folderName}/config.json`
                )
                dispatch({
                  type: ACTIONS.CHANGE_IMAGE_SET,
                  payload: { imageSet: set.folderName },
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
