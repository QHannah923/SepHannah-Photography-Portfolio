'use client';

import Image from 'next/image';
import Masonry from 'react-masonry-css';
import type { PortfolioItem } from '@/lib/config';

interface PortfolioGridProps {
  items: PortfolioItem[];
}

/** Fixed crop frames; Masonry puts each card in the shortest column (true stagger). */
const ASPECT: Record<NonNullable<PortfolioItem['aspect']>, string> = {
  portrait: 'aspect-[3/4]',
  landscape: 'aspect-[4/3]',
  square: 'aspect-square',
};

/** Keys are max-width (px): see react-masonry-css `windowWidth <= breakpoint` */
const BREAKPOINT_COLS = {
  default: 4,
  1279: 3,
  639: 2,
  479: 1,
};

export default function PortfolioGrid({ items }: PortfolioGridProps) {
  return (
    <Masonry
      breakpointCols={BREAKPOINT_COLS}
      className="flex w-auto -ml-5"
      columnClassName="pl-5 bg-clip-padding box-border"
    >
      {items.map((item, index) => {
        const aspectKey = item.aspect ?? 'portrait';
        const aspectClass = ASPECT[aspectKey] ?? ASPECT.portrait;

        return (
          <article
            key={item.id}
            className="group gallery-item mb-5 break-inside-avoid rounded-2xl overflow-hidden bg-ink-100 shadow-md"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <a
              href={item.imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className={`relative w-full overflow-hidden ${aspectClass}`}>
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  sizes="(max-width: 480px) 100vw, (max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
            </a>
          </article>
        );
      })}
    </Masonry>
  );
}
