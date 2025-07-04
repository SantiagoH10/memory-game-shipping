import { useState, useReducer, useEffect } from 'react'
import { randShuffle, formatTime } from '../utils/helpers.js'
import { initState, ACTIONS, gameReducer } from '../utils/gameLogic.js'
import { ICON_MAP } from '../utils/icons.js'

const imageModules = import.meta.glob('../assets/**/*.{png,jpg,jpeg,gif,svg}', {
  eager: false,
})

export function useMemoryGame() {
  const [state, dispatch] = useReducer(gameReducer, initState)

  const [elapsedTime, setElapsedTime] = useState(0)
  const [startTime, setStartTime] = useState(null)

  const gridSize = Math.sqrt(state.images.length)
  const isValidGrid = Number.isInteger(gridSize) && gridSize > 0

  const rowLabels = isValidGrid
    ? Array.from({ length: gridSize }, (_, i) => String.fromCharCode(65 + i))
    : []
  const columnLabels = isValidGrid
    ? Array.from({ length: gridSize }, (_, i) => i + 1)
    : []

  useEffect(() => {
    const loadImages = async () => {
      const { default: config } = await import(
        `../assets/${state.imageSet}/config.json`
      )

      let items

      if (config.type === 'icon') {
        console.log('entering icon cond statement')
        console.log(config.type)
        // Handle icons
        items = config.icons.map((iconConfig) => ({
          name: iconConfig.name,
          iconComponent: ICON_MAP[iconConfig.icon],
          color: iconConfig.color,
          type: 'icon',
          isFlipped: false,
          isMatched: false,
          flipCounter: 0,
        }))
      } else {
        // Handle images (existing logic)
        items = await Promise.all(
          config.images.map(async (img) => {
            const imagePath = `../assets/${state.imageSet}/${img.filename}`
            const imageModule = await imageModules[imagePath]()
            return {
              name: img.name,
              src: imageModule.default,
              type: 'image',
              isFlipped: false,
              isMatched: false,
              flipCounter: 0,
            }
          })
        )
      }
      const dupItems = items.flatMap((item, i) => {
        item.pairId = i
        return [item, { ...item }]
      })

      dupItems.forEach((item, i) => {
        item.id = i
      })

      const shuffledItems = randShuffle(dupItems)
      const finalGridSize = Math.sqrt(shuffledItems.length)

      shuffledItems.forEach((item, i) => {
        item.gridRow = Math.floor(i / finalGridSize) + 1
        item.gridCol = (i % finalGridSize) + 1
        item.coordinate = `${String.fromCharCode(
          65 + Math.floor(i / finalGridSize)
        )}${(i % finalGridSize) + 1}`
      })

      dispatch({
        type: ACTIONS.LOAD_IMAGES,
        payload: shuffledItems,
      })
    }
    loadImages()
  }, [state.imageSet])

  useEffect(() => {
    if (state.gameStatus === 'evaluating') {
      const timer = setTimeout(() => {
        
        dispatch({ type: ACTIONS.FLIP_BACK })
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [state.gameStatus])

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (!['firstGuess', 'secondGuess'].includes(state.gameStatus)) return

      if (event.key === 'Backspace' || event.key === 'Delete') {
        dispatch({ type: ACTIONS.RM_COORD })
        return
      }

      const key = event.key.toUpperCase()

      if (state.coords.length === 0 && rowLabels.includes(key)) {
        dispatch({ type: ACTIONS.SET_COORD, payload: key })
        return
      }

      if (state.coords.length === 1 && columnLabels.includes(parseInt(key))) {
        dispatch({ type: ACTIONS.SET_COORD, payload: key })
        return
      }
    }

    document.addEventListener('keydown', handleKeyPress)

    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [state.gameStatus, state.coords, rowLabels, columnLabels])

  useEffect(() => {
    if (
      state.coords.length === 2 &&
      rowLabels.includes(state.coords[0]) &&
      columnLabels.includes(parseInt(state.coords[1]))
    ) {
      const targetCard = state.images.find(
        (img) => img.coordinate === state.coords
      )

      if (targetCard && !targetCard.isMatched && !targetCard.isFlipped) {
        dispatch({ type: ACTIONS.CARD_CLICK, payload: targetCard.id })
        dispatch({ type: ACTIONS.RM_COORD })
        dispatch({ type: ACTIONS.RM_COORD })
      } else {
        dispatch({ type: ACTIONS.RM_COORD })
        dispatch({ type: ACTIONS.RM_COORD })
      }
    }
  }, [state.coords, state.images, rowLabels, columnLabels])

  useEffect(() => {
    if (state.gameStatus === 'newGame') {
      setElapsedTime(0)
      setStartTime(null)
    }

    let timer

    if (
      ['firstGuess', 'secondGuess', 'evaluating'].includes(state.gameStatus)
    ) {
      timer = setInterval(() => {
        setElapsedTime((prev) => prev + 1)
      }, 1000)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [state.gameStatus])

  return {
    state,
    dispatch,
    elapsedTime,
    gridSize,
    isValidGrid,
    rowLabels,
    columnLabels,
    formatTime,
    ACTIONS,
  }
}
