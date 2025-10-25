'use client';

import { useGameStore } from '@/store/gameStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Package, Star, Home, Move } from 'lucide-react';
import { getItemTypeIcon, getItemTypeLabel } from '@/lib/utils';

export default function MyItems() {
  const { rooms, items, inventory } = useGameStore();


  const getRoomName = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    return room ? room.name : '未知房間';
  };

  const getRoomAttraction = (roomId: string) => {
    const roomItems = items.filter(item => item.roomId === roomId);
    return roomItems.reduce((sum, item) => sum + item.attraction, 0);
  };

  const getRoomCapacity = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return { current: 0, max: 0 };
    const currentItems = items.filter(item => item.roomId === roomId).length;
    return { current: currentItems, max: room.maxItems };
  };

  const getItemsByRoom = () => {
    const roomGroups: { [key: string]: any[] } = {};
    
    rooms.forEach(room => {
      roomGroups[room.id] = items.filter(item => item.roomId === room.id);
    });
    
    return roomGroups;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">我的物品</h2>
        <p className="text-gray-600">管理你已安裝的物品</p>
      </div>

      {/* 按房間分組顯示已安裝物品 */}
      {Object.keys(getItemsByRoom()).map(roomId => {
        const room = rooms.find(r => r.id === roomId);
        const roomItems = getItemsByRoom()[roomId];
        
        if (!room || roomItems.length === 0) return null;
        
        return (
          <Card key={roomId}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center">
                    <Home className="h-5 w-5 mr-2" />
                    {room.name}
                  </CardTitle>
                  <CardDescription>
                    容量: {getRoomCapacity(roomId).current}/{getRoomCapacity(roomId).max} | 
                    總吸引力: {getRoomAttraction(roomId)}
                  </CardDescription>
                </div>
                <Badge variant="outline">
                  {room.size}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {roomItems.map((item) => (
                  <Card key={item.id} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <span className="text-xl mr-2">{getItemTypeIcon(item.type)}</span>
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-gray-600">{getItemTypeLabel(item.type)}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-green-600">
                        已安裝
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Star className="h-4 w-4 mr-2 text-yellow-500" />
                        <span>吸引力: {item.attraction}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Package className="h-4 w-4 mr-2 text-blue-500" />
                        <span>價格: ${item.price}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* 庫存中的物品 */}
      {inventory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              庫存中的物品
            </CardTitle>
            <CardDescription>
              這些物品在庫存中，需要在時間表中安排安裝
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {inventory.map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <span className="text-xl mr-2">{getItemTypeIcon(item.type)}</span>
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-600">{getItemTypeLabel(item.type)}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-blue-600">
                      庫存中
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="h-4 w-4 mr-2 text-yellow-500" />
                      <span>吸引力: {item.attraction}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Package className="h-4 w-4 mr-2 text-blue-500" />
                      <span>安裝時間: {item.installTime} 小時</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 沒有物品時 */}
      {items.length === 0 && inventory.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">還沒有物品</h3>
            <p className="text-gray-500 text-center">
              前往商店購買物品，然後在這裡管理它們
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}