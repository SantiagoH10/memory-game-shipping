//#region Imports
import { useState, useReducer, useEffect } from 'react';
import { Play, RotateCcw, Trophy } from 'lucide-react';
import ccLogo from './assets/cma.png';
import './App.css';

const imageModules = import.meta.glob('./assets/**/*.{png,jpg,jpeg,gif,svg}', { eager: false });

const IMAGE_SET_OPTIONS = [
  {title: "Vessels", folderName: "vessels", dim: "4x4"},
  {title: "Containers", folderName: "containers", dim: "6x6"}
];
//#endregion

//#region MS header
function MySociabble () {
  return(
    <header className="w-full bg-ccblue shadow-lg border-b-2 border-blue-700 -mt-2">
      <div className="container mx-auto py-8 px-6 text-center">
        <p className="font-ssp text-white text-lg md:text-2xl lg:text-3xl font-bold tracking-wide mb-6 max-w-4xl mx-auto leading-tight">
          WE IMAGINE BETTER WAYS TO SERVE A WORLD IN MOTION
        </p>
        <img 
          src={ccLogo} 
          alt="CMA CGM Logo" 
          className="mx-auto h-12 md:h-16 lg:h-20 filter brightness-0 invert transition-transform duration-300 hover:scale-105"
        />
      </div>
    </header>
  )
}
//#endregion

//#region Helper Functions
  // Fisher-Yates random shuffle

    function randShuffle(images) {
      const shuffled = [...images];
      
      // Fisher-Yates shuffle
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap
      }
      return shuffled;
    }

    //Format time as MM:SS
    const formatTime = (seconds) => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };
//#endregion

//#region Reducer game logic
const initState = {
  gameStatus: "newGame",
  imageSet: "vessels",
  images: [],
  playerGuess: {first: null, second: null},
  moves: 0,
  mistakes: 0,
  coords: ""
};

const ACTIONS = {
  NEW_GAME: "NEW_GAME",
  LOAD_IMAGES: "LOAD_IMAGES",
  CHANGE_IMAGE_SET: "CHANGE_IMAGE_SET",
  CARD_CLICK: "CARD_CLICK",
  FLIP_BACK: "FLIP_BACK",
  SET_COORD: "SET_COORD",
  RM_COORD: "RM_COORD"
};

