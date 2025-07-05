import { collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from './firebase.js'

export const saveGameResult = async (gameData) => {
  try {
    const docRef = await addDoc(collection(db, "memoryGameResults"), {
      ...gameData,
      timestamp: new Date().toISOString(),
      createdAt: Date.now()
    });
    console.log("Game result saved with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error saving game result: ", error);
    throw error;
  }
};