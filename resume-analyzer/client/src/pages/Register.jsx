import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import FormField from '../components/FormField';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/format';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const update = (field) => (event) => setForm({ ...form, [field]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      setError('The passwords do not match.');
      return;
    }
    setSubmitting(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      navigate('/upload', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="It takes a minute. Then upload your first resume."
      footer={<>Already registered? <Link to="/login" className="font-semibold text-brand-700 hover:underline">Log in</Link></>}
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <ErrorMessage message={error} />
        <FormField label="Full name" autoComplete="name" required value={form.name} onChange={update('name')} />
        <FormField label="Email" type="email" autoComplete="email" required value={form.email} onChange={update('email')} />
        <FormField label="Password" type="password" autoComplete="new-password" required hint="At least 8 characters, with a letter and a number." value={form.password} onChange={update('password')} />
        <FormField label="Confirm password" type="password" autoComplete="new-password" required value={form.confirm} onChange={update('confirm')} />
        <Button type="submit" loading={submitting} className="w-full">Create account</Button>
      </form>
    </AuthLayout>
  );
}