function gameReducer (state, action) {
  switch (action.type) {
    case ACTIONS.NEW_GAME:
      const resetImages = state.images.map(img => ({
        ...img,
        isFlipped: false,
        isMatched: false,
        flipCounter: 0
      }));

      const shuffledImages = randShuffle(resetImages);
      
      const finalGridSize = Math.sqrt(shuffledImages.length);
      shuffledImages.forEach((img, i) => {
        img.gridRow = Math.floor(i / finalGridSize);
        img.gridCol = i % finalGridSize;
        img.coordinate = `${String.fromCharCode(65 + Math.floor(i / finalGridSize))}${(i % finalGridSize) + 1}`;
      });

      return {
        ...state,
        playerGuess: { first: null, second: null }, 
        moves: 0,
        mistakes: 0,
        images: shuffledImages,
        gameStatus: "firstGuess"
    }

    case ACTIONS.LOAD_IMAGES:
      return {...state, images: action.payload}

    case ACTIONS.CARD_CLICK:
      const clickedCardId = action.payload;
      
      if (state.gameStatus === "firstGuess") {
        const clickedCard = state.images.find(img => img.id === clickedCardId);
        const newFlipCounter = clickedCard.flipCounter + 1;

        return {
          ...state,
          playerGuess: {
            ...state.playerGuess,
            first: clickedCardId
          },
          images: state.images.map(img =>
            img.id === clickedCardId
              ? { ...img, isFlipped: true, flipCounter: newFlipCounter }
              : img
          ),
          moves: state.moves + 1,
          gameStatus: "secondGuess"
        };
      } 
      
      else if (state.gameStatus === "secondGuess") {
        const firstGuessId = state.playerGuess.first;
        const secondGuessId = clickedCardId;
        
        const firstImage = state.images.find(img => img.id === firstGuessId);
        const secondImage = state.images.find(img => img.id === secondGuessId);
        const secondCardNewFlipCounter = secondImage.flipCounter + 1;
        
        const isMatch = firstImage.pairId === secondImage.pairId;
        
        if (isMatch) {
          const updatedImages = state.images.map(img => {
            if (img.id === firstGuessId || img.id === secondGuessId) {
              return { 
                ...img, 
                isMatched: true, 
                isFlipped: true,
                flipCounter: img.id === secondGuessId ? secondCardNewFlipCounter : img.flipCounter
              };
            }
            return img;
          });

          const allMatched = updatedImages.every(img => img.isMatched);

          return {
            ...state,
            playerGuess: { first: null, second: null },
            images: updatedImages,
            moves: state.moves + 1,
            gameStatus: allMatched ? "gameOver" : "firstGuess"
          };
        } else {
          // Only count mistakes when guess is wrong AND cards were seen before
          const firstCardMistake = firstImage.flipCounter > 1;
          const secondCardMistake = secondCardNewFlipCounter > 1;
          const totalMistakes = (firstCardMistake ? 1 : 0) + (secondCardMistake ? 1 : 0);

          return {
            ...state,
            playerGuess: { first: firstGuessId, second: secondGuessId },
            images: state.images.map(img => {
              if (img.id === firstGuessId || img.id === secondGuessId) {
                return { 
                  ...img, 
                  isFlipped: true,
                  flipCounter: img.id === secondGuessId ? secondCardNewFlipCounter : img.flipCounter
                };
              }
              return img;
            }),
            moves: state.moves + 1,
            mistakes: state.mistakes + totalMistakes,
            gameStatus: "evaluating"
          };
        }
      }

    case ACTIONS.FLIP_BACK:
      return {
        ...state,
        playerGuess: { first: null, second: null },
        images: state.images.map(img => {
          // Only flip back cards that are flipped but not matched
          if (img.isFlipped && !img.isMatched) {
            return { ...img, isFlipped: false };
          }
          return img;
        }),
        gameStatus: "firstGuess"
      };

    case ACTIONS.SET_COORD:
      return {
        ...state,
          coords: state.coords + action.payload
      }

    case ACTIONS.RM_COORD:
      return {
        ...state,
          coords: state.coords.slice(0, -1)
      }


    case ACTIONS.CHANGE_IMAGE_SET:
      return {
        ...state,
        imageSet: action.payload,
        playerGuess: { first: null, second: null }, 
        moves: 0,
        mistakes: 0,
        images: [],
        gameStatus: "newGame",
        coords: ""
      }

    default: 
      return state
  }
}
//#endregion

