import { create } from 'zustand';
import { GameState, Room, Item, Booking } from '@/lib/types';

interface GameStore extends GameState {
  setGameState: (state: Partial<GameState>) => void;
  addRoom: (room: Room) => void;
  addItem: (item: Item) => void;
  assignItemToRoom: (itemId: string, roomId: string) => void;
  addBooking: (booking: Booking) => void;
  updateBooking: (bookingId: string, updates: Partial<Booking>) => void;
  endDay: () => void;
  spendMoney: (amount: number) => void;
}

export const useGameStore = create<GameStore>((set) => ({
  userId: '',
  currentDay: 1,
  money: 10000,
  reputation: 50,
  rooms: [],
  items: [],
  bookings: [],
  dailyStats: [],
  
  setGameState: (state) => set(state),
  addRoom: (room) => set((state) => ({ rooms: [...state.rooms, room] })),
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  assignItemToRoom: (itemId, roomId) => set((state) => ({
    items: state.items.map(item => 
      item.id === itemId ? { ...item, roomId } : item
    ),
    rooms: state.rooms.map(room =>
      room.id === roomId ? { ...room, items: [...room.items, itemId] } : room
    ),
  })),
  addBooking: (booking) => set((state) => ({ bookings: [...state.bookings, booking] })),
  updateBooking: (bookingId, updates) => set((state) => ({
    bookings: state.bookings.map(b => b.id === bookingId ? { ...b, ...updates } : b),
  })),
  endDay: () => set((state) => ({ currentDay: state.currentDay + 1 })),
  spendMoney: (amount) => set((state) => ({ money: state.money - amount })),
}));
