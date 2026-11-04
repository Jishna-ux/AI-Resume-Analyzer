import { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import FormField from '../components/FormField';
import ErrorMessage from '../components/ErrorMessage';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/authService';
import { formatDate, getErrorMessage } from '../utils/format';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user.name);
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      const payload = { name };
      if (passwords.newPassword || passwords.currentPassword) Object.assign(payload, passwords);
      const result = await updateProfile(payload);
      setUser(result.user);
      setPasswords({ currentPassword: '', newPassword: '' });
      setSuccess('Your profile was updated.');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">Profile</h1>
        <p className="text-sm text-slate-500">Member since {formatDate(user.createdAt)} - {user.role === 'admin' ? 'Administrator' : 'Candidate'}</p>
      </div>
      <form onSubmit={handleSubmit} noValidate>
        <Card title="Your details" className="space-y-4">
          <ErrorMessage message={error} />
          {success && <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{success}</p>}
          <FormField label="Full name" value={name} onChange={(event) => setName(event.target.value)} required />
          <FormField label="Email" value={user.email} readOnly hint="Your email is your login and cannot be changed." />
          <div className="border-t border-slate-100 pt-4">
            <h3 className="text-sm font-semibold text-ink">Change password</h3>
            <p className="mb-3 text-xs text-slate-500">Leave blank to keep your current password.</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Current password" type="password" autoComplete="current-password" value={passwords.currentPassword} onChange={(event) => setPasswords({ ...passwords, currentPassword: event.target.value })} />
              <FormField label="New password" type="password" autoComplete="new-password" value={passwords.newPassword} onChange={(event) => setPasswords({ ...passwords, newPassword: event.target.value })} />
            </div>
          </div>
          <Button type="submit" loading={saving}>Save changes</Button>
        </Card>
      </form>
    </div>
  );
}
