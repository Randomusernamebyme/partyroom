'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { INITIAL_ITEMS } from '@/lib/constants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Star, DollarSign, Package } from 'lucide-react';

export default function ItemShop() {
  const { rooms, money, items, addItem, assignItemToRoom, spendMoney } = useGameStore();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const itemTypes = [
    { value: 'game', label: '遊戲設備', icon: '🎮' },
    { value: 'entertainment', label: '娛樂設備', icon: '🎤' },
    { value: 'decoration', label: '裝飾物品', icon: '🎨' },
  ];

  const handlePurchase = (item: any) => {
    if (money < item.price) {
      alert('金錢不足！');
      return;
    }
    
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handlePlaceItem = () => {
    if (!selectedItem || !selectedRoom) return;

    const newItem = {
      id: `${selectedItem.id}-${Date.now()}`,
      name: selectedItem.name,
      type: selectedItem.type,
      attraction: selectedItem.attraction,
      price: selectedItem.price,
      roomId: selectedRoom,
    };

    addItem(newItem);
    assignItemToRoom(newItem.id, selectedRoom);
    spendMoney(selectedItem.price);
    setIsDialogOpen(false);
    setSelectedItem(null);
    setSelectedRoom('');
  };

  const getAvailableRooms = () => {
    return rooms.filter(room => room.items.length < room.maxItems);
  };

  const getItemTypeIcon = (type: string) => {
    const typeMap: { [key: string]: string } = {
      game: '🎮',
      entertainment: '🎤',
      decoration: '🎨',
    };
    return typeMap[type] || '📦';
  };

  const getItemTypeLabel = (type: string) => {
    const typeMap: { [key: string]: string } = {
      game: '遊戲設備',
      entertainment: '娛樂設備',
      decoration: '裝飾物品',
    };
    return typeMap[type] || type;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">物品商店</h2>
        <p className="text-gray-600">購買設備和裝飾來提升房間吸引力</p>
      </div>

      <Tabs defaultValue="game" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          {itemTypes.map((type) => (
            <TabsTrigger key={type.value} value={type.value}>
              <span className="mr-2">{type.icon}</span>
              {type.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {itemTypes.map((type) => (
          <TabsContent key={type.value} value={type.value} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {INITIAL_ITEMS.filter(item => item.type === type.value).map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <CardDescription>
                          {getItemTypeLabel(item.type)}
                        </CardDescription>
                      </div>
                      <Badge variant="outline">
                        {getItemTypeIcon(item.type)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <Star className="h-4 w-4 mr-2 text-yellow-500" />
                        <span>吸引力: {item.attraction}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                        <span>價格: ${item.price.toLocaleString()}</span>
                      </div>
                      <Button 
                        className="w-full"
                        onClick={() => handlePurchase(item)}
                        disabled={money < item.price}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {money < item.price ? '金錢不足' : '購買'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>放置物品</DialogTitle>
            <DialogDescription>
              選擇要放置 {selectedItem?.name} 的房間
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">選擇房間</label>
              <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                <SelectTrigger>
                  <SelectValue placeholder="選擇房間" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableRooms().map((room) => (
                    <SelectItem key={room.id} value={room.id}>
                      <div className="flex justify-between items-center w-full">
                        <span>{room.name}</span>
                        <span className="text-sm text-gray-500 ml-4">
                          {room.items.length}/{room.maxItems} 物品
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedRoom && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">
                  <p>房間: {rooms.find(r => r.id === selectedRoom)?.name}</p>
                  <p>剩餘容量: {rooms.find(r => r.id === selectedRoom)?.maxItems! - rooms.find(r => r.id === selectedRoom)?.items.length!} 個物品</p>
                </div>
              </div>
            )}
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                取消
              </Button>
              <Button 
                onClick={handlePlaceItem}
                disabled={!selectedRoom}
              >
                放置物品
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
