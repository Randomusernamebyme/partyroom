import { Booking, CustomerType } from './types';
import { CUSTOMER_REQUIREMENTS, TIME_SLOTS } from './constants';

export function generateDailyBookings(day: number, reputation: number, totalAttraction: number = 0): Booking[] {
  const bookingCount = Math.min(3 + Math.floor(reputation / 20), 8);
  const bookings: Booking[] = [];
  
  for (let i = 0; i < bookingCount; i++) {
    const customerTypes: CustomerType[] = ['birthday', 'friends', 'company', 'couple', 'gaming'];
    const type = customerTypes[Math.floor(Math.random() * customerTypes.length)];
    
    const requirements = CUSTOMER_REQUIREMENTS[type];
    bookings.push({
      id: `booking-${day}-${i}`,
      customerName: `客戶 ${i + 1}`,
      customerType: type,
      peopleCount: Math.floor(Math.random() * 15) + 2,
      requirements: [...requirements.required, ...requirements.wanted],
      requiredItems: requirements.required,
      wantedItems: requirements.wanted,
      roomId: null,
      timeSlot: TIME_SLOTS[Math.floor(Math.random() * TIME_SLOTS.length)],
      date: `Day ${day}`,
      satisfaction: 0,
      revenue: 0,
      status: 'pending',
    });
  }
  
  return bookings;
}
