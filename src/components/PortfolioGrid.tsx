'use client';

import Image from 'next/image';
import type { PortfolioItem } from '@/lib/config';

interface PortfolioGridProps {
  items: PortfolioItem[];
}

export default function PortfolioGrid({ items }: PortfolioGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item, index) => (
        <article
          key={item.id}
          className="group gallery-item rounded-2xl overflow-hidden bg-ink-100 shadow-md"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <a href={item.imageUrl} target="_blank" rel="noopener noreferrer">
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="p-5">
              {item.category && (
                <span className="text-xs font-medium text-ink-500 uppercase tracking-wider">
                  {item.category}
                </span>
              )}
              <h3 className="font-serif text-xl text-ink-900 mt-1 group-hover:text-ink-700">
                {item.title}
              </h3>
              {item.description && (
                <p className="text-ink-600 text-sm mt-2 line-clamp-2">
                  {item.description}
                </p>
              )}
            </div>
          </a>
        </article>
      ))}
    </div>
  );
}
