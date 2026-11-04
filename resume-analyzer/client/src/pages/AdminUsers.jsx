import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import useFetch from '../hooks/useFetch';
import { useAuth } from '../context/AuthContext';
import { fetchUsers, setUserStatus } from '../services/adminService';
import { formatDate, getErrorMessage } from '../utils/format';

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [target, setTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState('');

  // Wait for a pause in typing before querying the server.
  useEffect(() => {
    const timer = setTimeout(() => { setSearch(searchInput.trim()); setPage(1); }, 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, loading, error, reload } = useFetch(() => fetchUsers({ page, search }), [page, search]);

  const closeModal = () => { setTarget(null); setActionError(''); };

  const confirmToggle = async () => {
    setSaving(true);
    try {
      await setUserStatus(target._id, !target.isActive);
      closeModal();
      reload();
    } catch (err) {
      setActionError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">Users</h1>
          <p className="text-sm text-slate-500">{data ? `${data.total} registered` : 'Loading...'}</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            type="search" value={searchInput} onChange={(event) => setSearchInput(event.target.value)} aria-label="Search users by name or email" placeholder="Search name or email"
            className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm placeholder:text-slate-400"
          />
        </div>
      </div>

      <ErrorMessage message={error} onRetry={reload} />
      {loading && !data ? <LoadingSpinner label="Loading users..." /> : data && (
        <Card className="overflow-hidden !p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[44rem] text-left text-sm">
              <caption className="sr-only">Registered users</caption>
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
                <tr>
                  {['User', 'Role', 'Resumes', 'Analyses', 'Joined', 'Status'].map((heading) => <th key={heading} scope="col" className="px-5 py-3 font-semibold">{heading}</th>)}
                  <th scope="col" className="px-5 py-3 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.users.length === 0 && <tr><td colSpan={7} className="px-5 py-10 text-center text-slate-500">No users match your search.</td></tr>}
                {data.users.map((item) => (
                  <tr key={item._id}>
                    <td className="px-5 py-3.5"><p className="font-medium text-ink">{item.name}</p><p className="text-xs text-slate-500">{item.email}</p></td>
                    <td className="px-5 py-3.5 capitalize text-slate-600">{item.role}</td>
                    <td className="px-5 py-3.5 text-slate-600">{item.resumeCount}</td>
                    <td className="px-5 py-3.5 text-slate-600">{item.analysisCount}</td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-slate-600">{formatDate(item.createdAt)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${item.isActive ? 'bg-emerald-50 text-emerald-800 ring-emerald-200' : 'bg-slate-100 text-slate-600 ring-slate-200'}`}>{item.isActive ? 'Active' : 'Disabled'}</span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {item._id === currentUser._id ? <span className="text-xs text-slate-400">You</span> : (
                        <Button variant={item.isActive ? 'secondary' : 'primary'} size="sm" onClick={() => setTarget(item)}>{item.isActive ? 'Disable' : 'Activate'}</Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3 text-sm text-slate-600">
            <span>Page {data.page} of {data.totalPages}</span>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)} aria-label="Previous page"><ChevronLeft className="h-4 w-4" aria-hidden="true" /></Button>
              <Button variant="secondary" size="sm" disabled={page >= data.totalPages} onClick={() => setPage(page + 1)} aria-label="Next page"><ChevronRight className="h-4 w-4" aria-hidden="true" /></Button>
            </div>
          </div>
        </Card>
      )}

      <Modal
        open={Boolean(target)}
        title={target?.isActive ? 'Disable this user?' : 'Activate this user?'}
        onClose={closeModal}
        actions={<><Button variant="secondary" onClick={closeModal}>Cancel</Button><Button variant={target?.isActive ? 'danger' : 'primary'} loading={saving} onClick={confirmToggle}>{target?.isActive ? 'Disable' : 'Activate'}</Button></>}
      >
        <p>{target?.isActive ? `${target?.name} will be signed out and unable to log in until you activate the account again.` : `${target?.name} will be able to log in again.`}</p>
        <ErrorMessage message={actionError} className="mt-3" />
      </Modal>
    </div>
  );
}
