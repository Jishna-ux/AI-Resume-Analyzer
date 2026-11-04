import { formatDate } from '../utils/format';

// Minimal SVG line chart (no chart library needed). `points` must be oldest -> newest.
export default function ScoreTrend({ points }) {
  if (points.length < 2) {
    return <p className="text-sm text-slate-500">Analyze at least two resumes to see how your score changes over time.</p>;
  }
  const width = 600;
  const height = 200;
  const pad = { top: 16, right: 20, bottom: 28, left: 34 };
  const x = (index) => pad.left + (index * (width - pad.left - pad.right)) / (points.length - 1);
  const y = (score) => pad.top + ((100 - score) * (height - pad.top - pad.bottom)) / 100;
  const line = points.map((p, i) => `${x(i)},${y(p.score)}`).join(' ');
  const first = points[0].score;
  const last = points[points.length - 1].score;
  const summary = `Score trend across ${points.length} analyses, from ${first} to ${last}.`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label={summary}>
      {[0, 50, 100].map((tick) => (
        <g key={tick}>
          <line x1={pad.left} x2={width - pad.right} y1={y(tick)} y2={y(tick)} stroke="#e2e8f0" />
          <text x={pad.left - 8} y={y(tick) + 4} textAnchor="end" fontSize="11" fill="#64748b">{tick}</text>
        </g>
      ))}
      <polyline points={line} fill="none" stroke="#0f8a7e" strokeWidth="2.5" strokeLinejoin="round" />
      {points.map((p, i) => (
        <g key={p.id}>
          <circle cx={x(i)} cy={y(p.score)} r="4.5" fill="#fff" stroke="#0f8a7e" strokeWidth="2.5">
            <title>{`${p.score}/100 on ${formatDate(p.date)}`}</title>
          </circle>
          {(i === 0 || i === points.length - 1) && (
            <text x={x(i)} y={height - 8} textAnchor={i === 0 ? 'start' : 'end'} fontSize="11" fill="#64748b">{formatDate(p.date)}</text>
          )}
        </g>
      ))}
    </svg>
  );
}
