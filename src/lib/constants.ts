export const ROOM_CONFIG = {
  small: { capacity: 3, maxItems: 8, rent: 500 },
  medium: { capacity: 6, maxItems: 15, rent: 1000 },
  large: { capacity: 12, maxItems: 25, rent: 2000 },
  xlarge: { capacity: 20, maxItems: 35, rent: 3500 },
};

export const INITIAL_ITEMS = [
  { id: 'ps5', name: 'PlayStation 5', type: 'game', attraction: 80, price: 5000 },
  { id: 'switch', name: 'Nintendo Switch', type: 'game', attraction: 70, price: 3000 },
  { id: 'boardgame1', name: '狼人殺', type: 'game', attraction: 40, price: 300 },
  { id: 'ktv-basic', name: '基礎 KTV', type: 'entertainment', attraction: 60, price: 2000 },
  { id: 'ktv-pro', name: '專業 KTV', type: 'entertainment', attraction: 90, price: 5000 },
  { id: 'led-lights', name: 'LED 燈帶', type: 'decoration', attraction: 30, price: 500 },
  { id: 'birthday-deco', name: '生日裝飾', type: 'decoration', attraction: 40, price: 800 },
];

export const CUSTOMER_REQUIREMENTS = {
  birthday: ['ktv', 'decoration', 'photo'],
  friends: ['game', 'boardgame', 'sound'],
  company: ['boardgame', 'ktv', 'large-space'],
  couple: ['decoration', 'ktv', 'small-space'],
  gaming: ['game-console', 'comfortable-seats'],
};

export const TIME_SLOTS = [
  '09:00-13:00',
  '13:30-17:30',
  '18:00-22:00',
  '22:30-02:30',
];
