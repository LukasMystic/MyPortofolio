import { useState } from 'react';
import axios from 'axios';
import { useTranslation } from '../context/TranslationContext';
import SEO from '../components/SEO';
import Glyph from '../components/Glyph';
import { Page, LargeTitle, GroupedList, Row, RowIcon, Button } from '../components/ui';
import { profile } from '../data/profile';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// A form laid out like an iOS inset grouped form: labels above fields, one
// card, a single primary action, inline status instead of a toast.
const Field = ({ id, label, as = 'input', ...props }) => {
  const Control = as;
  return (
  <div className="px-4 py-3">
    <label htmlFor={id} className="block text-footnote font-medium text-label2">
      {label}
    </label>
    <Control
      id={id}
      className="mt-1 w-full resize-y bg-transparent text-body text-label placeholder:text-label3 focus:outline-none"
      {...props}
    />
  </div>
  );
};

const ContactPage = () => {
  const { content } = useTranslation();
  const cv = content?.cv || {};
  const [form, setForm] = useState({ name: '', email: '', message: '', honeypot: '' });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);
    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/contact`, form);
      setResult({ type: 'success', message: data.message || 'Thanks — your message is on its way.' });
      setForm({ name: '', email: '', message: '', honeypot: '' });
    } catch (err) {
      setResult({ type: 'error', message: err.response?.data?.message || 'That didn’t go through. Please try again, or email me directly.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Page>
      <SEO
        title={`Contact | ${cv.fullName || 'Portfolio'}`}
        description={`Get in touch with ${cv.fullName || 'me'}. ${profile.availability}`}
        name={cv.fullName}
        type="website"
        url="https://stanleypt.vercel.app/contact"
      />

      <LargeTitle title="Contact" subtitle={`${profile.availability} The quickest way to reach me is email.`} />

      <div className="grid gap-8 md:grid-cols-[300px_minmax(0,1fr)]">
        <div className="space-y-6">
          <GroupedList inset="57px">
            {cv.email && <Row href={`mailto:${cv.email}`} icon={<RowIcon name="envelope" color="#007AFF" />} title="Email" subtitle={cv.email} />}
            {cv.linkedIn && <Row href={cv.linkedIn} icon={<RowIcon name="linkedin" color="#0A66C2" />} title="LinkedIn" subtitle="stanley-pratama-teguh" />}
            {cv.github && <Row href={cv.github} icon={<RowIcon name="github" color="#1C1C1E" />} title="GitHub" subtitle="LukasMystic" />}
          </GroupedList>
          <GroupedList inset="57px">
            <Row href="/CV.pdf" icon={<RowIcon name="doc.text" color="#FF9500" />} title="Download CV" subtitle="PDF" />
          </GroupedList>
        </div>

        <form onSubmit={onSubmit} noValidate={false} aria-describedby={result ? 'form-status' : undefined}>
          <h2 className="mb-1.5 px-4 text-footnote uppercase text-label2">Send a message</h2>
          <div className="grouped-list overflow-hidden rounded-card bg-elevated">
            <Field id="name" name="name" label="Name" autoComplete="name" required value={form.name} onChange={onChange} />
            <Field id="email" name="email" type="email" label="Email" autoComplete="email" inputMode="email" required value={form.email} onChange={onChange} />
            <Field id="message" name="message" as="textarea" rows={6} label="Message" required value={form.message} onChange={onChange} />
          </div>
          <div className="hidden" aria-hidden="true">
            <label htmlFor="honeypot">Leave this empty</label>
            <input type="text" id="honeypot" name="honeypot" tabIndex={-1} autoComplete="off" value={form.honeypot} onChange={onChange} />
          </div>

          {result && (
            <p
              id="form-status"
              role="status"
              className={`mt-3 flex items-start gap-2 px-4 text-subhead ${result.type === 'success' ? 'text-sys-green' : 'text-sys-red'}`}
            >
              <Glyph name={result.type === 'success' ? 'checkmark' : 'exclamationmark.circle'} className="mt-0.5 h-4 w-4" weight={2.25} />
              {result.message}
            </p>
          )}

          <div className="mt-4 px-1">
            <Button type="submit" disabled={submitting} className="w-full sm:w-auto sm:min-w-[160px]">
              {submitting ? 'Sending…' : 'Send'}
            </Button>
          </div>
        </form>
      </div>
    </Page>
  );
};

export default ContactPage;
