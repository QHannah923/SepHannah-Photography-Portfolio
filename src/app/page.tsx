import Hero from '@/components/Hero';
import LinkButton from '@/components/LinkButton';
import PortfolioGrid from '@/components/PortfolioGrid';
import { defaultConfig } from '@/lib/config';
import { getLinksFromNotion, getPortfolioFromNotion } from '@/lib/notion';

export const revalidate = 60; // 每 60 秒重新验证（ISR）

export default async function HomePage() {
  // 优先从 Notion 获取数据，失败则使用默认配置
  const [notionPortfolio, notionLinks] = await Promise.all([
    getPortfolioFromNotion(),
    getLinksFromNotion(),
  ]);

  const portfolio = notionPortfolio ?? defaultConfig.portfolio;
  const socialLinks = notionLinks ?? defaultConfig.socialLinks;
  const { photographer } = defaultConfig;

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

      {/* Link-in-Bio 链接区 */}
      <section className="px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-2xl text-center text-ink-700 mb-8">
            找到我
          </h2>
          <div className="flex flex-col gap-4">
            {socialLinks.map((link) => (
              <LinkButton key={link.id} link={link} />
            ))}
          </div>
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
        <p>基于 Notion 构建 · 用镜头定格永恒</p>
      </footer>
    </main>
  );
}
