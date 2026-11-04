import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Trash2 } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import ScoreTrend from '../components/ScoreTrend';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import useFetch from '../hooks/useFetch';
import { deleteAnalysis, fetchHistory } from '../services/resumeService';
import { formatDate, getErrorMessage, scoreTone } from '../utils/format';

export default function AnalysisHistory() {
  const { data: analyses, setData, loading, error, reload } = useFetch(fetchHistory);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteAnalysis(toDelete._id);
      setData(analyses.filter((item) => item._id !== toDelete._id));
      setToDelete(null);
    } catch (err) {
      setDeleteError(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  const closeModal = () => { setToDelete(null); setDeleteError(''); };

  if (loading) return <LoadingSpinner label="Loading history..." />;
  if (error) return <ErrorMessage message={error} onRetry={reload} />;

  const chronological = [...analyses].reverse();
  const change = chronological.length > 1 ? chronological.at(-1).overallScore - chronological[0].overallScore : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">Analysis history</h1>
          <p className="text-sm text-slate-500">{analyses.length} saved {analyses.length === 1 ? 'analysis' : 'analyses'}</p>
        </div>
        <Button as={Link} to="/upload">Upload New Resume</Button>
      </div>

      {analyses.length === 0 ? (
        <Card className="py-12 text-center">
          <p className="font-semibold text-ink">No analyses yet</p>
          <p className="mt-1 text-sm text-slate-500">Upload a resume to see it listed here.</p>
        </Card>
      ) : (
        <>
          {change !== null && (
            <Card title="Progress over time" action={<span className={`text-sm font-semibold ${change >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>{change >= 0 ? '+' : ''}{change} since your first analysis</span>}>
              <ScoreTrend points={chronological.map((item) => ({ id: item._id, score: item.overallScore, date: item.createdAt }))} />
            </Card>
          )}

          <Card className="overflow-hidden !p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[34rem] text-left text-sm">
                <caption className="sr-only">Your resume analyses</caption>
                <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
                  <tr>
                    <th scope="col" className="px-5 py-3 font-semibold">Resume</th>
                    <th scope="col" className="px-5 py-3 font-semibold">Score</th>
                    <th scope="col" className="px-5 py-3 font-semibold">Date</th>
                    <th scope="col" className="px-5 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {analyses.map((item) => (
                    <tr key={item._id}>
                      <td className="max-w-[14rem] truncate px-5 py-3.5 font-medium text-ink">{item.resumeId?.originalFileName || 'Resume'}</td>
                      <td className="px-5 py-3.5"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${scoreTone(item.overallScore).badge}`}>{item.overallScore} / 100</span></td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-slate-600">{formatDate(item.createdAt)}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex justify-end gap-2">
                          <Button as={Link} to={`/analysis/${item._id}`} variant="secondary" size="sm"><Eye className="h-4 w-4" aria-hidden="true" />View</Button>
                          <Button variant="ghost" size="sm" onClick={() => setToDelete(item)} aria-label={`Delete analysis of ${item.resumeId?.originalFileName || 'resume'}`}>
                            <Trash2 className="h-4 w-4 text-rose-600" aria-hidden="true" />Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      <Modal
        open={Boolean(toDelete)}
        title="Delete this analysis?"
        onClose={closeModal}
        actions={<><Button variant="secondary" onClick={closeModal}>Cancel</Button><Button variant="danger" loading={deleting} onClick={confirmDelete}>Delete</Button></>}
      >
        <p>This removes the analysis and, if nothing else uses it, the uploaded PDF and its extracted text. This cannot be undone.</p>
        <ErrorMessage message={deleteError} className="mt-3" />
      </Modal>
    </div>
  );
}
