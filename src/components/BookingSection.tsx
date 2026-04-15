import type { BookingSection as BookingSectionType } from '@/lib/config';
import InquiryForm from '@/components/InquiryForm';

interface Props {
  booking: BookingSectionType;
}

export default function BookingSection({ booking }: Props) {
  return (
    <section className="px-6 py-14 md:py-20">
      <div className="max-w-2xl mx-auto text-center rounded-2xl border border-ink-200 bg-ink-100/80 px-8 py-12 md:py-14 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-ink-500 mb-4">
          {booking.sectionTitle}
        </p>
        <h2 className="font-serif text-3xl md:text-4xl text-ink-900 font-medium leading-tight">
          {booking.headline}
        </h2>
        <p className="text-ink-600 text-sm md:text-base mt-5 leading-relaxed max-w-lg mx-auto">
          {booking.body}
        </p>
        <InquiryForm submitLabel={booking.submitLabel} ownerEmail={booking.ownerEmail} />
      </div>
    </section>
  );
}
