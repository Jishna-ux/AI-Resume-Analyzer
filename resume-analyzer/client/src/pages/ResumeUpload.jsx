import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Loader2 } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import FileUploader from '../components/FileUploader';
import ErrorMessage from '../components/ErrorMessage';
import { requestAnalysis, uploadResume } from '../services/resumeService';
import { getErrorMessage } from '../utils/format';

export default function ResumeUpload() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [stage, setStage] = useState('idle'); // idle | uploading | analyzing | error
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [resumeId, setResumeId] = useState(null); // kept so a failed analysis can be retried without re-uploading

  const busy = stage === 'uploading' || stage === 'analyzing';

  const runAnalysis = async (id) => {
    setStage('analyzing');
    try {
      const analysis = await requestAnalysis(id);
      navigate(`/analysis/${analysis._id}`);
    } catch (err) {
      setError(getErrorMessage(err));
      setStage('error');
    }
  };

  const startUpload = async () => {
    setError('');
    setProgress(0);
    setStage('uploading');
    try {
      const resume = await uploadResume(file, setProgress);
      setResumeId(resume._id);
      await runAnalysis(resume._id);
    } catch (err) {
      setError(getErrorMessage(err));
      setStage('error');
    }
  };

  const handleSubmit = () => (resumeId ? runAnalysis(resumeId) : startUpload());

  const clearFile = () => {
    setFile(null);
    setResumeId(null);
    setStage('idle');
    setError('');
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">Upload a resume</h1>
        <p className="text-sm text-slate-500">We extract the text, score it with AI, and save the result to your history.</p>
      </div>

      <Card>
        <FileUploader file={file} onSelect={setFile} onClear={clearFile} onError={setError} disabled={busy} />

        {stage === 'uploading' && (
          <div className="mt-5" role="status">
            <div className="flex justify-between text-sm text-slate-600"><span>Uploading...</span><span>{progress}%</span></div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {stage === 'analyzing' && (
          <div className="mt-5 space-y-2 text-sm" role="status">
            <p className="flex items-center gap-2 text-slate-600"><CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />Resume uploaded and text extracted</p>
            <p className="flex items-center gap-2 font-medium text-ink"><Loader2 className="h-4 w-4 animate-spin text-brand-700" aria-hidden="true" />Analyzing your resume...</p>
            <p className="text-slate-500">This usually takes 10 to 30 seconds. You can keep this tab open.</p>
          </div>
        )}

        <ErrorMessage message={error} className="mt-5" />

        {file && !busy && (
          <Button onClick={handleSubmit} className="mt-5 w-full" size="lg">
            {stage === 'error' && resumeId ? 'Retry analysis' : 'Analyze resume'}
          </Button>
        )}
      </Card>

      <p className="text-xs leading-relaxed text-slate-500">
        Tips: use a text-based PDF (exported from Word or Google Docs), not a scan or photo. Your file is private to your account and you can delete it from your history at any time.
      </p>
    </div>
  );
}
