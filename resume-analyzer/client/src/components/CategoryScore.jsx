import { scoreTone } from '../utils/format';

export default function CategoryScore({ label, hint, value, max }) {
  const percent = Math.round((value / max) * 100);
  const tone = scoreTone(percent);
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-ink">{label}</p>
          {hint && <p className="text-xs text-slate-500">{hint}</p>}
        </div>
        <p className="shrink-0 text-sm font-semibold text-slate-700">{value} / {max}</p>
      </div>
      <div
        className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"
        role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={value}
      >
        <div className={`h-full rounded-full ${tone.bar}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
