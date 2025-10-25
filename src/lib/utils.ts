export const getItemTypeIcon = (type: string) => {
  const typeMap: { [key: string]: string } = {
    game: '🎮',
    entertainment: '🎤',
    decoration: '🎨',
  };
  return typeMap[type] || '📦';
};

export const getItemTypeLabel = (type: string) => {
  const typeMap: { [key: string]: string } = {
    game: '遊戲設備',
    entertainment: '娛樂設備',
    decoration: '裝飾物品',
  };
  return typeMap[type] || type;
};