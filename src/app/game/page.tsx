'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGameStore } from '@/store/gameStore';
import { Home, ShoppingCart, Users, Calendar } from 'lucide-react';

export default function GamePage() {
  const { rooms, items, bookings } = useGameStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">遊戲主頁</h1>
        <p className="text-gray-600">管理你的派對房間業務</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">總覽</TabsTrigger>
          <TabsTrigger value="rooms">房間</TabsTrigger>
          <TabsTrigger value="items">物品</TabsTrigger>
          <TabsTrigger value="bookings">預約</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">房間數量</CardTitle>
                <Home className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{rooms.length}</div>
                <p className="text-xs text-muted-foreground">
                  已租用房間
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">物品數量</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{items.length}</div>
                <p className="text-xs text-muted-foreground">
                  已購買物品
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">待處理預約</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {bookings.filter(b => b.status === 'pending').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  需要安排房間
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>快速操作</CardTitle>
              <CardDescription>常用功能快速入口</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="h-20">
                  <div className="text-center">
                    <Home className="h-6 w-6 mx-auto mb-2" />
                    <div className="text-sm font-medium">房間管理</div>
                  </div>
                </Button>
                <Button variant="outline" className="h-20">
                  <div className="text-center">
                    <ShoppingCart className="h-6 w-6 mx-auto mb-2" />
                    <div className="text-sm font-medium">物品商店</div>
                  </div>
                </Button>
                <Button variant="outline" className="h-20">
                  <div className="text-center">
                    <Users className="h-6 w-6 mx-auto mb-2" />
                    <div className="text-sm font-medium">預約處理</div>
                  </div>
                </Button>
                <Button variant="outline" className="h-20">
                  <div className="text-center">
                    <Calendar className="h-6 w-6 mx-auto mb-2" />
                    <div className="text-sm font-medium">每日結算</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rooms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>房間管理</CardTitle>
              <CardDescription>管理你的房間和物品配置</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">房間管理功能開發中...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="items" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>物品管理</CardTitle>
              <CardDescription>查看和管理你的物品</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">物品管理功能開發中...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>預約處理</CardTitle>
              <CardDescription>處理客戶預約和安排房間</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">預約處理功能開發中...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
