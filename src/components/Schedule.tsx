'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { TIME_SLOTS, SCHEDULE_ACTIVITIES } from '@/lib/constants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Wrench, Sparkles, Users, Plus } from 'lucide-react';

export default function Schedule() {
  const { schedule, rooms, inventory, addToSchedule, removeFromSchedule } = useGameStore();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedActivity, setSelectedActivity] = useState<string>('');
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getActivityIcon = (activity: string) => {
    const iconMap: { [key: string]: any } = {
      cleaning: <Sparkles className="h-4 w-4" />,
      install_item: <Wrench className="h-4 w-4" />,
      booking: <Users className="h-4 w-4" />,
      free: <Clock className="h-4 w-4" />,
    };
    return iconMap[activity] || <Clock className="h-4 w-4" />;
  };

  const getActivityLabel = (activity: string) => {
    const labelMap: { [key: string]: string } = {
      cleaning: '清潔',
      install_item: '安裝物品',
      booking: '客戶預約',
      free: '空閒',
    };
    return labelMap[activity] || activity;
  };

  const getActivityColor = (activity: string) => {
    const colorMap: { [key: string]: string } = {
      cleaning: 'bg-blue-100 text-blue-800',
      install_item: 'bg-green-100 text-green-800',
      booking: 'bg-purple-100 text-purple-800',
      free: 'bg-gray-100 text-gray-800',
    };
    return colorMap[activity] || 'bg-gray-100 text-gray-800';
  };

  const getRoomName = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    return room ? room.name : '未知房間';
  };

  const getItemName = (itemId: string) => {
    const item = inventory.find(i => i.id === itemId);
    return item ? item.name : '未知物品';
  };

  const handleAddSchedule = () => {
    if (!selectedTime || !selectedActivity) return;

    const scheduleData: any = {
      time: selectedTime,
      activity: selectedActivity,
    };

    if (selectedActivity === 'cleaning' && selectedRoom) {
      scheduleData.roomId = selectedRoom;
      scheduleData.description = `清潔 ${getRoomName(selectedRoom)}`;
    } else if (selectedActivity === 'install_item' && selectedRoom && selectedItem) {
      scheduleData.roomId = selectedRoom;
      scheduleData.itemId = selectedItem;
      scheduleData.description = `安裝 ${getItemName(selectedItem)} 到 ${getRoomName(selectedRoom)}`;
    }

    addToSchedule(scheduleData);
    setIsDialogOpen(false);
    setSelectedTime('');
    setSelectedActivity('');
    setSelectedRoom('');
    setSelectedItem('');
  };

  const getAvailableTimes = () => {
    const occupiedTimes = schedule.slots?.map(slot => slot.time) || [];
    return TIME_SLOTS.filter(time => !occupiedTimes.includes(time));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">時間表管理</h2>
          <p className="text-gray-600">安排每日的清潔和安裝工作</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              添加安排
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>添加時間安排</DialogTitle>
              <DialogDescription>
                為今天安排清潔或安裝工作
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
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

              <div>
                <label className="text-sm font-medium">選擇活動</label>
                <Select value={selectedActivity} onValueChange={setSelectedActivity}>
                  <SelectTrigger>
                    <SelectValue placeholder="選擇活動" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cleaning">清潔房間</SelectItem>
                    <SelectItem value="install_item">安裝物品</SelectItem>
                    <SelectItem value="free">空閒時間</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedActivity === 'cleaning' && (
                <div>
                  <label className="text-sm font-medium">選擇房間</label>
                  <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                    <SelectTrigger>
                      <SelectValue placeholder="選擇要清潔的房間" />
                    </SelectTrigger>
                    <SelectContent>
                      {rooms.map((room) => (
                        <SelectItem key={room.id} value={room.id}>
                          {room.name} (清潔度: {room.cleanliness}%)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedActivity === 'install_item' && (
                <>
                  <div>
                    <label className="text-sm font-medium">選擇房間</label>
                    <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                      <SelectTrigger>
                        <SelectValue placeholder="選擇安裝房間" />
                      </SelectTrigger>
                      <SelectContent>
                        {rooms
                          .filter(room => room.items.length < room.maxItems)
                          .map((room) => (
                            <SelectItem key={room.id} value={room.id}>
                              {room.name} ({room.items.length}/{room.maxItems})
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">選擇物品</label>
                    <Select value={selectedItem} onValueChange={setSelectedItem}>
                      <SelectTrigger>
                        <SelectValue placeholder="選擇要安裝的物品" />
                      </SelectTrigger>
                      <SelectContent>
                        {inventory.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name} (安裝時間: {item.installTime}小時)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  取消
                </Button>
                <Button 
                  onClick={handleAddSchedule}
                  disabled={!selectedTime || !selectedActivity || 
                    (selectedActivity === 'cleaning' && !selectedRoom) ||
                    (selectedActivity === 'install_item' && (!selectedRoom || !selectedItem))}
                >
                  添加安排
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* 時間表顯示 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Day {schedule.day} 時間表
          </CardTitle>
          <CardDescription>
            今日的時間安排，每個時段只能安排一項活動
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
            {TIME_SLOTS.map((time) => {
              const slot = schedule.slots?.find(s => s.time === time);
              return (
                <div key={time} className="text-center">
                  <div className="text-xs font-medium text-gray-600 mb-1">
                    {time}
                  </div>
                  {slot ? (
                    <div className={`p-2 rounded text-xs ${getActivityColor(slot.activity)}`}>
                      <div className="flex items-center justify-center mb-1">
                        {getActivityIcon(slot.activity)}
                      </div>
                      <div className="text-center">
                        {getActivityLabel(slot.activity)}
                      </div>
                      {slot.roomId && (
                        <div className="text-xs mt-1 truncate">
                          {getRoomName(slot.roomId)}
                        </div>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 mt-1"
                        onClick={() => removeFromSchedule(time)}
                      >
                        ×
                      </Button>
                    </div>
                  ) : (
                    <div className="p-2 border-2 border-dashed border-gray-300 rounded text-xs text-gray-400">
                      空閒
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 今日統計 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">清潔安排</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {schedule.slots?.filter(s => s.activity === 'cleaning').length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              個房間需要清潔
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">安裝安排</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {schedule.slots?.filter(s => s.activity === 'install_item').length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              個物品等待安裝
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">空閒時間</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {TIME_SLOTS.length - (schedule.slots?.length || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              個時段空閒
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
