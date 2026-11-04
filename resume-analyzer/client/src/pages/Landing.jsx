import { Link } from 'react-router-dom';
import { BarChart3, CheckCircle2, FileSearch, History, Lightbulb, ShieldCheck, Sparkles, Target, Upload } from 'lucide-react';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import Logo from '../components/Logo';
import { CATEGORIES } from '../utils/constants';

const steps = [
  { icon: Upload, title: 'Upload your PDF', text: 'Drag in a text-based PDF resume. Only PDFs up to 5 MB are accepted.' },
  { icon: FileSearch, title: 'We read the text', text: 'The server checks the file and extracts your resume text securely.' },
  { icon: Sparkles, title: 'AI evaluates it', text: 'An AI model scores seven categories using a fixed, published framework.' },
  { icon: Target, title: 'Review and improve', text: 'See strengths, weaknesses, missing keywords and what to change first.' },
];

const features = [
  { icon: BarChart3, title: 'Transparent scoring', text: 'Every point of the 100-point score comes from a named category, so you know where to improve.' },
  { icon: CheckCircle2, title: 'Specific feedback', text: 'Strengths and weaknesses are tied to what your resume actually says, not generic advice.' },
  { icon: Lightbulb, title: 'Actionable suggestions', text: 'Get a short list of concrete edits, plus keywords that your resume does not mention yet.' },
  { icon: History, title: 'Track your progress', text: 'Each analysis is saved, so you can compare versions and watch your score change.' },
  { icon: ShieldCheck, title: 'Private by design', text: 'Your files stay on the server, are visible only to you, and can be deleted at any time.' },
  { icon: Sparkles, title: 'Built on a modern AI model', text: 'Analysis runs on the server through a secured API; no keys ever reach your browser.' },
];

const reasons = [
  'Instant feedback instead of waiting days for a mentor or friend to review.',
  'The same framework every time, which makes before-and-after comparisons meaningful.',
  'A fresh view of keywords and structure that you may overlook after many edits.',
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
        <div>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl">Analyze Your Resume with AI</h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
            Upload your resume and get an AI-powered score, strengths, weaknesses, and personalized suggestions.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button as={Link} to="/upload" size="lg">Analyze My Resume</Button>
            <Button as={Link} to="/login" variant="secondary" size="lg">Login</Button>
          </div>
          <p className="mt-4 text-sm text-slate-500">Free to use. PDF resumes only.</p>
        </div>

        {/* Illustration of the result layout - clearly labelled as an example, not real data. */}
        <figure className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm sm:p-6" aria-label="Example of an analysis report">
          <figcaption className="mb-4 text-sm font-medium text-slate-500">Example report layout</figcaption>
          <div className="rounded-xl bg-white p-5 ring-1 ring-slate-200">
            <div className="flex items-baseline justify-between">
              <p className="text-sm font-semibold text-ink">Overall score</p>
              <p className="text-3xl font-bold text-brand-700">82<span className="text-base font-medium text-slate-400"> / 100</span></p>
            </div>
            <div className="mt-5 space-y-3">
              {[['Skills', 18, 20], ['Experience', 17, 20], ['Projects', 13, 15], ['Keywords', 12, 15]].map(([label, value, max]) => (
                <div key={label}>
                  <div className="flex justify-between text-xs text-slate-600"><span>{label}</span><span>{value} / {max}</span></div>
                  <div className="mt-1 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-brand-600" style={{ width: `${(value / max) * 100}%` }} /></div>
                </div>
              ))}
            </div>
            <p className="mt-5 border-t border-slate-100 pt-4 text-xs leading-relaxed text-slate-500">
              Strengths, weaknesses, missing keywords and recommendations appear below your score.
            </p>
          </div>
        </figure>
      </section>

      <section id="how-it-works" className="border-y border-slate-200 bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">How it works</h2>
          <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(({ icon: Icon, title, text }, index) => (
              <li key={title} className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-700">{index + 1}</span>
                  <Icon className="h-5 w-5 text-slate-400" aria-hidden="true" />
                </div>
                <h3 className="mt-4 font-semibold text-ink">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="features" className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">Features</h2>
          <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, text }) => (
              <div key={title}>
                <Icon className="h-5 w-5 text-brand-700" aria-hidden="true" />
                <h3 className="mt-3 font-semibold text-ink">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="categories" className="border-y border-slate-200 bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">Resume analysis categories</h2>
          <p className="mt-3 max-w-2xl text-slate-600">Your 100-point score is the sum of these seven categories. Certifications and overall presentation are reflected inside them.</p>
          <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((category) => (
              <div key={category.key} className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5">
                <div>
                  <dt className="font-semibold text-ink">{category.label}</dt>
                  <dd className="mt-1 text-sm text-slate-600">{category.hint}</dd>
                </div>
                <span className="shrink-0 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-800">{category.max} pts</span>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">Why use AI resume analysis</h2>
            <ul className="mt-6 space-y-4">
              {reasons.map((reason) => (
                <li key={reason} className="flex gap-3 text-slate-700"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" aria-hidden="true" />{reason}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-sm leading-relaxed text-amber-900">
            <h3 className="font-semibold">What the score is, and is not</h3>
            <p className="mt-2">The score is an AI-generated evaluation based on the framework above. It is not an official ATS score, and it cannot predict whether an employer will shortlist you. Use it as a guide for improving your resume.</p>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-sm text-slate-500 sm:flex-row sm:px-6">
          <Logo />
          <p>MCA mini-project - built with MongoDB, Express, React and Node.js.</p>
        </div>
      </footer>
    </div>
  );
}
