import { Link, useParams } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, CheckCircle2, Info, Lightbulb } from 'lucide-react';
import Card from '../components/Card';
import ScoreCard from '../components/ScoreCard';
import CategoryScore from '../components/CategoryScore';
import FeedbackCard from '../components/FeedbackCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import useFetch from '../hooks/useFetch';
import { fetchAnalysis } from '../services/resumeService';
import { CATEGORIES, SCORE_DISCLAIMER } from '../utils/constants';
import { formatDate } from '../utils/format';

const Chip = ({ children, tone = 'slate' }) => (
  <li className={`rounded-full px-3 py-1 text-sm ${tone === 'amber' ? 'bg-amber-50 text-amber-900 ring-1 ring-inset ring-amber-200' : 'bg-slate-100 text-slate-700'}`}>{children}</li>
);

export default function AnalysisResult() {
  const { id } = useParams();
  const { data: analysis, loading, error, reload } = useFetch(() => fetchAnalysis(id), [id]);

  if (loading) return <LoadingSpinner label="Loading analysis..." />;
  if (error) return <ErrorMessage message={error} onRetry={reload} />;

  return (
    <div className="space-y-6">
      <div>
        <Link to="/history" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-ink">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />Analysis history
        </Link>
        <h1 className="mt-2 break-words text-2xl font-bold tracking-tight text-ink">{analysis.resumeId?.originalFileName || 'Resume analysis'}</h1>
        <p className="text-sm text-slate-500">Analyzed on {formatDate(analysis.createdAt, true)}</p>
      </div>

      <Card>
        <div className="grid items-center gap-8 md:grid-cols-[auto_1fr]">
          <ScoreCard score={analysis.overallScore} />
          <div className="space-y-4">
            {CATEGORIES.map((category) => (
              <CategoryScore key={category.key} label={category.label} hint={category.hint} value={analysis.categoryScores[category.key]} max={category.max} />
            ))}
          </div>
        </div>
        <p className="mt-6 flex gap-2 border-t border-slate-100 pt-4 text-xs leading-relaxed text-slate-500">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />{SCORE_DISCLAIMER}
        </p>
      </Card>

      <Card title="AI summary"><p className="leading-relaxed text-slate-700">{analysis.summary}</p></Card>

      <Card title="Skills detected">
        {analysis.skills.length ? <ul className="flex flex-wrap gap-2">{analysis.skills.map((skill) => <Chip key={skill}>{skill}</Chip>)}</ul> : <p className="text-sm text-slate-500">No specific skills were detected.</p>}
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <FeedbackCard title="Strengths" tone="positive" icon={CheckCircle2} items={analysis.strengths} />
        <FeedbackCard title="Weaknesses" tone="warning" icon={AlertTriangle} items={analysis.weaknesses} />
      </div>

      <Card title="Missing keywords">
        {analysis.missingKeywords.length ? (
          <>
            <p className="mb-3 text-sm text-slate-500">Consider adding these terms where they honestly apply to your experience.</p>
            <ul className="flex flex-wrap gap-2">{analysis.missingKeywords.map((keyword) => <Chip key={keyword} tone="amber">{keyword}</Chip>)}</ul>
          </>
        ) : <p className="text-sm text-slate-500">No important keywords appear to be missing.</p>}
      </Card>

      <FeedbackCard title="Recommendations" tone="action" icon={Lightbulb} items={analysis.recommendations} />
    </div>
  );
}
