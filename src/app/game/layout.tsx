'use client';

import { useAuth } from '@/hooks/useAuth';
import { useGameStore } from '@/store/gameStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { LogOut, DollarSign, Star, Calendar, Clock } from 'lucide-react';

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const getCurrentTimeSlot = () => {
    const now = new Date();
    const hour = now.getHours();
    const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '00:00'];
    const currentSlot = timeSlots.find(slot => {
      const slotHour = parseInt(slot.split(':')[0]);
      return slotHour === hour;
    });
    return currentSlot || '09:00';
  };

  const getCurrentActivity = () => {
    const currentTime = getCurrentTimeSlot();
    const slot = schedule.slots?.find(s => s.time === currentTime);
    if (slot) {
      return slot.activity === 'cleaning' ? '清潔' :
             slot.activity === 'install_item' ? '安裝' :
             slot.activity === 'booking' ? '預約' : '空閒';
    }
    return '空閒';
  };
  const { user, loading: authLoading, logout } = useAuth();
  const { currentDay, money, reputation, schedule } = useGameStore();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">載入中...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 側邊欄 */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 p-4">
        <div className="space-y-4">
          <div className="text-center">
            <h1 className="text-xl font-bold text-gray-900">派對房間經營</h1>
            <p className="text-sm text-gray-600">Day {currentDay}</p>
          </div>
          
          <Separator />
          
          {/* 遊戲狀態 */}
          <div className="space-y-3">
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">金錢</span>
                </div>
                <p className="text-lg font-bold text-green-600">${money.toLocaleString()}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium">聲譽</span>
                </div>
                <p className="text-lg font-bold text-yellow-600">{reputation}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">天數</span>
                </div>
                <p className="text-lg font-bold text-blue-600">Day {currentDay}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium">當前時間</span>
                </div>
                <p className="text-sm font-bold text-gray-800">
                  {getCurrentTimeSlot()} - {getCurrentActivity()}
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Separator />
          
          {/* 導航 */}
          <Tabs defaultValue="rooms" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="rooms">房間</TabsTrigger>
              <TabsTrigger value="shop">商店</TabsTrigger>
            </TabsList>
            <TabsContent value="rooms" className="mt-4">
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  房間管理
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  我的物品
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  預約處理
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="shop" className="mt-4">
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  物品商店
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  租用房間
                </Button>
              </div>
            </TabsContent>
          </Tabs>
          
          <Separator />
          
          {/* 登出按鈕 */}
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => {
              logout();
              router.push('/auth');
            }}
          >
            <LogOut className="h-4 w-4 mr-2" />
            登出
          </Button>
        </div>
      </div>
      
      {/* 主要內容區域 */}
      <div className="ml-64 p-6">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
