'use client';

import { useGameStore } from '@/store/gameStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Package, Star, Home, Move } from 'lucide-react';

export default function MyItems() {
  const { rooms, items } = useGameStore();

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

  const getRoomName = (roomId: string | null) => {
    if (!roomId) return '未放置';
    const room = rooms.find(r => r.id === roomId);
    return room ? room.name : '未知房間';
  };

  const getRoomTotalAttraction = (roomId: string) => {
    const roomItems = items.filter(item => item.roomId === roomId);
    return roomItems.reduce((sum, item) => sum + item.attraction, 0);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">我的物品</h2>
        <p className="text-gray-600">查看和管理你的物品配置</p>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">還沒有物品</h3>
            <p className="text-gray-500 text-center">
              前往商店購買物品來裝飾你的房間
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* 按房間分組顯示 */}
          {rooms.map((room) => {
            const roomItems = items.filter(item => item.roomId === room.id);
            const totalAttraction = getRoomTotalAttraction(room.id);
            
            return (
              <Card key={room.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg flex items-center">
                        <Home className="h-5 w-5 mr-2" />
                        {room.name}
                      </CardTitle>
                      <CardDescription>
                        {room.size} • 容量: {room.capacity} 人
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-sm text-yellow-600">
                        <Star className="h-4 w-4 mr-1" />
                        <span>總吸引力: {totalAttraction}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {roomItems.length}/{room.maxItems} 物品
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {roomItems.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Package className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p>這個房間還沒有物品</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {roomItems.map((item) => (
                        <div key={item.id} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center">
                              <span className="text-lg mr-2">{getItemTypeIcon(item.type)}</span>
                              <span className="font-medium text-sm">{item.name}</span>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Move className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="flex justify-between items-center">
                            <Badge variant="outline" className="text-xs">
                              {getItemTypeLabel(item.type)}
                            </Badge>
                            <div className="flex items-center text-xs text-yellow-600">
                              <Star className="h-3 w-3 mr-1" />
                              <span>{item.attraction}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}

          {/* 未放置的物品 */}
          {items.filter(item => !item.roomId).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">未放置的物品</CardTitle>
                <CardDescription>
                  這些物品還沒有分配到任何房間
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {items.filter(item => !item.roomId).map((item) => (
                    <div key={item.id} className="p-3 border rounded-lg bg-yellow-50 border-yellow-200">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <span className="text-lg mr-2">{getItemTypeIcon(item.type)}</span>
                          <span className="font-medium text-sm">{item.name}</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Move className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="flex justify-between items-center">
                        <Badge variant="outline" className="text-xs">
                          {getItemTypeLabel(item.type)}
                        </Badge>
                        <div className="flex items-center text-xs text-yellow-600">
                          <Star className="h-3 w-3 mr-1" />
                          <span>{item.attraction}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
