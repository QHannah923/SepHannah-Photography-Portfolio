'use client';

import { useState } from 'react';

interface Props {
  submitLabel: string;
  ownerEmail: string;
}

export default function InquiryForm({ submitLabel, ownerEmail }: Props) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');
    const form = e.currentTarget;
    const fd = new FormData(form);

    const payload = {
      name: fd.get('name'),
      email: fd.get('email'),
      phone: fd.get('phone'),
      sessionType: fd.get('sessionType'),
      preferredDates: fd.get('preferredDates'),
      location: fd.get('location'),
      message: fd.get('message'),
      website: fd.get('website'),
    };

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus('error');
        setErrorMessage(typeof data.error === 'string' ? data.error : 'Something went wrong.');
        return;
      }

      setStatus('success');
      form.reset();
    } catch {
      setStatus('error');
      setErrorMessage('Network error. Check your connection or email us directly.');
    }
  }

  const inputClass =
    'w-full rounded-lg border border-ink-200 bg-white px-3 py-2.5 text-ink-900 text-sm placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-ink-400 focus:border-transparent';
  const labelClass = 'block text-left text-sm font-medium text-ink-700 mb-1';

  if (status === 'success') {
    return (
      <div className="mt-8 rounded-xl border border-green-200 bg-green-50 px-4 py-6 text-center text-green-900 text-sm">
        <p className="font-medium">Thank you. Your message is sent.</p>
        <p className="mt-2 text-green-800">I will reply soon.</p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-4 text-sm text-green-900 underline underline-offset-2"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 text-left max-w-md mx-auto space-y-4">
      {/* honeypot */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label htmlFor="name" className={labelClass}>
          Name <span className="text-red-600">*</span>
        </label>
        <input id="name" name="name" required className={inputClass} placeholder="Your name" autoComplete="name" />
      </div>

      <div>
        <label htmlFor="email" className={labelClass}>
          Email <span className="text-red-600">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className={inputClass}
          placeholder="you@example.com"
          autoComplete="email"
        />
      </div>

      <div>
        <label htmlFor="phone" className={labelClass}>
          Phone <span className="text-ink-400 font-normal">(optional)</span>
        </label>
        <input id="phone" name="phone" type="tel" className={inputClass} placeholder="+61 ..." autoComplete="tel" />
      </div>

      <div>
        <label htmlFor="sessionType" className={labelClass}>
          Session type
        </label>
        <select id="sessionType" name="sessionType" className={inputClass}>
          <option value="wedding">Wedding</option>
          <option value="graduation">Graduation</option>
          <option value="portrait">Portrait</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="preferredDates" className={labelClass}>
          Preferred date or dates
        </label>
        <textarea
          id="preferredDates"
          name="preferredDates"
          rows={2}
          className={inputClass}
          placeholder="e.g. 15 March 2026, or a few options"
        />
      </div>

      <div>
        <label htmlFor="location" className={labelClass}>
          Location <span className="text-ink-400 font-normal">(optional)</span>
        </label>
        <input id="location" name="location" className={inputClass} placeholder="Suburb or venue" />
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className={inputClass}
          placeholder="Anything else you want me to know"
        />
      </div>

      {status === 'error' && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {errorMessage}
          <span className="block mt-2 text-ink-600">
            You can also write to{' '}
            <a href={`mailto:${ownerEmail}`} className="underline break-all">
              {ownerEmail}
            </a>
            .
          </span>
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="link-button w-full rounded-xl bg-ink-900 text-ink-50 text-sm font-medium py-3.5 hover:bg-ink-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {status === 'sending' ? 'Sending…' : submitLabel}
      </button>

      <p className="text-ink-500 text-xs text-center leading-relaxed">
        Your details are only used to reply to this enquiry.
      </p>
    </form>
  );
}