//#region Memory Game
function MemoryGame() {
  const [state, dispatch] = useReducer(gameReducer, initState);

  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState(null);

  const gridSize = Math.sqrt(state.images.length);
  const isValidGrid = Number.isInteger(gridSize) && gridSize > 0;
  
  const rowLabels = Array.from({length: gridSize}, (_, i) => String.fromCharCode(65 + i));
  const columnLabels = Array.from({length: gridSize}, (_, i) => i + 1);

  useEffect(() => {
    const loadImages = async () => {
      const { default: config} = await import(`./assets/${state.imageSet}/config.json`);
      const images = await Promise.all(
        config.images.map(async (img) => {
          const imagePath = `./assets/${state.imageSet}/${img.filename}`;
          const imageModule = await imageModules[imagePath]();
          return {
            name: img.name,
            src: imageModule.default,
            isFlipped : false,
            isMatched : false,
            flipCounter: 0
          };
        })
      );
         
      const dupImages = images.flatMap((img, i) => {
        img.pairId = i;
        return [img, {...img}]
      });

      dupImages.forEach((img, i) => {
        img.id = i;
      });

      const shuffledImages = randShuffle(dupImages);

      const finalGridSize = Math.sqrt(shuffledImages.length);

      shuffledImages.forEach((img, i) => {
        img.gridRow = Math.floor(i / finalGridSize)+1;
        img.gridCol = i % finalGridSize+1;
        img.coordinate = `${String.fromCharCode(65 + Math.floor(i / finalGridSize))}${(i % finalGridSize) + 1}`;
      });
      
      dispatch({ 
        type: ACTIONS.LOAD_IMAGES, 
        payload: shuffledImages
      });
    };
    
    loadImages();

  },[state.imageSet]);

  useEffect(() => {
    if (state.gameStatus === "evaluating") {
      const timer = setTimeout(() => {
        dispatch({ type: ACTIONS.FLIP_BACK });
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [state.gameStatus]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (!['firstGuess', 'secondGuess'].includes(state.gameStatus)) return;

      if (event.key === "Backspace" || event.key === "Delete") {
        dispatch({ type: ACTIONS.RM_COORD});
        return;
      }

      const key = event.key.toUpperCase();

      if (state.coords.length === 0 && rowLabels.includes(key)) {
        dispatch({ type: ACTIONS.SET_COORD, payload: key });
        return;
      }

      if (state.coords.length === 1 && columnLabels.includes(parseInt(key))) {
        dispatch({ type: ACTIONS.SET_COORD, payload: key });
        return;
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };

  },[state.gameStatus, state.coords, rowLabels, columnLabels]);

  useEffect(() => {
    if (state.coords.length === 2 && rowLabels.includes(state.coords[0]) && columnLabels.includes(parseInt(state.coords[1]))) {
      const targetCard = state.images.find(img => img.coordinate === state.coords);
      
      if (targetCard && !targetCard.isMatched && !targetCard.isFlipped) {
        dispatch({ type: ACTIONS.CARD_CLICK, payload: targetCard.id });
        dispatch({ type: ACTIONS.RM_COORD });
        dispatch({ type: ACTIONS.RM_COORD });
      } else {
        dispatch({ type: ACTIONS.RM_COORD });
        dispatch({ type: ACTIONS.RM_COORD });
      }
    }
  }, [state.coords, state.images, rowLabels, columnLabels]);
  
  useEffect(() => {
    if (state.gameStatus === 'newGame') {
      setElapsedTime(0);
      setStartTime(null);
    }
    
    let timer;
    
    if (['firstGuess', 'secondGuess', 'evaluating'].includes(state.gameStatus)) {
      timer = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [state.gameStatus]);


  if (!isValidGrid) {
    return (
      <div className="p-6 bg-gray-200 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Invalid Grid</h2>
          <p className="text-gray-700">
            Incorrect number of cards ({state.images.length}). 
            Need a perfect square number like 16, 25, or 36 cards.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-3 bg-ccblue">
      <GameSelector 
        currentImageSet={state.imageSet}
        onImageSetChange={(imageSet) => {dispatch({ type: ACTIONS.CHANGE_IMAGE_SET, payload: imageSet })}}
      />
      <div className="relative bg-gray-200 rounded-lg p-2">

      <GameDashboard coords={state.coords} moves={state.moves} time={formatTime(elapsedTime)} mistakes={state.mistakes} />
      <div className={`grid gap-4 max-w-5xl mx-auto`} 
          style={{ 
            gridTemplateColumns: `auto repeat(${gridSize}, 1fr)`,
            gridTemplateRows: `auto repeat(${gridSize}, 1fr)`
          }}>
        
        {/* Empty top-left corner */}
        <div className="flex items-center justify-center"></div>
        
        {/* Column numbers header */}
        {columnLabels.map((num, index) => (
          <div key={`col-${index}`} className="flex items-center justify-center h-8">
            <span className="text-lg font-bold text-gray-600 bg-gray-300 px-3 py-1 rounded-md">
              {num}
            </span>
          </div>
        ))}
        
        {/* Rows with labels and cards */}
        {rowLabels.map((letter, rowIndex) => (
          <>
            {/* Row letter label */}
            <div key={`row-${rowIndex}`} className="flex items-center justify-center">
              <span className="text-lg font-bold text-gray-600 bg-gray-300 px-3 py-1 rounded-md">
                {letter}
              </span>
            </div>
            
            {/* Cards for this row */}
            {state.images.slice(rowIndex * gridSize, (rowIndex + 1) * gridSize).map((img) => (
              <button 
              key={img.id}
              disabled={img.isMatched || img.isFlipped}
              onClick={() => {dispatch({type: ACTIONS.CARD_CLICK, payload: img.id})}}
              className={`
                relative p-1 rounded-lg border-2 h-44
                ${img.isFlipped 
                  ? 'bg-white border-ccaqua shadow-lg' 
                  : 'bg-blue-500 hover:bg-blue-400'
                }
                ${img.isMatched 
                  ? 'bg-green-100 border-green-400 shadow-green-400/50 shadow-xl' 
                  : 'cursor-pointer transition-all duration-300 transform hover:scale-105'
                }
                `}
                >
                {img.isFlipped ? (
                  <>
                    <img 
                      src={img.src} 
                      alt={img.name}
                      className="w-full h-32 object-cover rounded-md mb-1"
                      />
                    <p className="text-sm font-bold text-gray-800">{img.name}</p>
                  </>
                ) : (
                  <div className="w-full h-32 flex items-center justify-center">
                    <div className="text-white text-2xl font-bold">{img.coordinate}</div>
                  </div>
                )}
              </button>
            ))}
          </>
        ))}
      </div>
      
      {(state.gameStatus === 'newGame' || state.gameStatus === 'gameOver') && (
        <GameOverlay 
        onNewGame={() => {dispatch({ type: ACTIONS.NEW_GAME })}}
        gameStatus={state.gameStatus}
        moves={state.moves}
        mistakes={state.mistakes}
        imgLength={state.images.length}
        time={formatTime(elapsedTime)}
        />
      )}
    </div>
    </div>
  );
}
//#endregion

//#region Game selector
function GameSelector({ currentImageSet, onImageSetChange }) {
  return (
    <div className="w-full bg-gray-200 rounded-lg shadow-lg border-b-2 border-gray-200 py-4 px-6 mb-6">
      <div className="max-w-6xl mx-auto">        
        <div className="flex justify-center items-center gap-5 flex-wrap">
          {IMAGE_SET_OPTIONS.map((set, i) => (
            <button 
              key={i}
              onClick={() => {onImageSetChange(set.folderName)}}
              className={`
                px-6 py-3 rounded-lg border-2 transition-all duration-200 transform hover:scale-105 hover:shadow-md
                ${currentImageSet === set.folderName 
                  ? 'border-ccblue bg-ccblue text-white shadow-lg' 
                  : 'bg-gray-50 border-gray-300 text-gray-700 hover:border-blue-300'
                }
                min-w-[140px] text-center font-medium
              `}
              
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm font-bold">{set.title}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  currentImageSet === set.folderName 
                    ? 'bg-white/20 text-white/90' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {set.dim}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
//#region Game Dashboard
function GameDashboard({ coords, moves, time, mistakes }) {
  return (
    <div className="inset-0 p-2 m-1 mb-3 bg-opacity-75 backdrop-blur-sm flex flex-col items-center justify-center z-50 gap-4">
      <div className="flex justify-center items-center gap-4">
        <div className="px-6 py-3 rounded-xl shadow-lg w-[140px] h-14 flex items-center justify-center" style={{backgroundColor: '#096B68', borderColor: '#096B68', borderWidth: '2px'}}>
          <span className="text-lg font-bold" style={{color: '#FFFBDE'}}>Moves: {moves}</span>
        </div>
        
        <div className="px-6 py-3 rounded-xl shadow-lg w-[140px] h-14 flex items-center justify-center" style={{backgroundColor: '#90D1CA', borderColor: '#90D1CA', borderWidth: '2px'}}>
          <span className="text-2xl" style={{color: '#096B68'}}>{time}</span>
        </div>
        
        <div className="px-6 py-3 rounded-xl shadow-lg w-[140px] h-14 flex items-center justify-center" style={{backgroundColor: '#096B68', borderColor: '#096B68', borderWidth: '2px'}}>
          <span className="text-lg font-bold" style={{color: '#FFFBDE'}}>Mistakes: {mistakes}</span>
        </div>
      </div>
      
      <div className="px-4 py-2 rounded-lg shadow-md w-[45px] h-[45px] flex items-center justify-center" style={{backgroundColor: '#FFFBDE', borderColor: '#FFFBDE', borderWidth: '2px'}}>
        <span className="text-xl font-bold" style={{color: '#096B68'}}>{coords || '\u00A0'}</span>
      </div>
    </div>
  )
}
//#endregion

//#region Game Overlay
const GameOverlay = ({ onNewGame, moves, mistakes, gameStatus, imgLength, time}) => {

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        onNewGame();
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [onNewGame]);

  const isGameOver = gameStatus === 'gameOver';
  
  const totalCards = imgLength ? imgLength : 0;
  const optimalMoves = totalCards + (totalCards / (2 - 1));
  
  const efficiency = moves > 0 ? Math.round((optimalMoves / moves) * 100) : 0;
  
  const isPerfectMemory = moves === optimalMoves;
  
  return (
    <div className="absolute inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-black p-8 rounded-2xl shadow-2xl border border-slate-700 max-w-md w-full mx-4 transform transition-all duration-300 hover:scale-105">
        <div className="text-center mb-8">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg ${
            isGameOver 
              ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
              : 'bg-gradient-to-r from-blue-500 to-purple-600'
          }`}>
            {isGameOver ? (
              <Trophy className="w-8 h-8 text-white" />
            ) : (
              <Play className="w-8 h-8 text-white ml-1" />
            )}
          </div>
          
          <h1 className={`text-3xl font-bold text-white mb-2 bg-clip-text text-transparent ${
            isGameOver 
              ? 'bg-gradient-to-r from-green-400 to-emerald-400' 
              : 'bg-gradient-to-r from-blue-400 to-purple-400'
          }`}>
            {isGameOver ? 'Congratulations!' : 'Game Ready'}
          </h1>
          
          <p className="text-slate-400 text-sm">
            {isGameOver 
              ? 'You completed the memory game!' 
              : 'Ready to start your next adventure?'
            }
          </p>
        </div>

        {isGameOver && (
          <div className="bg-slate-700/50 rounded-lg p-4 mb-6 border border-slate-600">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white">{moves}</div>
                <div className="text-sm text-slate-400">Moves</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{mistakes}</div>
                <div className="text-sm text-slate-400">Mistakes</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{time}</div>
                <div className="text-sm text-slate-400">Time</div>
              </div>
            </div>
            
            <div className="mt-3 text-center">
              {isPerfectMemory ? (
                <div className="flex items-center justify-center gap-2">
                  <Brain className="w-5 h-5 text-purple-400" />
                  <span className="text-sm font-medium text-purple-400">
                    Perfect Memory!
                  </span>
                </div>
              ) : (
                <div className="space-y-1">
                  <span className={`text-sm font-medium ${
                    mistakes <= 2 ? 'text-green-400' : 
                    mistakes <= 5 ? 'text-yellow-400' : 'text-orange-400'
                  }`}>
                    {mistakes <= 2 ? 'Excellent memory!' : 
                     mistakes <= 5 ? 'Good job!' : 'Keep practicing!'}
                  </span>
                  <div className="text-xs text-slate-500">
                      {console.log(optimalMoves)}
                    Optimal: {optimalMoves} moves ({efficiency}% efficiency)
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* New Game Button */}
        <button
          onClick={onNewGame}
          className={`w-full font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-102 active:scale-98 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group text-white ${
            isGameOver 
              ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700' 
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
          }`}
        >
          <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" />
          <span className="text-lg">
            {isGameOver ? 'Play Again' : 'Start New Game'}
          </span>
        </button>

        {/* Decorative Elements */}
        <div className="mt-6 flex justify-center space-x-2">
          <div className={`w-2 h-2 rounded-full animate-pulse ${
            isGameOver ? 'bg-green-500' : 'bg-blue-500'
          }`}></div>
          <div className={`w-2 h-2 rounded-full animate-pulse delay-100 ${
            isGameOver ? 'bg-emerald-500' : 'bg-purple-500'
          }`}></div>
          <div className={`w-2 h-2 rounded-full animate-pulse delay-200 ${
            isGameOver ? 'bg-teal-500' : 'bg-pink-500'
          }`}></div>
        </div>

        {/* Subtle Pattern */}
        <div className={`absolute inset-0 rounded-2xl pointer-events-none ${
          isGameOver 
            ? 'bg-gradient-to-r from-green-500/5 to-emerald-500/5' 
            : 'bg-gradient-to-r from-blue-500/5 to-purple-500/5'
        }`}></div>
      </div>
    </div>
  );
};
//#endregion

//#region App
function App() {
  return (
    <div className="m-0 p-0">
        <MySociabble/>
        <MemoryGame/>
    </div>
  )
}

export default App
//#endregion