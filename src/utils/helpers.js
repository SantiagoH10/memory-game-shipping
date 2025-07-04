// Fisher-Yates random shuffle
export function randShuffle(images) {
  const shuffled = [...images]

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  return shuffled
}

//Format time as MM:SS
export const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
    .toString()
    .padStart(2, '0')}`
}

//Best grid size calculator
export function getBestGridSize(itemCount) {
  if (itemCount === 0) return { rows: 0, cols: 0 }
  
  // For perfect squares, use square grid
  const sqrt = Math.sqrt(itemCount)
  if (Number.isInteger(sqrt)) {
    return { rows: sqrt, cols: sqrt }
  }
  
  // Find the rectangle closest to square
  let bestRows = 1
  let bestCols = itemCount
  let bestRatio = itemCount // worst case ratio
  
  for (let rows = 1; rows <= Math.ceil(sqrt); rows++) {
    const cols = Math.ceil(itemCount / rows)
    const ratio = Math.max(rows, cols) / Math.min(rows, cols)
    
    if (ratio < bestRatio) {
      bestRatio = ratio
      bestRows = rows
      bestCols = cols
    }
  }
  
  return { rows: bestRows, cols: bestCols }
}