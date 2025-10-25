'use client';

import { useGameStore } from '@/store/gameStore';
import { INITIAL_ITEMS } from '@/lib/constants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Star, DollarSign, Package } from 'lucide-react';
import { getItemTypeIcon, getItemTypeLabel } from '@/lib/utils';

export default function ItemShop() {
  const { money, spendMoney, addToInventory } = useGameStore();

  const itemTypes = [
    { value: 'game', label: '遊戲設備', icon: '🎮' },
    { value: 'entertainment', label: '娛樂設備', icon: '🎤' },
    { value: 'decoration', label: '裝飾物品', icon: '🎨' },
  ];

  const handlePurchase = (item: any) => {
    if (money < item.price) {
      alert('金錢不足！');
      return;
    }
    
    // 直接添加到庫存，不選擇房間
    const inventoryItem = {
      id: `${item.id}-${Date.now()}`,
      name: item.name,
      type: item.type,
      attraction: item.attraction,
      price: item.price,
      installTime: item.installTime,
      purchaseDate: new Date().toISOString(),
    };

    addToInventory(inventoryItem);
    spendMoney(item.price);
    
    alert(`已購買 ${item.name}，請前往庫存安排安裝！`);
  };


  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">物品商店</h2>
        <p className="text-gray-600">購買設備和裝飾來提升你的派對房間</p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">全部</TabsTrigger>
          {itemTypes.map((type) => (
            <TabsTrigger key={type.value} value={type.value}>
              <span className="mr-2">{type.icon}</span>
              {type.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {['all', ...itemTypes.map(t => t.value)].map((filter) => (
          <TabsContent key={filter} value={filter} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {INITIAL_ITEMS
                .filter(item => filter === 'all' || item.type === filter)
                .map((item) => (
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
                          可購買
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
                          <DollarSign className="h-4 w-4 mr-2 text-green-600" />
                          <span>價格: ${item.price}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Package className="h-4 w-4 mr-2 text-blue-500" />
                          <span>安裝時間: {item.installTime} 小時</span>
                        </div>
                        <Button 
                          onClick={() => handlePurchase(item)}
                          className="w-full"
                          disabled={money < item.price}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          購買 (${item.price})
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}