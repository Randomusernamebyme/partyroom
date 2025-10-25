'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGameStore } from '@/store/gameStore';
import { TIME_SLOTS } from '@/lib/constants';
import RoomManagement from '@/components/RoomManagement';
import ItemShop from '@/components/ItemShop';
import MyItems from '@/components/MyItems';
import BookingManagement from '@/components/BookingManagement';
import DailySettlement from '@/components/DailySettlement';
import Inventory from '@/components/Inventory';
import Schedule from '@/components/Schedule';
import { Home, ShoppingCart, Users, Calendar, Package, Calculator, Archive, Clock } from 'lucide-react';

export default function GamePage() {
  const { rooms, items, bookings, currentDay, schedule } = useGameStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">遊戲主頁</h1>
        <p className="text-gray-600">管理你的派對房間業務</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="overview">總覽</TabsTrigger>
          <TabsTrigger value="rooms">房間</TabsTrigger>
          <TabsTrigger value="shop">商店</TabsTrigger>
          <TabsTrigger value="inventory">庫存</TabsTrigger>
          <TabsTrigger value="schedule">時間表</TabsTrigger>
          <TabsTrigger value="items">物品</TabsTrigger>
          <TabsTrigger value="bookings">預約</TabsTrigger>
          <TabsTrigger value="settlement">結算</TabsTrigger>
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
                <Package className="h-4 w-4 text-muted-foreground" />
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
                  <CardTitle>今日時間表</CardTitle>
                  <CardDescription>Day {currentDay} 的時間安排</CardDescription>
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
                            <div className={`p-2 rounded text-xs ${
                              slot.activity === 'cleaning' ? 'bg-blue-100 text-blue-800' :
                              slot.activity === 'install_item' ? 'bg-green-100 text-green-800' :
                              slot.activity === 'booking' ? 'bg-purple-100 text-purple-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              <div className="text-center">
                                {slot.activity === 'cleaning' ? '清潔' :
                                 slot.activity === 'install_item' ? '安裝' :
                                 slot.activity === 'booking' ? '預約' : '空閒'}
                              </div>
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
        </TabsContent>

        <TabsContent value="rooms" className="space-y-4">
          <RoomManagement />
        </TabsContent>

        <TabsContent value="shop" className="space-y-4">
          <ItemShop />
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <Inventory />
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Schedule />
        </TabsContent>

        <TabsContent value="items" className="space-y-4">
          <MyItems />
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4">
          <BookingManagement />
        </TabsContent>

        <TabsContent value="settlement" className="space-y-4">
          <DailySettlement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
