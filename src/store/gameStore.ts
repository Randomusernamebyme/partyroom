import { create } from 'zustand';
import { GameState, Room, Item, Booking, TimeSlot, InventoryItem } from '@/lib/types';

interface GameStore extends GameState {
  setGameState: (state: Partial<GameState>) => void;
  addRoom: (room: Room) => void;
  addItem: (item: Item) => void;
  assignItemToRoom: (itemId: string, roomId: string) => void;
  addBooking: (booking: Booking) => void;
  updateBooking: (bookingId: string, updates: Partial<Booking>) => void;
  endDay: () => void;
  spendMoney: (amount: number) => void;
  earnMoney: (amount: number) => void;
  updateReputation: (amount: number) => void;
  addToInventory: (item: InventoryItem) => void;
  removeFromInventory: (itemId: string) => void;
  addToSchedule: (slot: TimeSlot) => void;
  removeFromSchedule: (time: string) => void;
  updateRoomCleanliness: (roomId: string, cleanliness: number) => void;
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
  inventory: [],
  schedule: {
    day: 1,
    slots: []
  },
  
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
  earnMoney: (amount) => set((state) => ({ money: state.money + amount })),
  updateReputation: (amount) => set((state) => ({ 
    reputation: Math.max(0, Math.min(100, state.reputation + amount)) 
  })),
  addToInventory: (item) => set((state) => ({ inventory: [...state.inventory, item] })),
  removeFromInventory: (itemId) => set((state) => ({ 
    inventory: state.inventory.filter(item => item.id !== itemId) 
  })),
  addToSchedule: (slot) => set((state) => ({ 
    schedule: {
      ...state.schedule,
      slots: [...state.schedule.slots, slot]
    }
  })),
  removeFromSchedule: (time) => set((state) => ({
    schedule: {
      ...state.schedule,
      slots: state.schedule.slots.filter(slot => slot.time !== time)
    }
  })),
  updateRoomCleanliness: (roomId, cleanliness) => set((state) => ({
    rooms: state.rooms.map(room => 
      room.id === roomId ? { ...room, cleanliness } : room
    )
  })),
}));
