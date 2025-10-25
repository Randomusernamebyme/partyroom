export type RoomSize = 'small' | 'medium' | 'large' | 'xlarge';
export type ItemType = 'game' | 'entertainment' | 'decoration';
export type CustomerType = 'birthday' | 'friends' | 'company' | 'couple' | 'gaming';
export type BookingStatus = 'pending' | 'confirmed' | 'completed';
export type ScheduleActivity = 'cleaning' | 'install_item' | 'booking' | 'free';
export type ItemStatus = 'in_inventory' | 'installed' | 'broken';

export interface Room {
  id: string;
  name: string;
  size: RoomSize;
  capacity: number;
  maxItems: number;
  rent: number;
  items: string[];
  cleanliness: number; // 0-100
}

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  attraction: number;
  price: number;
  roomId: string | null;
  status: ItemStatus;
  installTime: number; // 安裝所需時間（小時）
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
  inventory: InventoryItem[];
  schedule: Schedule;
}

export interface DailyStats {
  day: number;
  revenue: number;
  expenses: number;
  profit: number;
  avgSatisfaction: number;
  bookingsCompleted: number;
}

export interface TimeSlot {
  time: string;
  activity: ScheduleActivity;
  roomId?: string;
  itemId?: string;
  description?: string;
}

export interface Schedule {
  day: number;
  slots: TimeSlot[];
}

export interface InventoryItem {
  id: string;
  name: string;
  type: ItemType;
  attraction: number;
  price: number;
  installTime: number;
  purchaseDate: string;
}
