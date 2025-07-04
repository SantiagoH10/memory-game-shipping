import { createContext, useContext } from 'react'
import { useMemoryGame } from '../hooks/useMemoryGame.jsx'

//#region Game Context
const GameContext = createContext()

export function useGameContext() {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGameContext must be used within GameProvider')
  }
  return context
}

export function GameProvider({ children }) {
  const gameState = useMemoryGame()
  return (
    <GameContext.Provider value={gameState}>{children}</GameContext.Provider>
  )
}
//#endregion
