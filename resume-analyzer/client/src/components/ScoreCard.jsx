import { scoreTone } from '../utils/format';

// Circular gauge showing the overall score out of 100.
export default function ScoreCard({ score, size = 168 }) {
  const tone = scoreTone(score);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90" role="img" aria-label={`Overall score ${score} out of 100`}>
          <circle cx="64" cy="64" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="10" />
          <circle
            cx="64" cy="64" r={radius} fill="none" stroke={tone.stroke} strokeWidth="10" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={circumference * (1 - score / 100)}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-bold ${tone.text}`}>{score}</span>
          <span className="text-xs text-slate-500">out of 100</span>
        </div>
      </div>
      <span className={`mt-3 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${tone.badge}`}>{tone.label}</span>
    </div>
  );
}
