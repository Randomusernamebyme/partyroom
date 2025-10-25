'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AuthPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      await login();
      router.push('/game');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">派對房間經營遊戲</CardTitle>
          <CardDescription>使用 Google 帳號登入開始遊戲</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
            <Button 
              onClick={handleGoogleLogin} 
              className="w-full" 
              disabled={loading}
              size="lg"
            >
              {loading ? '登入中...' : '使用 Google 登入'}
            </Button>
            <p className="text-xs text-gray-500 text-center">
              點擊按鈕將使用 Google 帳號進行認證
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
