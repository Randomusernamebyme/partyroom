export type RoomSize = 'small' | 'medium' | 'large' | 'xlarge';
export type ItemType = 'game' | 'entertainment' | 'decoration';
export type CustomerType = 'birthday' | 'friends' | 'company' | 'couple' | 'gaming';
export type BookingStatus = 'pending' | 'confirmed' | 'completed';

export interface Room {
  id: string;
  name: string;
  size: RoomSize;
  capacity: number;
  maxItems: number;
  rent: number;
  items: string[];
}

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  attraction: number;
  price: number;
  roomId: string | null;
}

export interface Booking {
  id: string;
  customerName: string;
  customerType: CustomerType;
  peopleCount: number;
  requirements: string[];
  roomId: string | null;
  timeSlot: string;
  date: string;
  satisfaction: number;
  revenue: number;
  status: BookingStatus;
}

export interface GameState {
  userId: string;
  currentDay: number;
  money: number;
  reputation: number;
  rooms: Room[];
  items: Item[];
  bookings: Booking[];
  dailyStats: DailyStats[];
}

export interface DailyStats {
  day: number;
  revenue: number;
  expenses: number;
  profit: number;
  avgSatisfaction: number;
  bookingsCompleted: number;
}
