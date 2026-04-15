import Hero from '@/components/Hero';
import BookingSection from '@/components/BookingSection';
import ContactDropdown from '@/components/ContactDropdown';
import PortfolioGrid from '@/components/PortfolioGrid';
import { defaultConfig } from '@/lib/config';

export default function HomePage() {
  const { photographer, booking, socialLinks, portfolio } = defaultConfig;

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="px-6">
        <Hero
          name={photographer.name}
          tagline={photographer.tagline}
          bio={photographer.bio}
          avatarUrl={photographer.avatarUrl}
        />
      </section>

      {/* Portfolio masonry: high on the page */}
      <section className="px-6 pb-12 md:pb-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl text-ink-900 text-center mb-10">
            Portfolio
          </h2>
          <PortfolioGrid items={portfolio} />
        </div>
      </section>

      <BookingSection booking={booking} />

      {/* Contact */}
      <section className="px-6 py-8 border-t border-ink-200/80">
        <div className="max-w-2xl mx-auto">
          <ContactDropdown links={socialLinks} />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-ink-500 text-sm">
        <p>Timeless frames</p>
      </footer>
    </main>
  );
}
