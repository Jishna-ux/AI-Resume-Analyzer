import { Link } from 'react-router-dom';
import { BarChart3, FileText, ScanSearch, Users } from 'lucide-react';
import Card from '../components/Card';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import useFetch from '../hooks/useFetch';
import { fetchStatistics } from '../services/adminService';
import { formatDate } from '../utils/format';

export default function AdminDashboard() {
  const { data: stats, loading, error, reload } = useFetch(fetchStatistics);

  if (loading) return <LoadingSpinner label="Loading statistics..." />;
  if (error) return <ErrorMessage message={error} onRetry={reload} />;

  const maxCount = Math.max(1, ...stats.scoreDistribution.map((bucket) => bucket.count));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">Admin overview</h1>
        <p className="text-sm text-slate-500">System-wide statistics. Resume contents are never shown here.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total users" value={stats.totalUsers} icon={Users} hint={`${stats.activeUsers} active`} />
        <StatCard label="Total resumes" value={stats.totalResumes} icon={FileText} />
        <StatCard label="Total analyses" value={stats.totalAnalyses} icon={ScanSearch} />
        <StatCard label="Average score" value={stats.averageScore} icon={BarChart3} hint="out of 100" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Score distribution">
          <ul className="space-y-3">
            {stats.scoreDistribution.map((bucket) => (
              <li key={bucket.range} className="flex items-center gap-3 text-sm">
                <span className="w-14 shrink-0 text-slate-600">{bucket.range}</span>
                <div className="h-3 flex-1 rounded-full bg-slate-100">
                  <div className="h-3 rounded-full bg-brand-600" style={{ width: `${(bucket.count / maxCount) * 100}%` }} />
                </div>
                <span className="w-8 shrink-0 text-right font-semibold text-ink">{bucket.count}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Recent activity" action={<Link to="/admin/users" className="text-sm font-semibold text-brand-700 hover:underline">Manage users</Link>}>
          {stats.recentActivity.length === 0 ? (
            <p className="text-sm text-slate-500">No analyses have been run yet.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {stats.recentActivity.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-ink">{item.user?.name || 'Deleted user'}</p>
                    <p className="text-xs text-slate-500">{formatDate(item.createdAt, true)}</p>
                  </div>
                  <span className="shrink-0 font-semibold text-slate-700">{item.overallScore} / 100</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
