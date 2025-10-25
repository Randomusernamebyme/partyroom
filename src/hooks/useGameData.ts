import { useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { loadGameState, saveGameState, initializeNewGame } from '@/lib/firestore';

export function useGameData(userId: string | null) {
  const gameState = useGameStore();

  useEffect(() => {
    if (!userId) return;

    loadGameState(userId).then((state) => {
      if (state) {
        gameState.setGameState(state);
      } else {
        initializeNewGame(userId).then((newState) => {
          gameState.setGameState(newState);
        });
      }
    });
  }, [userId]);

  const saveGame = async () => {
    if (!userId) return;
    await saveGameState(userId, gameState);
  };

  return { saveGame };
}
