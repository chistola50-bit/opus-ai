'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Stats {
  totalUsers: number;
  totalCreditsUsed: number;
  totalCreditsRemaining: number;
  totalPurchases: number;
  totalRevenue: number;
  users: {
    id: string;
    email: string;
    credits: number;
    createdAt: string;
    _count: { transactions: number };
  }[];
  recentTransactions: {
    id: string;
    type: string;
    amount: number;  // <-- здесь
    createdAt: string;
    user: { email: string };
  }[];
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const adminEmails = ['chistola50@gmail.com'];

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session?.user?.email || !adminEmails.includes(session.user.email)) {
      router.push('/');
      return;
    }

    fetchStats();
  }, [session, status]);

  const fetchStats = async () => {
    const res = await fetch('/api/admin/stats');
    const data = await res.json();
    setStats(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-8">📊 Админ-панель</h1>

      {/* Общая статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-900 p-6 rounded-xl">
          <p className="text-gray-400">Пользователей</p>
          <p className="text-3xl font-bold">{stats.totalUsers}</p>
        </div>
        <div className="bg-gray-900 p-6 rounded-xl">
          <p className="text-gray-400">Кредитов потрачено</p>
          <p className="text-3xl font-bold text-red-500">
            {stats.totalCreditsUsed.toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-900 p-6 rounded-xl">
          <p className="text-gray-400">Кредитов осталось</p>
          <p className="text-3xl font-bold text-green-500">
            {stats.totalCreditsRemaining.toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-900 p-6 rounded-xl">
          <p className="text-gray-400">Выручка</p>
          <p className="text-3xl font-bold text-yellow-500">
            ${stats.totalRevenue.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Пользователи */}
      <div className="bg-gray-900 rounded-xl p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">👥 Пользователи</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-800">
                <th className="pb-3">Email</th>
                <th className="pb-3">Кредиты</th>
                <th className="pb-3">Транзакций</th>
                <th className="pb-3">Регистрация</th>
              </tr>
            </thead>
            <tbody>
              {stats.users.map((user) => (
                <tr key={user.id} className="border-b border-gray-800">
                  <td className="py-3">{user.email}</td>
                  <td className="py-3">{user.credits.toLocaleString()}</td>
                  <td className="py-3">{user._count.transactions}</td>
                  <td className="py-3 text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Последние транзакции */}
      <div className="bg-gray-900 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">📝 Последние действия</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-800">
                <th className="pb-3">Пользователь</th>
                <th className="pb-3">Действие</th>
                <th className="pb-3">Кредитов</th>
                <th className="pb-3">Время</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentTransactions.map((tx) => (
                <tr key={tx.id} className="border-b border-gray-800">
                  <td className="py-3">{tx.user.email}</td>
                  <td className="py-3">{tx.type}</td>
                  <td className="py-3 text-red-400">-{tx.amount.toLocaleString()}</td>  {/* <-- здесь */}
                  <td className="py-3 text-gray-400">
                    {new Date(tx.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}