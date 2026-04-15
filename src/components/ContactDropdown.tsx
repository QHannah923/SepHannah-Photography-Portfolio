'use client';

import { useState } from 'react';
import { PLATFORM_ICONS } from '@/lib/config';
import type { SocialLink } from '@/lib/config';

interface ContactDropdownProps {
  links: SocialLink[];
}

const platformColors: Record<string, { bar: string; content: string }> = {
  wechat: { bar: 'border-green-200 hover:bg-green-50', content: 'bg-green-50/50 border-green-100' },
  instagram: { bar: 'border-pink-200 hover:bg-pink-50', content: 'bg-pink-50/50 border-pink-100' },
  xiaohongshu: { bar: 'border-red-200 hover:bg-red-50', content: 'bg-red-50/50 border-red-100' },
  RedNotes: { bar: 'border-red-200 hover:bg-red-50', content: 'bg-red-50/50 border-red-100' },
  douyin: { bar: 'border-cyan-200 hover:bg-cyan-50', content: 'bg-cyan-50/50 border-cyan-100' },
  Tiktok: { bar: 'border-cyan-200 hover:bg-cyan-50', content: 'bg-cyan-50/50 border-cyan-100' },
  email: { bar: 'border-amber-200 hover:bg-amber-50', content: 'bg-amber-50/50 border-amber-100' },
  custom: { bar: 'border-ink-200 hover:bg-ink-50', content: 'bg-ink-50/50 border-ink-100' },
};

function SingleDropdownItem({
  link,
  isOpen,
  onToggle,
  copiedId,
  onCopy,
}: {
  link: SocialLink;
  isOpen: boolean;
  onToggle: () => void;
  copiedId: string | null;
  onCopy: (id: string) => void;
}) {
  const colors = platformColors[link.platform] || platformColors.custom;
  const iconPath = link.icon && PLATFORM_ICONS[link.icon];

  const hasLink = link.url && !link.url.startsWith('#') && link.platform !== 'email';

  const handleAction = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasLink) {
      window.open(link.url!, '_blank');
      return;
    }
    try {
      await navigator.clipboard.writeText(link.value);
      onCopy(link.id);
    } catch {}
  };

  return (
    <div className="rounded-xl border-2 overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className={`link-button flex items-center gap-3 w-full px-5 py-4 text-left transition-colors border-b-0 rounded-t-xl ${colors.bar} ${isOpen ? 'rounded-b-none' : 'rounded-b-xl'}`}
      >
        {iconPath && (
          <svg className="w-5 h-5 text-ink-600 shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d={iconPath} />
          </svg>
        )}
        <span className="font-medium text-ink-800">{link.label}</span>
        <svg
          className={`w-5 h-5 text-ink-500 ml-auto transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-32' : 'max-h-0'}`}>
        <div
          className={`px-5 py-4 ${colors.content} border-t-2 border-ink-100 rounded-b-xl`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between gap-4">
            <span className="text-ink-700 text-sm break-all">{link.value}</span>
            <button
              type="button"
              onClick={handleAction}
              className="shrink-0 px-4 py-2 rounded-lg bg-white border border-ink-200 text-ink-700 text-sm font-medium hover:bg-ink-50 transition-colors"
            >
              {copiedId === link.id ? 'Copied ✓' : hasLink ? 'Open →' : 'Copy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContactDropdown({ links }: ContactDropdownProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="flex flex-col gap-3 w-full max-w-md mx-auto">
      {links.map((link) => (
        <SingleDropdownItem
          key={link.id}
          link={link}
          isOpen={openId === link.id}
          onToggle={() => handleToggle(link.id)}
          copiedId={copiedId}
          onCopy={(id) => {
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 1500);
          }}
        />
      ))}
    </div>
  );
}
