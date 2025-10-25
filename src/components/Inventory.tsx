'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, Clock, Wrench, Star } from 'lucide-react';
import { TIME_SLOTS } from '@/lib/constants';

export default function Inventory() {
  const { inventory, rooms, schedule, addToSchedule } = useGameStore();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const getAvailableTimes = () => {
    const todaySchedule = schedule.slots || [];
    const occupiedTimes = todaySchedule.map(slot => slot.time);
    return TIME_SLOTS.filter(time => !occupiedTimes.includes(time));
  };

  const handleScheduleInstallation = () => {
    if (!selectedItem || !selectedRoom || !selectedTime) return;

    // 檢查房間容量
    const room = rooms.find(r => r.id === selectedRoom);
    if (!room || room.items.length >= room.maxItems) {
      alert('房間已滿或不存在！');
      return;
    }

    // 添加到時間表
    addToSchedule({
      time: selectedTime,
      activity: 'install_item',
      roomId: selectedRoom,
      itemId: selectedItem.id,
      description: `安裝 ${selectedItem.name} 到 ${room.name}`,
    });

    setIsDialogOpen(false);
    setSelectedItem(null);
    setSelectedRoom('');
    setSelectedTime('');
  };

  const getRoomName = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    return room ? room.name : '未知房間';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">物品庫存</h2>
        <p className="text-gray-600">管理你的物品庫存和安裝安排</p>
      </div>

      {inventory.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">庫存為空</h3>
            <p className="text-gray-500 text-center">
              前往商店購買物品，它們會先存放在庫存中
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {inventory.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg flex items-center">
                      <span className="text-xl mr-2">{getItemTypeIcon(item.type)}</span>
                      {item.name}
                    </CardTitle>
                    <CardDescription>
                      {getItemTypeLabel(item.type)}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="text-blue-600">
                    庫存中
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
                    <Clock className="h-4 w-4 mr-2 text-blue-500" />
                    <span>安裝時間: {item.installTime} 小時</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    購買日期: {new Date(item.purchaseDate).toLocaleDateString()}
                  </div>
                  <Button 
                    className="w-full"
                    onClick={() => {
                      setSelectedItem(item);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Wrench className="h-4 w-4 mr-2" />
                    安排安裝
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 安裝安排對話框 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>安排物品安裝</DialogTitle>
            <DialogDescription>
              為 {selectedItem?.name} 安排安裝時間和房間
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
                  {rooms
                    .filter(room => room.items.length < room.maxItems)
                    .map((room) => (
                      <SelectItem key={room.id} value={room.id}>
                        <div className="flex justify-between items-center w-full">
                          <span>{room.name}</span>
                          <span className="text-sm text-gray-500 ml-4">
                            容量: {room.items.length}/{room.maxItems}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">選擇時間</label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger>
                  <SelectValue placeholder="選擇時間" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableTimes().map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedItem && selectedRoom && selectedTime && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">
                  <p>物品: {selectedItem.name}</p>
                  <p>房間: {getRoomName(selectedRoom)}</p>
                  <p>時間: {selectedTime}</p>
                  <p>安裝時間: {selectedItem.installTime} 小時</p>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                取消
              </Button>
              <Button 
                onClick={handleScheduleInstallation}
                disabled={!selectedItem || !selectedRoom || !selectedTime}
              >
                安排安裝
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
