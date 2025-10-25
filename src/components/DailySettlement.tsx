'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { calculateDailySettlement } from '@/lib/dailySettlement';
import { generateDailyBookings } from '@/lib/bookingGenerator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Star, 
  Users, 
  Calendar,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export default function DailySettlement() {
  const { 
    currentDay, 
    money, 
    reputation, 
    rooms, 
    bookings, 
    dailyStats,
    updateBooking,
    endDay,
    setGameState,
    addBooking
  } = useGameStore();
  
  const [isSettling, setIsSettling] = useState(false);
  
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed' && b.date === `Day ${currentDay}`);
  const completedBookings = bookings.filter(b => b.status === 'completed' && b.date === `Day ${currentDay}`);
  
  const currentState = useGameStore.getState();
  const todayStats = calculateDailySettlement({
    currentDay,
    money,
    reputation,
    rooms,
    items: currentState.items,
    bookings,
    dailyStats,
    userId: currentState.userId,
    inventory: currentState.inventory,
    schedule: currentState.schedule,
  });

  const handleEndDay = async () => {
    setIsSettling(true);
    
    try {
      // 1. 將所有已確認的預約標記為完成
      confirmedBookings.forEach(booking => {
        updateBooking(booking.id, { status: 'completed' });
      });
      
      // 2. 計算當日統計
      const currentState = useGameStore.getState();
      const stats = calculateDailySettlement({
        currentDay,
        money,
        reputation,
        rooms,
        items: currentState.items,
        bookings: bookings.map(b => 
          b.status === 'confirmed' && b.date === `Day ${currentDay}` 
            ? { ...b, status: 'completed' as const }
            : b
        ),
        dailyStats,
        userId: currentState.userId,
        inventory: currentState.inventory,
        schedule: currentState.schedule,
      });
      
      // 3. 更新遊戲狀態
      const newMoney = money + stats.profit;
      const newReputation = Math.max(0, Math.min(100, reputation + (stats.avgSatisfaction - 50) / 10));
      
      setGameState({
        money: newMoney,
        reputation: newReputation,
        dailyStats: [...dailyStats, stats],
      });
      
      // 4. 進入下一天
      endDay();
      
      // 5. 生成新一天的預約
      const newBookings = generateDailyBookings(currentDay + 1, newReputation);
      newBookings.forEach(booking => addBooking(booking));
      
    } catch (error) {
      console.error('結算錯誤:', error);
    } finally {
      setIsSettling(false);
    }
  };

  const getSatisfactionColor = (satisfaction: number) => {
    if (satisfaction >= 80) return 'text-green-600';
    if (satisfaction >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSatisfactionIcon = (satisfaction: number) => {
    if (satisfaction >= 80) return '😊';
    if (satisfaction >= 60) return '😐';
    return '😞';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">每日結算</h2>
        <p className="text-gray-600">Day {currentDay} 的經營總結</p>
      </div>

      {/* 當日統計 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">收入</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${todayStats.revenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {completedBookings.length} 個完成預約
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">支出</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${todayStats.expenses.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {rooms.length} 個房間租金
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">淨利潤</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${todayStats.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${todayStats.profit.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {todayStats.profit >= 0 ? '盈利' : '虧損'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">平均滿意度</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getSatisfactionColor(todayStats.avgSatisfaction)}`}>
              {todayStats.avgSatisfaction.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {getSatisfactionIcon(todayStats.avgSatisfaction)} 客戶滿意度
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 預約狀態 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
              已確認預約
            </CardTitle>
            <CardDescription>等待完成的預約</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-2">
              {confirmedBookings.length}
            </div>
            <p className="text-sm text-gray-600">
              預期收入: ${confirmedBookings.reduce((sum, b) => sum + b.revenue, 0).toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-600" />
              已完成預約
            </CardTitle>
            <CardDescription>今日已完成的預約</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {completedBookings.length}
            </div>
            <p className="text-sm text-gray-600">
              實際收入: ${completedBookings.reduce((sum, b) => sum + b.revenue, 0).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 預約詳情 */}
      {confirmedBookings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>待完成預約詳情</CardTitle>
            <CardDescription>這些預約將在結算時完成</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {confirmedBookings.map((booking) => (
                <div key={booking.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">
                      {booking.customerType === 'birthday' ? '🎂' : 
                       booking.customerType === 'friends' ? '👥' :
                       booking.customerType === 'company' ? '🏢' :
                       booking.customerType === 'couple' ? '💕' : '🎮'}
                    </span>
                    <div>
                      <p className="font-medium">{booking.customerName}</p>
                      <p className="text-sm text-gray-600">
                        {booking.peopleCount} 人 • {booking.timeSlot}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">${booking.revenue}</p>
                    <p className="text-sm text-gray-600">
                      <Star className="h-3 w-3 inline mr-1" />
                      {booking.satisfaction}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 結算按鈕 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            結束今天
          </CardTitle>
          <CardDescription>
            完成所有預約並進入下一天
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {confirmedBookings.length > 0 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                  <p className="text-sm text-yellow-800">
                    還有 {confirmedBookings.length} 個預約等待完成，結算後將自動完成這些預約。
                  </p>
                </div>
              </div>
            )}
            
            <Button 
              onClick={handleEndDay}
              disabled={isSettling}
              className="w-full"
              size="lg"
            >
              {isSettling ? '結算中...' : '結束今天'}
            </Button>
            
            <p className="text-xs text-gray-500 text-center">
              結算後將進入 Day {currentDay + 1}，並生成新的客戶預約
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
