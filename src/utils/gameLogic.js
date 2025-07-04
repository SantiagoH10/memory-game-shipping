import { randShuffle, formatTime, getBestGridSize } from './helpers.js'

export const initState = {
  gameStatus: 'newGame',
  imageSet: 'symbols-10',
  gameVersion: 0,
  images: [],
  gridSize: { rows: 0, cols: 0 },
  rowLabels: [],
  columnLabels: [],
  playerGuess: { first: null, second: null },
  moves: 0,
  mistakes: 0,
  coords: '',
}

export const ACTIONS = {
  NEW_GAME: 'NEW_GAME',
  LOAD_IMAGES: 'LOAD_IMAGES',
  CHANGE_IMAGE_SET: 'CHANGE_IMAGE_SET',
  CARD_CLICK: 'CARD_CLICK',
  FLIP_BACK: 'FLIP_BACK',
  SET_COORD: 'SET_COORD',
  RM_COORD: 'RM_COORD',
}

export function gameReducer(state, action) {
  switch (action.type) {
    case ACTIONS.NEW_GAME:
      const resetImages = state.images.map((img) => ({
        ...img,
        isFlipped: false,
        isMatched: false,
        flipCounter: 0,
      }))

      const shuffledImages = randShuffle(resetImages)

      // Use the current grid data from state to reassign coordinates
      shuffledImages.forEach((img, i) => {
        const rowIndex = Math.floor(i / state.gridSize.cols)
        const colIndex = i % state.gridSize.cols

        img.gridRow = rowIndex + 1
        img.gridCol = colIndex + 1
        img.coordinate = `${state.rowLabels[rowIndex]}${state.columnLabels[colIndex]}`
      })

      return {
        ...state,
        playerGuess: { first: null, second: null },
        moves: 0,
        mistakes: 0,
        images: shuffledImages,
        gameStatus: 'firstGuess',
        gameVersion: state.gameVersion + 1,
        coords: '',
      }

    case ACTIONS.LOAD_IMAGES:
      return {
        ...state,
        images: action.payload.images,
        gridSize: action.payload.gridSize,
        rowLabels: action.payload.rowLabels,
        columnLabels: action.payload.columnLabels,
      }

    case ACTIONS.CARD_CLICK:
      const clickedCardId = action.payload

      if (state.gameStatus === 'firstGuess') {
        const clickedCard = state.images.find((img) => img.id === clickedCardId)
        const newFlipCounter = clickedCard.flipCounter + 1

        return {
          ...state,
          playerGuess: {
            ...state.playerGuess,
            first: clickedCardId,
          },
          images: state.images.map((img) =>
            img.id === clickedCardId
              ? { ...img, isFlipped: true, flipCounter: newFlipCounter }
              : img
          ),
          moves: state.moves + 1,
          gameStatus: 'secondGuess',
        }
      } else if (state.gameStatus === 'secondGuess') {
        const firstGuessId = state.playerGuess.first
        const secondGuessId = clickedCardId

        const firstImage = state.images.find((img) => img.id === firstGuessId)
        const secondImage = state.images.find((img) => img.id === secondGuessId)
        const secondCardNewFlipCounter = secondImage.flipCounter + 1

        const isMatch = firstImage.pairId === secondImage.pairId

        if (isMatch) {
          const updatedImages = state.images.map((img) => {
            if (img.id === firstGuessId || img.id === secondGuessId) {
              return {
                ...img,
                isMatched: true,
                isFlipped: true,
                flipCounter:
                  img.id === secondGuessId
                    ? secondCardNewFlipCounter
                    : img.flipCounter,
              }
            }
            return img
          })

          const allMatched = updatedImages.every((img) => img.isMatched)

          return {
            ...state,
            playerGuess: { first: null, second: null },
            images: updatedImages,
            moves: state.moves + 1,
            gameStatus: allMatched ? 'gameOver' : 'firstGuess',
          }
        } else {
          // Only count mistakes when guess is wrong AND cards were seen before
          const firstCardMistake = firstImage.flipCounter > 1
          const secondCardMistake = secondCardNewFlipCounter > 1
          const totalMistakes =
            (firstCardMistake ? 1 : 0) + (secondCardMistake ? 1 : 0)

          return {
            ...state,
            playerGuess: { first: firstGuessId, second: secondGuessId },
            images: state.images.map((img) => {
              if (img.id === firstGuessId || img.id === secondGuessId) {
                return {
                  ...img,
                  isFlipped: true,
                  flipCounter:
                    img.id === secondGuessId
                      ? secondCardNewFlipCounter
                      : img.flipCounter,
                }
              }
              return img
            }),
            moves: state.moves + 1,
            mistakes: state.mistakes + totalMistakes,
            gameStatus: 'evaluating',
          }
        }
      }
      break

    case ACTIONS.FLIP_BACK:
      return {
        ...state,
        playerGuess: { first: null, second: null },
        images: state.images.map((img) => {
          // Only flip back cards that are flipped but not matched
          if (img.isFlipped && !img.isMatched) {
            return { ...img, isFlipped: false }
          }
          return img
        }),
        gameStatus: 'firstGuess',
      }

    case ACTIONS.SET_COORD:
      return {
        ...state,
        coords: state.coords + action.payload,
      }

    case ACTIONS.RM_COORD:
      return {
        ...state,
        coords: state.coords.slice(0, -1),
      }

    case ACTIONS.CHANGE_IMAGE_SET:
      console.log("changing image set")
      return {
        ...state,
        gameStatus: 'newGame',
        imageSet: action.payload.imageSet,
        images: [],
        gameVersion: state.gameVersion + 1,
        playerGuess: { first: null, second: null },
        moves: 0,
        mistakes: 0,
        gridSize: { rows: 0, cols: 0 },
        rowLabels: [],
        columnLabels: [],
        coords: '',
      }

    default:
      return state
  }
}
