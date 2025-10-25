import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { GameState } from './types';

export async function loadGameState(userId: string): Promise<GameState | null> {
  const docRef = doc(db, 'users', userId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() as GameState : null;
}

export async function saveGameState(userId: string, gameState: GameState) {
  const docRef = doc(db, 'users', userId);
  await setDoc(docRef, gameState);
}

export async function initializeNewGame(userId: string): Promise<GameState> {
  const initialState: GameState = {
    userId,
    currentDay: 1,
    money: 10000,
    reputation: 50,
    rooms: [{
      id: 'room-1',
      name: '房間 1',
      size: 'small',
      capacity: 3,
      maxItems: 8,
      rent: 500,
      items: [],
      cleanliness: 100,
    }],
    items: [],
    bookings: [],
    dailyStats: [],
    inventory: [],
    schedule: {
      day: 1,
      slots: []
    },
  };
  await saveGameState(userId, initialState);
  return initialState;
}
