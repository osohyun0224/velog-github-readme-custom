import { Controller, Get, Param, Res, Query } from '@nestjs/common';
import { Response } from 'express';
import { BadgeService } from './badge.service';

@Controller('badge')
export class BadgeController {
  constructor(private readonly badgeService: BadgeService) {}

  @Get(':username')
  async getBadge(
    @Param('username') username: string,
    @Query('theme') theme: string = 'light',
    @Query('posts') posts: number = 5,
    @Res() res: Response,
  ) {
    const svg = await this.badgeService.generateBadge(username, theme, posts);
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.send(svg);
  }

  @Get(':username/custom')
  async getCustomBadge(
    @Param('username') username: string,
    @Query('theme') theme: string = 'light',
    @Query('post1') post1: string,
    @Query('post2') post2: string,
    @Query('post3') post3: string,
    @Query('post4') post4: string = '',
    @Query('post5') post5: string = '',
    @Res() res: Response,
  ) {
    // 사용자가 제공한 포스트 링크 배열
    const customPosts = [];
    
    // URL 파라미터 복호화 후 처리
    if (post1) customPosts.push(decodeURIComponent(post1.replace(/[{}]/g, '')));
    if (post2) customPosts.push(decodeURIComponent(post2.replace(/[{}]/g, '')));
    if (post3) customPosts.push(decodeURIComponent(post3.replace(/[{}]/g, '')));
    if (post4) customPosts.push(decodeURIComponent(post4.replace(/[{}]/g, '')));
    if (post5) customPosts.push(decodeURIComponent(post5.replace(/[{}]/g, '')));
    
    console.log('Custom posts:', customPosts);
    
    const svg = await this.badgeService.generateCustomBadge(username, theme, customPosts);
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.send(svg);
  }
}