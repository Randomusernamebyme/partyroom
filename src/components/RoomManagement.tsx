'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { ROOM_CONFIG } from '@/lib/constants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Home, Plus, Users, Package } from 'lucide-react';

export default function RoomManagement() {
  const { rooms, money, addRoom, spendMoney } = useGameStore();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const roomSizes = [
    { value: 'small', label: '小房間', ...ROOM_CONFIG.small },
    { value: 'medium', label: '中房間', ...ROOM_CONFIG.medium },
    { value: 'large', label: '大房間', ...ROOM_CONFIG.large },
    { value: 'xlarge', label: '超大房間', ...ROOM_CONFIG.xlarge },
  ];

  const handleRentRoom = () => {
    if (!selectedSize) return;
    
    const sizeConfig = ROOM_CONFIG[selectedSize as keyof typeof ROOM_CONFIG];
    if (money < sizeConfig.rent) {
      alert('金錢不足！');
      return;
    }

    const newRoom = {
      id: `room-${Date.now()}`,
      name: `房間 ${rooms.length + 1}`,
      size: selectedSize as any,
      capacity: sizeConfig.capacity,
      maxItems: sizeConfig.maxItems,
      rent: sizeConfig.rent,
      items: [],
    };

    addRoom(newRoom);
    spendMoney(sizeConfig.rent);
    setIsDialogOpen(false);
    setSelectedSize('');
  };

  const getRoomSizeLabel = (size: string) => {
    const sizeMap: { [key: string]: string } = {
      small: '小房間',
      medium: '中房間', 
      large: '大房間',
      xlarge: '超大房間',
    };
    return sizeMap[size] || size;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">房間管理</h2>
          <p className="text-gray-600">管理你的房間和物品配置</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              租用新房間
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>租用新房間</DialogTitle>
              <DialogDescription>
                選擇房間大小，每日租金會從你的資金中扣除
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">房間大小</label>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger>
                    <SelectValue placeholder="選擇房間大小" />
                  </SelectTrigger>
                  <SelectContent>
                    {roomSizes.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        <div className="flex justify-between items-center w-full">
                          <span>{size.label}</span>
                          <span className="text-sm text-gray-500 ml-4">
                            容量: {size.capacity}人 | 租金: ${size.rent}/天
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedSize && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">
                    <p>容量: {ROOM_CONFIG[selectedSize as keyof typeof ROOM_CONFIG].capacity} 人</p>
                    <p>最大物品數: {ROOM_CONFIG[selectedSize as keyof typeof ROOM_CONFIG].maxItems} 個</p>
                    <p>每日租金: ${ROOM_CONFIG[selectedSize as keyof typeof ROOM_CONFIG].rent}</p>
                  </div>
                </div>
              )}
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  取消
                </Button>
                <Button 
                  onClick={handleRentRoom}
                  disabled={!selectedSize || money < (selectedSize ? ROOM_CONFIG[selectedSize as keyof typeof ROOM_CONFIG].rent : 0)}
                >
                  租用房間
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {rooms.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Home className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">還沒有房間</h3>
            <p className="text-gray-500 text-center mb-4">
              租用你的第一個房間開始經營派對房間業務
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              租用房間
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((room) => (
            <Card key={room.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{room.name}</CardTitle>
                    <CardDescription>
                      {getRoomSizeLabel(room.size)}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">
                    {room.items.length}/{room.maxItems} 物品
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    <span>容量: {room.capacity} 人</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Package className="h-4 w-4 mr-2" />
                    <span>物品: {room.items.length}/{room.maxItems}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">每日租金</span>
                    <span className="text-sm text-red-600">${room.rent}</span>
                  </div>
                  <Button variant="outline" className="w-full">
                    查看詳情
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
