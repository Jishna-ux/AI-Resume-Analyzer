import Card from './Card';

const tones = {
  positive: { icon: 'text-emerald-600', dot: 'bg-emerald-500' },
  warning: { icon: 'text-amber-600', dot: 'bg-amber-500' },
  action: { icon: 'text-brand-700', dot: 'bg-brand-600' },
};

export default function FeedbackCard({ title, items = [], tone = 'action', icon: Icon, emptyText = 'Nothing to show.' }) {
  const colors = tones[tone];
  return (
    <Card
      title={
        <span className="flex items-center gap-2">
          {Icon && <Icon className={`h-4 w-4 ${colors.icon}`} aria-hidden="true" />}
          {title}
        </span>
      }
    >
      {items.length === 0 ? (
        <p className="text-sm text-slate-500">{emptyText}</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item} className="flex gap-3 text-sm leading-relaxed text-slate-700">
              <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${colors.dot}`} aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
