import { useState, useReducer, useEffect } from 'react'
import { randShuffle, formatTime, getBestGridSize } from '../utils/helpers.js'
import { initState, ACTIONS, gameReducer } from '../utils/gameLogic.js'
import { ICON_MAP } from '../utils/icons.jsx'
import { saveGameResult } from '../firebase/db.js'

export function useMemoryGame() {
  const [state, dispatch] = useReducer(gameReducer, initState)

  const [elapsedTime, setElapsedTime] = useState(0)
  const [timerActive, setTimerActive] = useState(false)
  const [finalTime, setFinalTime] = useState(0)

  const { gridSize, rowLabels, columnLabels } = state
  const isValidGrid = gridSize?.rows > 0 && gridSize?.cols > 0

  //#region Load Images
  useEffect(() => {
    const loadImages = async () => {
      // Load master config based on content type
      const { default: masterConfig } = await import(
        `../assets/${state.contentType}.json`
      )

      // Calculate how many pairs we need based on the target size
      const targetPairs = state.size / 2

      // Get available pairs from master config
      const availablePairs = {}
      masterConfig.icons.forEach(item => {
        if (!availablePairs[item.pairId]) {
          availablePairs[item.pairId] = []
        }
        availablePairs[item.pairId].push(item)
      })

      // Randomly select the required number of pairs
      const allPairIds = Object.keys(availablePairs)
      const shuffledPairIds = randShuffle(allPairIds)
      const selectedPairIds = shuffledPairIds.slice(0, targetPairs)

      // Create the final items array with selected pairs
      const items = []
      selectedPairIds.forEach(pairId => {
        availablePairs[pairId].forEach(iconConfig => {
          items.push({
            name: iconConfig.name,
            iconComponent:
              iconConfig.type === 'icon' ? ICON_MAP[iconConfig.icon] : null,
            displayText: iconConfig.displayText || null,
            color: iconConfig.color,
            pairId: iconConfig.pairId,
            type: iconConfig.type,
            isFlipped: false,
            isMatched: false,
            flipCounter: 0,
          })
        })
      })

      items.forEach((item, i) => {
        item.id = i
      })

      const shuffledItems = randShuffle(items)

      // Calculate gridSize based on the target size
      const currentGridSize = getBestGridSize(state.size)
      const currentRowLabels = Array.from(
        { length: currentGridSize.rows },
        (_, i) => String.fromCharCode(65 + i),
      )
      const currentColumnLabels = Array.from(
        { length: currentGridSize.cols },
        (_, i) => i + 1,
      )

      shuffledItems.forEach((item, i) => {
        const rowIndex = Math.floor(i / currentGridSize.cols)
        const colIndex = i % currentGridSize.cols

        item.gridRow = rowIndex + 1
        item.gridCol = colIndex + 1
        item.coordinate = `${currentRowLabels[rowIndex]}${currentColumnLabels[colIndex]}`
      })

      dispatch({
        type: ACTIONS.LOAD_IMAGES,
        payload: {
          images: shuffledItems,
          gridSize: currentGridSize,
          rowLabels: currentRowLabels,
          columnLabels: currentColumnLabels,
        },
      })
    }
    loadImages()
  }, [state.gameVersion, state.contentType, state.size])
  //#endregion

  //#region Handle card flip
  useEffect(() => {
    if (state.gameStatus === 'evaluating') {
      const timer = setTimeout(() => {
        dispatch({ type: ACTIONS.FLIP_BACK })
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [state.gameStatus])
  //#endregion

  //#region Keyboard functionality and coordinates matching
  useEffect(() => {
    const handleKeyPress = event => {
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
        img => img.coordinate === state.coords,
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
  //#endregion

  //#region Timer control logic
  useEffect(() => {
    if (['newGame', 'gameOver'].includes(state.gameStatus)) {
      if (state.gameStatus === 'gameOver' && elapsedTime > 0) {
        setFinalTime(elapsedTime)
      } else if (state.gameStatus === 'newGame') {
        setFinalTime(0)
      }
      setElapsedTime(0)
      setTimerActive(false)
    } else if (state.gameStatus === 'firstGuess' && !timerActive) {
      setTimerActive(true)
    } else if (state.gameStatus === 'gameOver') {
      setTimerActive(false)
    }
  }, [state.gameStatus, timerActive, elapsedTime])

  useEffect(() => {
    let timer
    if (timerActive) {
      timer = setInterval(() => {
        setElapsedTime(prev => prev + 1)
      }, 1000)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [timerActive])
  //#endregion

  //#region Save result in Firebase
  useEffect(() => {
    if (state.gameStatus === 'gameOver') {
      const saveGame = async () => {
        const gameData = {
          game: state.contentType,
          cardNum: state.size,
          moves: state.moves,
          mistakes: state.mistakes,
          time: finalTime,
        }

        try {
          await saveGameResult(gameData)
        } catch (error) {
          console.error('Failed to save game:', error)
        }
      }
      saveGame()
    }
  }, [state.gameStatus])
  //#endregion

  return {
    state,
    dispatch,
    finalTime,
    elapsedTime,
    gridSize: gridSize || { rows: 0, cols: 0 },
    isValidGrid,
    rowLabels: rowLabels || [],
    columnLabels: columnLabels || [],
    ACTIONS,
  }
}
