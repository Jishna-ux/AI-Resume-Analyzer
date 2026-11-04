import { Link } from 'react-router-dom';
import { FileText, Gauge, Trophy, Upload } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import StatCard from '../components/StatCard';
import ScoreTrend from '../components/ScoreTrend';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import useFetch from '../hooks/useFetch';
import { useAuth } from '../context/AuthContext';
import { fetchHistory } from '../services/resumeService';
import { formatDate, scoreTone } from '../utils/format';

export default function Dashboard() {
  const { user } = useAuth();
  const { data: analyses, loading, error, reload } = useFetch(fetchHistory);

  if (loading) return <LoadingSpinner label="Loading your dashboard..." />;
  if (error) return <ErrorMessage message={error} onRetry={reload} />;

  const latest = analyses[0]; // the API returns newest first
  const highest = analyses.reduce((best, item) => Math.max(best, item.overallScore), 0);
  const trend = [...analyses].reverse().map((item) => ({ id: item._id, score: item.overallScore, date: item.createdAt }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">Hello, {user.name.split(' ')[0]}</h1>
          <p className="text-sm text-slate-500">Here is how your resumes are doing.</p>
        </div>
        <Button as={Link} to="/upload"><Upload className="h-4 w-4" aria-hidden="true" />Upload New Resume</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Resumes analyzed" value={analyses.length} icon={FileText} />
        <StatCard label="Latest score" value={latest ? `${latest.overallScore}` : '-'} icon={Gauge} hint={latest ? `out of 100 - ${formatDate(latest.createdAt)}` : 'No analysis yet'} />
        <StatCard label="Highest score" value={analyses.length ? `${highest}` : '-'} icon={Trophy} hint={analyses.length ? 'out of 100' : undefined} />
      </div>

      {analyses.length === 0 ? (
        <Card className="py-12 text-center">
          <h2 className="text-lg font-semibold text-ink">Analyze your first resume</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">Upload a PDF and you will see your score, strengths, weaknesses and suggestions here.</p>
          <Button as={Link} to="/upload" className="mt-6">Upload a resume</Button>
        </Card>
      ) : (
        <>
          <Card title="Score over time"><ScoreTrend points={trend} /></Card>
          <Card title="Recent analyses" action={<Link to="/history" className="text-sm font-semibold text-brand-700 hover:underline">View all</Link>}>
            <ul className="divide-y divide-slate-100">
              {analyses.slice(0, 5).map((item) => (
                <li key={item._id}>
                  <Link to={`/analysis/${item._id}`} className="flex items-center justify-between gap-4 py-3 hover:bg-slate-50">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink">{item.resumeId?.originalFileName || 'Resume'}</p>
                      <p className="text-xs text-slate-500">{formatDate(item.createdAt)}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-3 py-1 text-sm font-semibold ring-1 ring-inset ${scoreTone(item.overallScore).badge}`}>{item.overallScore} / 100</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        </>
      )}
    </div>
  );
}
