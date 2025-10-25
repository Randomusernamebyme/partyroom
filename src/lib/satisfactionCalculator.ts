import { Booking, Room, Item } from './types';

export function calculateSatisfaction(
  booking: Booking,
  room: Room,
  items: Item[]
): number {
  let score = 50; // 基礎分
  
  // 房間大小匹配
  const capacityMatch = room.capacity >= booking.peopleCount;
  score += capacityMatch ? 20 : -20;
  
  // 需求匹配
  const roomItems = items.filter(item => room.items.includes(item.id));
  const matchedRequirements = booking.requirements.filter(req =>
    roomItems.some(item => item.type.includes(req) || item.name.includes(req))
  );
  score += (matchedRequirements.length / booking.requirements.length) * 30;
  
  // 吸引力加成
  const totalAttraction = roomItems.reduce((sum, item) => sum + item.attraction, 0);
  score += Math.min(totalAttraction / 10, 20);
  
  return Math.max(0, Math.min(100, score));
}

export function calculateRevenue(booking: Booking, satisfaction: number): number {
  const baseRevenue = booking.peopleCount * 50; // 每人基礎收費
  const satisfactionMultiplier = satisfaction / 100;
  return Math.floor(baseRevenue * satisfactionMultiplier);
}
