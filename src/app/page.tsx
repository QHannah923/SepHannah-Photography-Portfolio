import Hero from '@/components/Hero';
import ContactDropdown from '@/components/ContactDropdown';
import PortfolioGrid from '@/components/PortfolioGrid';
import { defaultConfig } from '@/lib/config';

export default function HomePage() {
  const { photographer, socialLinks, portfolio } = defaultConfig;

  return (
    <main className="min-h-screen">
      {/* Hero 区域 */}
      <section className="px-6">
        <Hero
          name={photographer.name}
          tagline={photographer.tagline}
          bio={photographer.bio}
          avatarUrl={photographer.avatarUrl}
        />
      </section>

      {/* 联系方式下拉区 */}
      <section className="px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <ContactDropdown links={socialLinks} />
        </div>
      </section>

      {/* 作品集 */}
      <section className="px-6 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl text-ink-900 text-center mb-12">
            作品集
          </h2>
          <PortfolioGrid items={portfolio} />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-ink-500 text-sm">
        <p>用镜头定格永恒</p>
      </footer>
    </main>
  );
}
