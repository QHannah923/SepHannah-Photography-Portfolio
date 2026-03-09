/**
 * Notion API 集成
 * 从 Notion 数据库获取作品集和链接数据
 */

import { Client } from '@notionhq/client';
import type { PortfolioItem, SocialLink } from './config';

const notion = process.env.NOTION_API_KEY
  ? new Client({ auth: process.env.NOTION_API_KEY })
  : null;

// Notion 数据库 ID - 需在环境变量中配置
const PORTFOLIO_DB_ID = process.env.NOTION_PORTFOLIO_DB_ID || '';
const LINKS_DB_ID = process.env.NOTION_LINKS_DB_ID || '';

export async function getPortfolioFromNotion(): Promise<PortfolioItem[] | null> {
  if (!notion || !PORTFOLIO_DB_ID) return null;

  try {
    const response = await notion.databases.query({
      database_id: PORTFOLIO_DB_ID,
      sorts: [{ property: 'Date', direction: 'descending' }],
    });

    return response.results.map((page: any) => {
      const props = page.properties;
      const imageUrl =
        props.Cover?.files?.[0]?.file?.url ||
        props.Image?.files?.[0]?.file?.url ||
        props['封面图']?.files?.[0]?.file?.url ||
        '';

      return {
        id: page.id,
        title: props.Title?.title?.[0]?.plain_text || props.标题?.title?.[0]?.plain_text || '未命名',
        description: props.Description?.rich_text?.[0]?.plain_text || props.描述?.rich_text?.[0]?.plain_text,
        imageUrl,
        category: props.Category?.select?.name || props.分类?.select?.name,
        date: props.Date?.date?.start || props.日期?.date?.start,
      };
    });
  } catch (error) {
    console.error('Notion portfolio fetch error:', error);
    return null;
  }
}

export async function getLinksFromNotion(): Promise<SocialLink[] | null> {
  if (!notion || !LINKS_DB_ID) return null;

  try {
    const response = await notion.databases.query({
      database_id: LINKS_DB_ID,
      sorts: [{ property: 'Order', number: { direction: 'ascending' } }],
    });

    const platformMap: Record<string, 'wechat' | 'instagram' | 'xiaohongshu' | 'douyin' | 'custom'> = {
      wechat: 'wechat',
      '微信': 'wechat',
      instagram: 'instagram',
      '小红书': 'xiaohongshu',
      xiaohongshu: 'xiaohongshu',
      '抖音': 'douyin',
      douyin: 'douyin',
    };

    return response.results.map((page: any) => {
      const props = page.properties;
      const platform = (props.Platform?.select?.name || props.平台?.select?.name || 'custom').toLowerCase();
      const label = props.Label?.title?.[0]?.plain_text || props.名称?.title?.[0]?.plain_text || platform;
      const url = props.URL?.url || props.链接?.url || '#';

      return {
        id: page.id,
        platform: platformMap[platform] || 'custom',
        label,
        url,
        icon: platform,
      };
    });
  } catch (error) {
    console.error('Notion links fetch error:', error);
    return null;
  }
}
