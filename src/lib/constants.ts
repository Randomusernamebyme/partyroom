export const ROOM_CONFIG = {
  small: { capacity: 3, maxItems: 8, rent: 500 },
  medium: { capacity: 6, maxItems: 15, rent: 1000 },
  large: { capacity: 12, maxItems: 25, rent: 2000 },
  xlarge: { capacity: 20, maxItems: 35, rent: 3500 },
};

export const INITIAL_ITEMS = [
  { id: 'ps5', name: 'PlayStation 5', type: 'game', attraction: 80, price: 5000, installTime: 2 },
  { id: 'switch', name: 'Nintendo Switch', type: 'game', attraction: 70, price: 3000, installTime: 1 },
  { id: 'boardgame1', name: '狼人殺', type: 'game', attraction: 40, price: 300, installTime: 0.5 },
  { id: 'ktv-basic', name: '基礎 KTV', type: 'entertainment', attraction: 60, price: 2000, installTime: 3 },
  { id: 'ktv-pro', name: '專業 KTV', type: 'entertainment', attraction: 90, price: 5000, installTime: 4 },
  { id: 'led-lights', name: 'LED 燈帶', type: 'decoration', attraction: 30, price: 500, installTime: 1 },
  { id: 'birthday-deco', name: '生日裝飾', type: 'decoration', attraction: 40, price: 800, installTime: 0.5 },
];

export const CUSTOMER_REQUIREMENTS = {
  birthday: {
    required: ['ktv', 'decoration'],
    wanted: ['photo', 'sound', 'lighting']
  },
  friends: {
    required: ['game'],
    wanted: ['boardgame', 'sound', 'comfortable-seats']
  },
  company: {
    required: ['large-space'],
    wanted: ['boardgame', 'ktv', 'meeting-setup']
  },
  couple: {
    required: ['small-space'],
    wanted: ['decoration', 'ktv', 'romantic-lighting']
  },
  gaming: {
    required: ['game-console'],
    wanted: ['comfortable-seats', 'gaming-setup', 'snacks']
  },
};

export const TIME_SLOTS = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00',
  '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '00:00'
];

export const SCHEDULE_ACTIVITIES = {
  CLEANING: 'cleaning',
  INSTALL_ITEM: 'install_item',
  BOOKING: 'booking',
  FREE: 'free'
} as const;

export type ScheduleActivity = typeof SCHEDULE_ACTIVITIES[keyof typeof SCHEDULE_ACTIVITIES];
