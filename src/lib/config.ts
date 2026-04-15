/**
 * 作品集与链接配置
 * 直接在此修改内容即可更新网站
 */

export interface SocialLink {
  id: string;
  platform: 'wechat' | 'instagram' | 'RedNotes' | 'Tiktok' | 'email' | 'custom';
  label: string;
  value: string;  // 显示/复制用的值（如微信号、邮箱）
  url?: string;   // 可选，点击跳转的链接
  icon?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  category?: string;
  date?: string;
  aspect?: 'portrait' | 'landscape' | 'square';
}

export interface BookingSection {
  /** Small label above the main line, e.g. "Make a Booking" */
  sectionTitle: string;
  /** Main emotional line, e.g. "Record memories with me" */
  headline: string;
  /** Short supporting text */
  body: string;
  /** Submit button label */
  submitLabel: string;
  /** Your email: shown if the form fails so they can still reach you */
  ownerEmail: string;
}

export interface SiteConfig {
  photographer: {
    name: string;
    tagline: string;
    avatarUrl?: string;
    bio?: string;
  };
  booking: BookingSection;
  socialLinks: SocialLink[];
  portfolio: PortfolioItem[];
}

export const PLATFORM_ICONS: Record<string, string> = {
  wechat: 'M8.5 2C4.36 2 1 4.69 1 8c0 1.89 1.08 3.56 2.71 4.64-.14.5-.9 2.91-.9 2.91-.11.25-.18.38-.18.38l.35.13A11.93 11.93 0 008.5 14c4.14 0 7.5-2.69 7.5-6s-3.36-6-7.5-6z',
  instagram: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
  xiaohongshu: 'M12.5 4.5C12.5 3 13 2 14 2s1.5 1.5 1.5 3-1 4-1 4h-2s-.5-2.5-.5-4.5zM9 8v10h10V8H9zm1 1h8v8h-8V9zm4-4.5c0 1.38-1.12 2.5-2.5 2.5S9 5.88 9 4.5 10.12 2 11.5 2s2.5 1.12 2.5 2.5z',
  douyin: 'M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z',
  email: 'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z',
};

export const defaultConfig: SiteConfig = {
  photographer: {
    name: 'SepHannah Studio',
    tagline: 'Brisbane wedding photographer',
    bio: 'Welcome. This is a mix of work I love. Real days, real people.',
  },
  booking: {
    sectionTitle: 'Make a Booking',
    headline: 'Record memories with me',
    body:
      'Your day, your story. Wedding, graduation, or a slow afternoon just for photos. Fill in the form and I will get back to you.',
    submitLabel: 'Send message',
    ownerEmail: 'qhannah000@gmail.com',
  },
  socialLinks: [
    { id: '1', platform: 'wechat', label: 'WeChat', value: 'SepHannah', icon: 'wechat' },
    { id: '2', platform: 'instagram', label: 'Instagram', value: '@Hannah.H_Photography_Brisbane', url: 'https://instagram.com/hannah.h_photography_brisbane', icon: 'instagram' },
    { id: '3', platform: 'email', label: 'Email', value: 'qhannah000@gmail.com', url: 'mailto:qhannah000@gmail.com', icon: 'email' },
    { id: '4', platform: 'RedNotes', label: 'Xiaohongshu', value: 'Sep_小黄 / Brisbane wedding photographer Hannah', url: 'https://www.xiaohongshu.com/search_result?keyword=Sep_%E5%B0%8F%E9%BB%84', icon: 'xiaohongshu' },
    { id: '5', platform: 'Tiktok', label: 'Douyin', value: 'Sep_小黄', url: 'https://www.douyin.com/search/Sep_%E5%B0%8F%E9%BB%84', icon: 'douyin' },
  ],
  // Each imageUrl matches a file in /public (add files there, then add a row here)
  portfolio: [
    {
      id: '1',
      title: 'Graduation Day',
      description: 'Graduation with your friends and family. Easy photos on a big day.',
      imageUrl: '/graduation.JPG',
      category: 'Graduation',
      date: '2024',
      aspect: 'portrait',
    },
    {
      id: '2',
      title: 'Ceremony I',
      description: 'The quiet parts of the day.',
      imageUrl: '/ceremony1.JPG',
      category: 'Wedding',
      date: '2024',
      aspect: 'landscape',
    },
    {
      id: '3',
      title: 'Ceremony II',
      description: 'Vows and light.',
      imageUrl: '/ceremony3.JPG',
      category: 'Wedding',
      date: '2024',
      aspect: 'square',
    },
    {
      id: '4',
      title: 'Wedding I',
      description: 'Your wedding day, warm and real.',
      imageUrl: '/wedding.JPG',
      category: 'Wedding',
      date: '2024',
      aspect: 'landscape',
    },
    {
      id: '5',
      title: 'Wedding II',
      description: 'More from the day.',
      imageUrl: '/wedding2.JPG',
      category: 'Wedding',
      date: '2024',
      aspect: 'square',
    },
    {
      id: '6',
      title: 'Wedding III',
      description: 'Details and moments.',
      imageUrl: '/wedding3.JPG',
      category: 'Wedding',
      date: '2024',
      aspect: 'portrait',
    },
    {
      id: '7',
      title: 'Portrait I',
      description: 'Portraits in soft light.',
      imageUrl: '/portrait.JPG',
      category: 'Portrait',
      date: '2024',
      aspect: 'square',
    },
    {
      id: '8',
      title: 'Portrait II',
      description: 'You relaxed, looking like yourself.',
      imageUrl: '/portrait2.JPG',
      category: 'Portrait',
      date: '2024',
      aspect: 'portrait',
    },
    {
      id: '9',
      title: 'Portrait III',
      description: 'Face and light.',
      imageUrl: '/portrait3.JPG',
      category: 'Portrait',
      date: '2024',
      aspect: 'landscape',
    },
  ],
};
