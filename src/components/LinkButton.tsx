'use client';

import { PLATFORM_ICONS } from '@/lib/config';
import type { SocialLink } from '@/lib/config';

interface LinkButtonProps {
  link: SocialLink;
}

const platformColors: Record<string, string> = {
  wechat: 'hover:bg-green-100 border-green-200',
  instagram: 'hover:bg-pink-100 border-pink-200',
  xiaohongshu: 'hover:bg-red-100 border-red-200',
  douyin: 'hover:bg-cyan-100 border-cyan-200',
  custom: 'hover:bg-ink-100 border-ink-200',
};

export default function LinkButton({ link }: LinkButtonProps) {
  const colorClass = platformColors[link.platform] || platformColors.custom;
  const iconPath = link.icon && PLATFORM_ICONS[link.icon];

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        link-button flex items-center gap-4 w-full max-w-md mx-auto
        px-6 py-4 rounded-xl border-2 bg-white
        ${colorClass}
      `}
    >
      {iconPath && (
        <svg
          className="w-6 h-6 text-ink-600 shrink-0"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d={iconPath} />
        </svg>
      )}
      <span className="font-medium text-ink-800">{link.label}</span>
      <span className="ml-auto text-ink-400">→</span>
    </a>
  );
}
