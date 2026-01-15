'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface DailyPoint {
  date: string;
  count: number;
}

interface AdminUser {
  id: string;
  email: string;
  credits: number;
  totalSpent: number;
  totalPurchased: number;
  isBlocked: boolean;
  createdAt: string;
  _count: {
    transactions: number;
    purchases: number;
  };
}

interface Tx {
  id: string;
  type: string;
  amount: number;
  createdAt: string;
  user: { email: string };
}

interface Visit {
  id: string;
  path: string;
  ip: string | null;
  country: string | null;
  userAgent: string | null;
  referer: string | null;
  createdAt: string;
  user: { email: string | null } | null;
}

interface SecurityEvent {
  id: string;
  type: string;
  level: string;
  ip: string | null;
  userAgent: string | null;
  details: string | null;
  createdAt: string;
  user: { email: string | null } | null;
}

interface Stats {
  totalUsers: number;
  totalCreditsUsed: number;
  totalCreditsRemaining: number;
  totalPurchases: number;
  totalRevenue: number;
  users: AdminUser[];
  recentTransactions: Tx[];
  daily: {
    visits: DailyPoint[];
    registrations: DailyPoint[];
  };
  recentVisits: Visit[];
  securityEvents: SecurityEvent[];
}

const adminEmails = ['chistola50@gmail.com'];

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [blockingUserId, setBlockingUserId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (status === 'loading') return;

    if (
      !session?.user?.email ||
      !adminEmails.includes(session.user.email)
    ) {
      router.push('/');
      return;
    }

    fetchStats();
  }, [session, status]);

  const fetchStats = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/stats');
    const data = await res.json();
    setStats(data);
    setLoading(false);
  };

  const toggleBlockUser = async (user: AdminUser) => {
    setBlockingUserId(user.id);
    try {
      await fetch('/api/admin/user/block', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          block: !user.isBlocked,
        }),
      });
      await fetchStats();
    } finally {
      setBlockingUserId(null);
    }
  };

  if (loading || !stats) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const maxVisits = Math.max(
    ...stats.daily.visits.map((d) => d.count),
    1,
  );
  const maxRegs = Math.max(
    ...stats.daily.registrations.map((d) => d.count),
    1,
  );

  return (
    <div className="min-h-screen bg-black text-white p-6 sm:p-8 space-y-8">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">📊 Admin Dashboard</h1>
        <div className="text-sm text-gray-400">
          {session?.user?.email}
        </div>
      </header>

      {/* TOP STATS */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
          <p className="text-gray-400 text-sm">Пользователи</p>
          <p className="text-3xl font-bold">
            {stats.totalUsers.toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
          <p className="text-gray-400 text-sm">Кредитов потрачено</p>
          <p className="text-3xl font-bold text-red-500">
            {stats.totalCreditsUsed.toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
          <p className="text-gray-400 text-sm">Кредитов осталось</p>
          <p className="text-3xl font-bold text-green-500">
            {stats.totalCreditsRemaining.toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
          <p className="text-gray-400 text-sm">Выручка</p>
          <p className="text-3xl font-bold text-yellow-500">
            ${stats.totalRevenue.toFixed(2)}
          </p>
        </div>
      </section>

      {/* CHARTS */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
          <h2 className="text-lg font-semibold mb-4">
            Трафик (посещения, 7 дней)
          </h2>
          <div className="flex items-end gap-2 h-40">
            {stats.daily.visits.map((d) => (
              <div
                key={d.date}
                className="flex-1 flex flex-col items-center"
              >
                <div
                  className="w-full bg-yellow-500 rounded-t-md"
                  style={{
                    height: `${(d.count / maxVisits) * 100 || 5}%`,
                  }}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {d.date.slice(5)}
                </div>
                <div className="text-xs text-gray-300">
                  {d.count}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
          <h2 className="text-lg font-semibold mb-4">
            Регистрации (7 дней)
          </h2>
          <div className="flex items-end gap-2 h-40">
            {stats.daily.registrations.map((d) => (
              <div
                key={d.date}
                className="flex-1 flex flex-col items-center"
              >
                <div
                  className="w-full bg-blue-500 rounded-t-md"
                  style={{
                    height: `${(d.count / maxRegs) * 100 || 5}%`,
                  }}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {d.date.slice(5)}
                </div>
                <div className="text-xs text-gray-300">
                  {d.count}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* USERS TABLE */}
      <section className="bg-gray-900 rounded-xl border border-gray-800 p-4 space-y-4">
        <h2 className="text-xl font-semibold">👥 Пользователи</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-800">
                <th className="pb-2">Email</th>
                <th className="pb-2">Кредиты</th>
                <th className="pb-2">Покупки</th>
                <th className="pb-2">Транзакций</th>
                <th className="pb-2">Spent</th>
                <th className="pb-2">Registered</th>
                <th className="pb-2">Статус</th>
                <th className="pb-2"></th>
              </tr>
            </thead>
            <tbody>
              {stats.users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-800 last:border-0"
                >
                  <td className="py-2">{user.email}</td>
                  <td className="py-2">
                    {user.credits.toLocaleString()}
                  </td>
                  <td className="py-2">
                    {user._count.purchases.toLocaleString()}
                  </td>
                  <td className="py-2">
                    {user._count.transactions.toLocaleString()}
                  </td>
                  <td className="py-2">
                    {user.totalSpent.toLocaleString()}
                  </td>
                  <td className="py-2 text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-2">
                    {user.isBlocked ? (
                      <span className="text-red-400 text-xs font-semibold">
                        BLOCKED
                      </span>
                    ) : (
                      <span className="text-green-400 text-xs font-semibold">
                        ACTIVE
                      </span>
                    )}
                  </td>
                  <td className="py-2">
                    <button
                      onClick={() => toggleBlockUser(user)}
                      disabled={blockingUserId === user.id}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                        user.isBlocked
                          ? 'bg-green-600 hover:bg-green-500'
                          : 'bg-red-600 hover:bg-red-500'
                      } ${
                        blockingUserId === user.id
                          ? 'opacity-50 cursor-not-allowed'
                          : ''
                      }`}
                    >
                      {blockingUserId === user.id
                        ? '...'
                        : user.isBlocked
                        ? 'Unblock'
                        : 'Block'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* LAST TRANSACTIONS + VISITS + SECURITY */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Transactions */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 space-y-3">
          <h2 className="text-lg font-semibold">
            📝 Последние транзакции
          </h2>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {stats.recentTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex justify-between text-xs border-b border-gray-800 pb-1 last:border-0"
              >
                <div>
                  <div className="text-gray-200">
                    {tx.user?.email || '—'}
                  </div>
                  <div className="text-gray-500">
                    {tx.type} •{' '}
                    {new Date(tx.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="text-red-400 font-semibold">
                  -{tx.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visits */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 space-y-3">
          <h2 className="text-lg font-semibold">
            🌍 Последние визиты
          </h2>
          <div className="space-y-2 max-h-80 overflow-y-auto text-xs">
            {stats.recentVisits.map((v) => (
              <div
                key={v.id}
                className="border-b border-gray-800 pb-1 last:border-0"
              >
                <div className="flex justify-between">
                  <span className="text-gray-200">
                    {v.user?.email || 'Гость'}
                  </span>
                  <span className="text-gray-500">
                    {new Date(v.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                <div className="text-gray-400">
                  Path: <span className="text-gray-200">{v.path}</span>
                </div>
                <div className="text-gray-500">
                  IP: {v.ip || '—'} | Country: {v.country || '—'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 space-y-3">
          <h2 className="text-lg font-semibold">
            🔐 Безопасность
          </h2>
          <div className="space-y-2 max-h-80 overflow-y-auto text-xs">
            {stats.securityEvents.map((e) => (
              <div
                key={e.id}
                className="border-b border-gray-800 pb-1 last:border-0"
              >
                <div className="flex justify-between">
                  <span
                    className={
                      e.level === 'high'
                        ? 'text-red-400'
                        : e.level === 'warning'
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }
                  >
                    {e.type}
                  </span>
                  <span className="text-gray-500">
                    {new Date(e.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                <div className="text-gray-400">
                  {e.user?.email || '—'} • IP: {e.ip || '—'}
                </div>
                {e.details && (
                  <div className="text-gray-500">
                    {e.details.slice(0, 80)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
