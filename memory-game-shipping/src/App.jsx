//#region Imports
import { useState, useReducer, useEffect } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import viteLogo from '/vite.svg';
import ccLogo from './assets/cma.png';
import './App.css';

const imageModules = import.meta.glob('./assets/**/*.{png,jpg,jpeg,gif,svg}', { eager: false });
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

//#region Fisher-Yates random shuffle
  function randShuffle(images) {
    const shuffled = [...images];
    
    // Fisher-Yates shuffle
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap
    }
    return shuffled;
  }
//#endregion

//#region Reducer game logic
const initState = {
  gameStatus: "newGame",
  imageSet: "vessels",
  images: [],
  playerGuess: {first: null, second: null},
  moves: 0,
  mistakes: 0
};

const ACTIONS = {
  NEW_GAME: "NEW_GAME",
  LOAD_IMAGES: "LOAD_IMAGES",
  CARD_CLICK: "CARD_CLICK",
  FLIP_BACK: "FLIP_BACK"
};

function gameReducer (state, action) {
  switch (action.type) {
    case ACTIONS.NEW_GAME:
      console.log("games started")
      return {...state, gameStatus: "firstGuess"}

    case ACTIONS.LOAD_IMAGES:
      return {...state, images: action.payload}

    case ACTIONS.CARD_CLICK:
      const clickedCardId = action.payload;
      
      if (state.gameStatus === "firstGuess") {
        return {
          ...state,
          playerGuess: {
            ...state.playerGuess,
            first: clickedCardId
          },
          images: state.images.map(img =>
            img.id === clickedCardId
              ? { ...img, isFlipped: true }
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
        
        const isMatch = firstImage.pairId === secondImage.pairId;
        
        if (isMatch) {
          return {
            ...state,
            playerGuess: { first: null, second: null },
            images: state.images.map(img => {
              if (img.id === firstGuessId || img.id === secondGuessId) {
                return { ...img, isMatched: true, isFlipped: true };
              }
              return img;
            }),
            moves: state.moves + 1,
            gameStatus: "firstGuess"
          };
        } else {
          return {
            ...state,
            playerGuess: { first: firstGuessId, second: secondGuessId },
            images: state.images.map(img => {
              if (img.id === firstGuessId || img.id === secondGuessId) {
                return { ...img, isFlipped: true };
              }
              return img;
            }),
            moves: state.moves + 1,
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

    default: 
      return state
  }
}
//#endregion

//#region Memory Game

function MemoryGame() {
  const [state, dispatch] = useReducer(gameReducer, initState);

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
            isMatched : false
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
      }, 700);
      
      return () => clearTimeout(timer);
    }
  }, [state.gameStatus]);

  
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="grid grid-cols-4 gap-4 max-w-4xl mx-auto">
        {state.images.map((img) => (
          <button 
            key={img.id}
            disabled={img.isMatched}
            onClick={() => {dispatch({type: ACTIONS.CARD_CLICK, payload: img.id})}}
            className={`
              relative p-4 rounded-lg border-2 transition-all duration-300 transform hover:scale-105
              ${img.isFlipped 
                ? 'bg-white border-blue-500 shadow-lg' 
                : 'bg-blue-600 border-blue-700 hover:bg-blue-700'
              }
              ${img.isMatched 
                ? 'opacity-50 cursor-not-allowed' 
                : 'cursor-pointer'
              }
            `}
          >
            {img.isFlipped ? (
              <>
                <img 
                  src={img.src} 
                  alt={img.name}
                  className="w-full h-32 object-cover rounded-md mb-2"
                />
                <p className="text-sm font-medium text-gray-800">{img.name}</p>
              </>
            ) : (
              <div className="w-full h-32 flex items-center justify-center">
                <div className="text-white text-2xl font-bold">?</div>
              </div>
            )}
          </button>
        ))}
      </div>
      
      {state.gameStatus === 'newGame' && (
        <GameOverlay onNewGame = {() => {dispatch({ type: ACTIONS.NEW_GAME})}} />
      )}
    </div>
  )
}
//#endregion

//#region Game Overlay
const GameOverlay = ({ onNewGame }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-black p-8 rounded-2xl shadow-2xl border border-slate-700 max-w-md w-full mx-4 transform transition-all duration-300 hover:scale-105">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Play className="w-8 h-8 text-white ml-1" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Game Ready
          </h1>
          <p className="text-slate-400 text-sm">
            Ready to start your next adventure?
          </p>
        </div>

        {/* New Game Button */}
        <button
          onClick={onNewGame}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-102 active:scale-98 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group"
        >
          <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" />
          <span className="text-lg">Start New Game</span>
        </button>

        {/* Decorative Elements */}
        <div className="mt-6 flex justify-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-100"></div>
          <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse delay-200"></div>
        </div>

        {/* Subtle Pattern */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 pointer-events-none"></div>
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