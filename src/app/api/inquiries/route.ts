import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const SESSION_TYPES = ['wedding', 'graduation', 'portrait', 'other'] as const;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      phone,
      sessionType,
      preferredDates,
      location,
      message,
      website: honeypot,
    } = body as Record<string, string | undefined>;

    if (honeypot) {
      return NextResponse.json({ ok: true });
    }

    const nameTrim = typeof name === 'string' ? name.trim() : '';
    const emailTrim = typeof email === 'string' ? email.trim() : '';

    if (!nameTrim || !emailTrim) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)) {
      return NextResponse.json({ error: 'Please enter a valid email.' }, { status: 400 });
    }

    const session =
      typeof sessionType === 'string' && SESSION_TYPES.includes(sessionType as (typeof SESSION_TYPES)[number])
        ? sessionType
        : 'other';

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      return NextResponse.json(
        { error: 'Form is not configured yet. Please email the studio directly.' },
        { status: 503 }
      );
    }

    const supabase = createClient(url, key);
    const { error } = await supabase.from('inquiries').insert({
      name: nameTrim,
      email: emailTrim,
      phone: typeof phone === 'string' ? phone.trim() || null : null,
      session_type: session,
      preferred_dates: typeof preferredDates === 'string' ? preferredDates.trim() || null : null,
      location: typeof location === 'string' ? location.trim() || null : null,
      message: typeof message === 'string' ? message.trim() || null : null,
    });

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: 'Could not save your message. Please try again or email us.' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
