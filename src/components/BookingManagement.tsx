'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { generateDailyBookings } from '@/lib/bookingGenerator';
import { calculateSatisfaction, calculateRevenue } from '@/lib/satisfactionCalculator';
import { TIME_SLOTS } from '@/lib/constants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Users, Clock, Star, CheckCircle, AlertCircle } from 'lucide-react';

export default function BookingManagement() {
  const { rooms, items, bookings, currentDay, reputation, addBooking, updateBooking, inventory } = useGameStore();
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');

  // 計算總吸引力
  const totalAttraction = rooms.reduce((sum, room) => {
    const roomItems = items.filter(item => item.roomId === room.id);
    return sum + roomItems.reduce((roomSum, item) => roomSum + item.attraction, 0);
  }, 0);

  const getCustomerTypeLabel = (type: string) => {
    const typeMap: { [key: string]: string } = {
      birthday: '生日派對',
      friends: '朋友聚會',
      company: '公司團建',
      couple: '情侶約會',
      gaming: '遊戲聚會',
    };
    return typeMap[type] || type;
  };

  const getCustomerTypeIcon = (type: string) => {
    const iconMap: { [key: string]: string } = {
      birthday: '🎂',
      friends: '👥',
      company: '🏢',
      couple: '💕',
      gaming: '🎮',
    };
    return iconMap[type] || '👤';
  };

  const getRequirementLabel = (req: string) => {
    const reqMap: { [key: string]: string } = {
      ktv: 'KTV',
      decoration: '裝飾',
      photo: '拍照',
      game: '遊戲',
      boardgame: '桌遊',
      sound: '音響',
      'large-space': '大空間',
      'small-space': '小空間',
      'game-console': '遊戲機',
      'comfortable-seats': '舒適座椅',
    };
    return reqMap[req] || req;
  };

  const handleAssignRoom = () => {
    if (!selectedBooking || !selectedRoom) return;

    const room = rooms.find(r => r.id === selectedRoom);
    if (!room) return;

    const satisfaction = calculateSatisfaction(selectedBooking, room, items);
    const revenue = calculateRevenue(selectedBooking, satisfaction);

    updateBooking(selectedBooking.id, {
      roomId: selectedRoom,
      status: 'confirmed',
      satisfaction,
      revenue,
    });

    setIsDialogOpen(false);
    setSelectedBooking(null);
    setSelectedRoom('');
  };

  // 根據聲譽和吸引力生成客戶查詢
  const generateCustomerQueries = () => {
    const baseQueries = 1; // 最少1個查詢
    const reputationBonus = Math.floor(reputation / 20); // 聲譽加成
    const attractionBonus = Math.floor(totalAttraction / 100); // 吸引力加成
    const queryCount = Math.min(baseQueries + reputationBonus + attractionBonus, 5);
    
    const newBookings = generateDailyBookings(currentDay, reputation, totalAttraction);
    newBookings.slice(0, queryCount).forEach(booking => addBooking(booking));
  };

  // 每天早上自動生成查詢
  React.useEffect(() => {
    // 檢查今天是否已經生成過查詢
    const todayBookings = bookings.filter(b => b.date === `Day ${currentDay}`);
    if (todayBookings.length === 0) {
      generateCustomerQueries();
    }
  }, [currentDay]);

  const getRoomRecommendation = (booking: any) => {
    const suitableRooms = rooms.filter(room => 
      room.capacity >= booking.peopleCount && 
      room.items.length < room.maxItems
    );
    
    if (suitableRooms.length === 0) return null;
    
    // 找到最適合的房間（基於容量匹配度）
    return suitableRooms.sort((a, b) => {
      const aMatch = Math.abs(a.capacity - booking.peopleCount);
      const bMatch = Math.abs(b.capacity - booking.peopleCount);
      return aMatch - bMatch;
    })[0];
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">客戶查詢</h2>
        <p className="text-gray-600">處理客戶查詢和安排房間</p>
        <div className="mt-2 text-sm text-gray-500">
          根據你的聲譽 ({reputation}) 和總吸引力 ({totalAttraction})，今天有 {pendingBookings.length} 個客戶查詢
        </div>
      </div>

      {/* 待處理預約 */}
      {pendingBookings.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-orange-500" />
            待處理預約 ({pendingBookings.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingBookings.map((booking) => (
              <Card key={booking.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg flex items-center">
                        <span className="text-xl mr-2">{getCustomerTypeIcon(booking.customerType)}</span>
                        {booking.customerName}
                      </CardTitle>
                      <CardDescription>
                        {getCustomerTypeLabel(booking.customerType)}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="text-orange-600">
                      待處理
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      <span>{booking.peopleCount} 人</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{booking.timeSlot}</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-700">需求：</p>
                      <div className="flex flex-wrap gap-1">
                        {booking.requirements.map((req, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {getRequirementLabel(req)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">建議房間：</span>
                      <span className="text-sm font-medium">
                        {getRoomRecommendation(booking)?.name || '無合適房間'}
                      </span>
                    </div>
                    <Button 
                      className="w-full"
                      onClick={() => {
                        setSelectedBooking(booking);
                        setIsDialogOpen(true);
                      }}
                      disabled={!getRoomRecommendation(booking)}
                    >
                      安排房間
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 已確認預約 */}
      {confirmedBookings.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
            已確認預約 ({confirmedBookings.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {confirmedBookings.map((booking) => (
              <Card key={booking.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg flex items-center">
                        <span className="text-xl mr-2">{getCustomerTypeIcon(booking.customerType)}</span>
                        {booking.customerName}
                      </CardTitle>
                      <CardDescription>
                        {getCustomerTypeLabel(booking.customerType)}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="text-green-600">
                      已確認
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      <span>{booking.peopleCount} 人</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{booking.timeSlot}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="h-4 w-4 mr-2 text-yellow-500" />
                      <span>預期滿意度: {booking.satisfaction}%</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">💰</span>
                      <span>預期收入: ${booking.revenue}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 沒有預約時 */}
      {bookings.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">還沒有預約</h3>
            <p className="text-gray-500 text-center mb-4">
              點擊「生成今日預約」來獲取客戶預約
            </p>
            <Button onClick={handleGenerateBookings}>
              生成今日預約
            </Button>
          </CardContent>
        </Card>
      )}

      {/* 房間分配對話框 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>安排房間</DialogTitle>
            <DialogDescription>
              為 {selectedBooking?.customerName} 選擇合適的房間
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
                    .filter(room => room.capacity >= selectedBooking?.peopleCount)
                    .map((room) => (
                      <SelectItem key={room.id} value={room.id}>
                        <div className="flex justify-between items-center w-full">
                          <span>{room.name}</span>
                          <span className="text-sm text-gray-500 ml-4">
                            容量: {room.capacity} | 物品: {room.items.length}/{room.maxItems}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            {selectedRoom && selectedBooking && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">
                  <p>房間: {rooms.find(r => r.id === selectedRoom)?.name}</p>
                  <p>預期滿意度: {calculateSatisfaction(selectedBooking, rooms.find(r => r.id === selectedRoom)!, items)}%</p>
                  <p>預期收入: ${calculateRevenue(selectedBooking, calculateSatisfaction(selectedBooking, rooms.find(r => r.id === selectedRoom)!, items))}</p>
                </div>
              </div>
            )}
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                取消
              </Button>
              <Button 
                onClick={handleAssignRoom}
                disabled={!selectedRoom}
              >
                確認安排
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
