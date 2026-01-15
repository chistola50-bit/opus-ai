'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface AdminUser {
  id: string;
  email: string;
  credits: number;
  createdAt: string;
  isBlocked: boolean;
  suspicious: boolean;
  _count: { transactions: number };
}

interface AdminTx {
  id: string;
  type: string;
  amount: number;
  createdAt: string;
  user: { email: string };
}

interface Stats {
  totalUsers: number;
  totalCreditsUsed: number;
  totalCreditsRemaining: number;
  totalPurchases: number;
  totalRevenue: number;
  users: AdminUser[];
  recentTransactions: AdminTx[];
}

const adminEmails = ['chistola50@gmail.com'];

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [blockLoadingId, setBlockLoadingId] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session?.user?.email || !adminEmails.includes(session.user.email)) {
      router.push('/');
      return;
    }

    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch('/api/admin/stats');

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error || `Failed to load admin stats (${res.status})`);
        setLoading(false);
        return;
      }

      const data = (await res.json()) as Stats;
      setStats(data);
    } catch (e) {
      console.error(e);
      setError('Server connection error');
    } finally {
      setLoading(false);
    }
  };

  const toggleBlock = async (userId: string, block: boolean) => {
    try {
      setBlockLoadingId(userId);
      const res = await fetch('/api/admin/users/block', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, block }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('Block error:', data);
        return;
      }

      setStats((prev) =>
        prev
          ? {
              ...prev,
              users: prev.users.map((u) =>
                u.id === userId ? { ...u, isBlocked: block } : u
              ),
            }
          : prev
      );
    } finally {
      setBlockLoadingId(null);
    }
  };

  // простая агрегация: активность по дням (по recentTransactions)
  const usageByDay = (() => {
    if (!stats) return [] as { date: string; label: string; amount: number }[];

    const map = new Map<string, number>();

    for (const tx of stats.recentTransactions) {
      const d = new Date(tx.createdAt);
      const key = d.toISOString().slice(0, 10); // YYYY-MM-DD
      const prev = map.get(key) || 0;
      map.set(key, prev + Math.abs(tx.amount));
    }

    const days: { date: string; label: string; amount: number }[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const amount = map.get(key) || 0;

      const label = d.toLocaleDateString(undefined, {
        day: '2-digit',
        month: 'short',
      });

      days.push({ date: key, label, amount });
    }

    return days;
  })();

  const maxUsage =
    usageByDay.reduce((m, d) => (d.amount > m ? d.amount : m), 0) || 1;

  // новые юзеры за 7 дней
  const newUsersByDay = (() => {
    if (!stats) return [] as { date: string; label: string; count: number }[];

    const map = new Map<string, number>();

    for (const u of stats.users) {
      const d = new Date(u.createdAt);
      const key = d.toISOString().slice(0, 10);
      const prev = map.get(key) || 0;
      map.set(key, prev + 1);
    }

    const days: { date: string; label: string; count: number }[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const count = map.get(key) || 0;

      const label = d.toLocaleDateString(undefined, {
        day: '2-digit',
        month: 'short',
      });

      days.push({ date: key, label, count });
    }

    return days;
  })();

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full" />
          <span className="text-gray-500 text-sm">Loading admin data…</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="bg-red-500/10 border border-red-500/40 rounded-xl p-6 max-w-md w-full text-sm">
          <p className="font-semibold mb-2">Admin error</p>
          <p className="text-red-300 mb-4">{error}</p>
          <button
            onClick={fetchStats}
            className="bg-yellow-500 text-black font-semibold px-4 py-2 rounded-lg hover:bg-yellow-400 transition"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-8">📊 Админ-панель</h1>

      {/* ОБЩАЯ СТАТИСТИКА */}
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

      {/* ГРАФИКИ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Активность */}
        <div className="bg-gray-900 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">⚡ Активность за 7 дней</h2>
          <div className="flex items-end gap-2 h-40">
            {usageByDay.map((d) => (
              <div
                key={d.date}
                className="flex flex-col items-center justify-end flex-1"
              >
                <div
                  className="w-full bg-gradient-to-t from-yellow-500 to-yellow-300 rounded-t-lg"
                  style={{
                    height: `${(d.amount / maxUsage) * 100 || 0}%`,
                  }}
                />
                <span className="mt-2 text-xs text-gray-400">
                  {d.label}
                </span>
                <span className="text-[10px] text-gray-500">
                  {d.amount ? d.amount.toLocaleString() : ''}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Новые пользователи */}
        <div className="bg-gray-900 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">👥 Новые юзеры (7 дней)</h2>
          <div className="flex items-end gap-2 h-40">
            {newUsersByDay.map((d) => (
              <div
                key={d.date}
                className="flex flex-col items-center justify-end flex-1"
              >
                <div
                  className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-lg"
                  style={{
                    height: `${(d.count / Math.max(...newUsersByDay.map((x) => x.count), 1)) * 100 || 0}%`,
                  }}
                />
                <span className="mt-2 text-xs text-gray-400">
                  {d.label}
                </span>
                <span className="text-[10px] text-gray-500">
                  {d.count || ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ПОЛЬЗОВАТЕЛИ */}
      <div className="bg-gray-900 rounded-xl p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">👥 Пользователи</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-800">
                <th className="pb-3">Email</th>
                <th className="pb-3">Кредиты</th>
                <th className="pb-3">Транзакций</th>
                <th className="pb-3">Статус</th>
                <th className="pb-3">Регистрация</th>
                <th className="pb-3">Действия</th>
              </tr>
            </thead>
            <tbody>
              {stats.users.map((user) => {
                const statusLabel = user.isBlocked
                  ? 'Заблокирован'
                  : user.suspicious
                  ? 'Подозрительный'
                  : 'OK';

                const statusColor = user.isBlocked
                  ? 'bg-red-500/20 text-red-400 border-red-500/40'
                  : user.suspicious
                  ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/40'
                  : 'bg-green-500/10 text-green-400 border-green-500/40';

                return (
                  <tr
                    key={user.id}
                    className={`border-b border-gray-800 ${
                      user.suspicious && !user.isBlocked
                        ? 'bg-yellow-500/5'
                        : ''
                    }`}
                  >
                    <td className="py-3">{user.email}</td>
                    <td className="py-3">
                      {user.credits.toLocaleString()}
                    </td>
                    <td className="py-3">
                      {user._count.transactions}
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs border ${statusColor}`}
                      >
                        {statusLabel}
                      </span>
                    </td>
                    <td className="py-3 text-gray-400">
                      {new Date(
                        user.createdAt
                      ).toLocaleDateString()}
                    </td>
                    <td className="py-3">
                      <button
                        onClick={() =>
                          toggleBlock(user.id, !user.isBlocked)
                        }
                        disabled={blockLoadingId === user.id}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold border ${
                          user.isBlocked
                            ? 'border-green-500 text-green-400 hover:bg-green-500/10'
                            : 'border-red-500 text-red-400 hover:bg-red-500/10'
                        } disabled:opacity-50`}
                      >
                        {blockLoadingId === user.id
                          ? '...'
                          : user.isBlocked
                          ? 'Разблокировать'
                          : 'Заблокировать'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ПОСЛЕДНИЕ ТРАНЗАКЦИИ */}
      <div className="bg-gray-900 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">📝 Последние действия</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-800">
                <th className="pb-3">Пользователь</th>
                <th className="pb-3">Действие</th>
                <th className="pb-3">Кредитов</th>
                <th className="pb-3">Время</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentTransactions.map((tx) => {
                const isNegative = tx.amount < 0;
                const value = Math.abs(tx.amount).toLocaleString();

                return (
                  <tr key={tx.id} className="border-b border-gray-800">
                    <td className="py-3">{tx.user.email}</td>
                    <td className="py-3">{tx.type}</td>
                    <td
                      className={`py-3 ${
                        isNegative ? 'text-red-400' : 'text-green-400'
                      }`}
                    >
                      {isNegative ? '-' : '+'}
                      {value}
                    </td>
                    <td className="py-3 text-gray-400">
                      {new Date(
                        tx.createdAt
                      ).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
