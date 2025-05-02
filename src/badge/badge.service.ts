import { Injectable, Logger } from '@nestjs/common';
import { SVGService } from './svg.service';
import { VelogAPIService } from './velog-api.service';
import { RSSParserService } from '../utils/rss-parser';
import { Feed, FeedItem } from '../interfaces/feed-item.interface';

@Injectable()
export class BadgeService {
  private readonly logger = new Logger(BadgeService.name);

  constructor(
    private readonly rssParserService: RSSParserService,
    private readonly velogAPIService: VelogAPIService,
    private readonly svgService: SVGService,
  ) {}

  async generateBadge(username: string, theme: string, posts: number): Promise<string> {
    try {
      const [totalLikes, tags, topLikedPosts] = await Promise.all([
        this.velogAPIService.getTotalLikes(username),
        this.velogAPIService.getPopularTags(username),
        this.velogAPIService.getTopLikedPosts(username, posts),
      ]);

      const topLikedFeedItems = this.convertToFeedItems(topLikedPosts, username);
      
      this.logger.log(`Top liked posts for ${username}: ${JSON.stringify(topLikedFeedItems)}`);
      
      return this.svgService.generateSVG(username, topLikedFeedItems, theme, totalLikes, tags);
    } catch (error) {
      this.logger.error(`Error generating badge for ${username}: ${error.message}`);
      throw error;
    }
  }

  async generateCustomBadge(username: string, theme: string, customPostLinks: string[]): Promise<string> {
    try {
      const totalLikes = await this.velogAPIService.getTotalLikes(username);

      const customFeedItems = this.createFeedItemsFromLinks(customPostLinks);
      
      this.logger.log(`Custom posts for ${username}: ${JSON.stringify(customFeedItems)}`);
      
      const emptyTags: string[] = [];
      
      return this.svgService.generateSVG(username, customFeedItems, theme, totalLikes, emptyTags);
    } catch (error) {
      this.logger.error(`Error generating custom badge for ${username}: ${error.message}`);
      throw error;
    }
  }

  private async getFeed(username: string): Promise<Feed> {
    try {
      return await this.rssParserService.parseRSS(`https://v2.velog.io/rss/${username}`);
    } catch (error) {
      this.logger.error(`Error fetching RSS feed for ${username}: ${error.message}`);
      return { items: [] };
    }
  }

  private convertToFeedItems(topLikedPosts: any[], username: string): FeedItem[] {
    return topLikedPosts.map(post => ({
      title: post.title,
      link: `https://velog.io/@${username}/${post.url_slug || post.id}`,
      pubDate: new Date().toISOString(),
      likes: post.likes
    }));
  }

  private createFeedItemsFromLinks(links: string[]): FeedItem[] {
    return links.map((link, index) => {
      const cleanedLink = link.replace(/[{}]/g, '');
      
      const urlParts = cleanedLink.split('/');
      const lastPart = urlParts[urlParts.length - 1];
      const title = decodeURIComponent(lastPart.replace(/-/g, ' '));
      
      return {
        title: title,
        link: cleanedLink,
        pubDate: new Date().toISOString(),
        likes: 0
      };
    });
  }
}