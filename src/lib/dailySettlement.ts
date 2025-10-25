import { GameState, DailyStats } from './types';

export function calculateDailySettlement(gameState: GameState): DailyStats {
  const completedBookings = gameState.bookings.filter(b => 
    b.status === 'completed' && b.date === `Day ${gameState.currentDay}`
  );
  
  const revenue = completedBookings.reduce((sum, b) => sum + b.revenue, 0);
  const expenses = gameState.rooms.reduce((sum, room) => sum + room.rent, 0);
  const profit = revenue - expenses;
  const avgSatisfaction = completedBookings.length > 0
    ? completedBookings.reduce((sum, b) => sum + b.satisfaction, 0) / completedBookings.length
    : 0;
  
  return {
    day: gameState.currentDay,
    revenue,
    expenses,
    profit,
    avgSatisfaction,
    bookingsCompleted: completedBookings.length,
  };
}
