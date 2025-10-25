'use client';

import { useAuth } from '@/hooks/useAuth';
import { useGameData } from '@/hooks/useGameData';
import { useGameStore } from '@/store/gameStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { LogOut, DollarSign, Star, Calendar } from 'lucide-react';

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading: authLoading, logout } = useAuth();
  const { saveGame } = useGameData(user?.uid || null);
  const { currentDay, money, reputation } = useGameStore();
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
