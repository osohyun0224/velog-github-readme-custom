import { FeedItem } from '../interfaces/feed-item.interface';

const WIDTH = 440;
const HEIGHT = 240;
const VELOG_LOGO_INLINE = `
  <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="30px" height="30px" viewBox="0 0 192 192" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd" xmlns:xlink="http://www.w3.org/1999/xlink">
    <g>
      <path style="opacity:0.999" fill="#21c997" d="M 16.5,-0.5 C 69.1667,-0.5 121.833,-0.5 174.5,-0.5C 182.5,2.83333 188.167,8.5 191.5,16.5C 191.5,69.1667 191.5,121.833 191.5,174.5C 188.167,182.5 182.5,188.167 174.5,191.5C 121.833,191.5 69.1667,191.5 16.5,191.5C 8.5,188.167 2.83333,182.5 -0.5,174.5C -0.5,121.833 -0.5,69.1667 -0.5,16.5C 2.83333,8.5 8.5,2.83333 16.5,-0.5 Z"/>
    </g>
    <g>
      <path style="opacity:1" fill="#fcfefd" d="M 73.5,49.5 C 76.5184,49.3354 79.5184,49.502 82.5,50C 84.5524,50.9299 86.0524,52.4299 87,54.5C 91.213,77.1573 95.3796,99.824 99.5,122.5C 110.182,110.139 118.016,96.1394 123,80.5C 123.667,76.8333 123.667,73.1667 123,69.5C 119.977,64.9771 116.144,61.3104 111.5,58.5C 117,51.0537 124.333,48.2203 133.5,50C 139.694,52.1834 142.694,56.5168 142.5,63C 141.356,74.788 137.522,85.6213 131,95.5C 120.94,110.894 110.106,125.728 98.5,140C 92.2041,141.012 85.8708,141.512 79.5,141.5C 75.9183,116.422 71.7516,91.4217 67,66.5C 61.1263,64.5698 54.9596,63.9032 48.5,64.5C 48.2317,61.8806 48.565,59.3806 49.5,57C 57.6593,54.5553 65.6593,52.0553 73.5,49.5 Z"/>
    </g>
  </svg>
`;

// 더 화려한 색상과 그라데이션 팔레트 정의
function getThemeColors(darkMode: boolean) {
  return {
    backgroundColor: darkMode ? '#131B2E' : '#F0F7FF',
    gradientStart: darkMode ? '#131B2E' : '#F0F7FF',
    gradientEnd: darkMode ? '#253555' : '#D9E8FF',
    textColor: darkMode ? '#F4F8FF' : '#1A202C',
    accentColor: '#21C997',
    accentGradientStart: '#21C997',
    accentGradientEnd: '#0CA678',
    secondaryColor: darkMode ? '#8C9CB1' : '#5A6987',
    cardColor: darkMode ? '#1F2A44' : '#FFFFFF',
    cardShadow: darkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)',
    fontPrimary: "'Poppins', 'Noto Sans KR', sans-serif",
    fontSecondary: "'Montserrat', 'Noto Sans KR', sans-serif",
  };
}

function createBackground(colors: ReturnType<typeof getThemeColors>, darkMode: boolean) {
  return `
    <defs>
      <linearGradient id="backgroundGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${colors.gradientStart};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${colors.gradientEnd};stop-opacity:1" />
      </linearGradient>
      
      <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${colors.accentGradientStart};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${colors.accentGradientEnd};stop-opacity:1" />
      </linearGradient>
      
      <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="${colors.cardShadow}" flood-opacity="0.3"/>
      </filter>
      
      <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="softGlow" />
        <feBlend in="SourceGraphic" in2="softGlow" mode="screen" />
      </filter>
    </defs>
    <rect width="100%" height="100%" fill="url(#backgroundGradient)" rx="16" />
    <rect x="2" y="2" width="${WIDTH-4}" height="${HEIGHT-4}" rx="14" fill="none" stroke="${colors.accentColor}" stroke-width="0.5" stroke-opacity="0.3" />
  `;
}

function createHeader(username: string, userProfileUrl: string, totalLikes: number, colors: ReturnType<typeof getThemeColors>) {
  function getHeartPosition(totalLikes: number, width: number) {
    const textWidth = totalLikes.toLocaleString().length * 12;
    return width - textWidth - 42;
  }

  const heartX = getHeartPosition(totalLikes, WIDTH);

  return `
    <g>
      <a href="${userProfileUrl}" target="_blank">
        <g transform="translate(20, 15)">
          <rect x="-5" y="-5" width="40" height="40" rx="8" fill="url(#accentGradient)" filter="url(#softGlow)" />
          ${VELOG_LOGO_INLINE}
        </g>
        <text x="68" y="37" font-family="${colors.fontPrimary}" font-size="18" font-weight="600" fill="${colors.textColor}">
          ${username}
        </text>
      </a>
    </g>
    
    <g transform="translate(${heartX}, 22)">
      <svg width="18" height="18" viewBox="0 0 24 24">
        <path fill="url(#accentGradient)" d="M18 1l-6 4-6-4-6 5v7l12 10 12-10v-7z" filter="url(#softGlow)"></path>
      </svg>
    </g>
    
    <text x="${WIDTH - 20}" y="36" font-family="${colors.fontSecondary}" font-size="16" font-weight="600" fill="${colors.secondaryColor}" text-anchor="end">
      ${totalLikes.toLocaleString()}
    </text>
  `;
}

function createTopLikedPosts(items: FeedItem[], colors: ReturnType<typeof getThemeColors>) {
  let content = `
    <text x="22" y="80" font-family="${colors.fontPrimary}" font-size="16" font-weight="600" fill="url(#accentGradient)">
      💖 Most Liked Posts
    </text>
    <line x1="22" y1="85" x2="180" y2="85" stroke="${colors.accentColor}" stroke-width="1.5" stroke-opacity="0.5" />
  `;

  items.slice(0, 3).forEach((item, index) => {
    const yPos = 115 + index * 35;
    const title = item.title.length > 38 ? item.title.substring(0, 35) + '...' : item.title;
    const date = new Date(item.pubDate).toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' });
    
    content += `
      <a href="${item.link}" target="_blank">
        <rect x="22" y="${yPos - 17}" width="${WIDTH - 44}" height="30" rx="8" fill="${colors.cardColor}" filter="url(#dropShadow)" />
        <text x="32" y="${yPos + 2}" font-family="${colors.fontPrimary}" font-size="13" font-weight="500" fill="${colors.textColor}">
          ${title}
        </text>
        <g transform="translate(${WIDTH - 74}, ${yPos - 10})">
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path fill="${colors.accentColor}" d="M18 1l-6 4-6-4-6 5v7l12 10 12-10v-7z"></path>
          </svg>
        </g>
        <text x="${WIDTH - 52}" y="${yPos + 2}" font-family="${colors.fontSecondary}" font-size="12" font-weight="500" fill="${colors.accentColor}" text-anchor="end">
          ${item.likes}
        </text>
        <text x="${WIDTH - 32}" y="${yPos + 2}" font-family="${colors.fontSecondary}" font-size="11" fill="${colors.secondaryColor}" text-anchor="end">
          ${date}
        </text>
      </a>
    `;
  });

  return content;
}

function createCustomPosts(items: FeedItem[], colors: ReturnType<typeof getThemeColors>) {
  let content = `
    <text x="22" y="80" font-family="${colors.fontPrimary}" font-size="16" font-weight="600" fill="url(#accentGradient)">
      ✨ Top Posts
    </text>
    <line x1="22" y1="85" x2="180" y2="85" stroke="${colors.accentColor}" stroke-width="1.5" stroke-opacity="0.5" />
  `;

  items.slice(0, 5).forEach((item, index) => {
    const yPos = 115 + index * 32;
    const title = item.title.length > 42 ? item.title.substring(0, 39) + '...' : item.title;
    
    content += `
      <a href="${item.link}" target="_blank">
        <rect x="22" y="${yPos - 17}" width="${WIDTH - 44}" height="28" rx="8" fill="${colors.cardColor}" filter="url(#dropShadow)" />
        <circle cx="36" cy="${yPos - 3}" r="5" fill="${colors.accentColor}" />
        <text x="48" y="${yPos + 2}" font-family="${colors.fontPrimary}" font-size="13" font-weight="500" fill="${colors.textColor}">
          ${title}
        </text>
      </a>
    `;
  });

  return content;
}

function createTags(tags: string[], colors: ReturnType<typeof getThemeColors>) {
  if (!tags || tags.length === 0) return '';
  
  let content = `
    <text x="22" y="195" font-family="${colors.fontPrimary}" font-size="16" font-weight="600" fill="url(#accentGradient)">
      🏷️ Top Tags
    </text>
    <line x1="22" y1="200" x2="120" y2="200" stroke="${colors.accentColor}" stroke-width="1.5" stroke-opacity="0.5" />
  `;
  
  const tagWidth = 95;
  const tagSpacing = 12;
  tags.slice(0, 5).forEach((tag, index) => {
    const xPos = 22 + index * (tagWidth + tagSpacing);
    const tagUrl = `https://velog.io/search?q=${encodeURIComponent(tag)}`;
    content += `
      <a href="${tagUrl}" target="_blank">
        <rect x="${xPos}" y="210" width="${tagWidth}" height="24" rx="12" 
              fill="${colors.cardColor}" filter="url(#dropShadow)" />
        <text x="${xPos + tagWidth / 2}" y="226" font-family="${colors.fontSecondary}" 
              font-size="12" font-weight="600" fill="${colors.accentColor}" text-anchor="middle">
          ${tag}
        </text>
      </a>
    `;
  });

  return content;
}

export function generateSVG(username: string, items: FeedItem[], theme: string, totalLikes: number, tags: string[]): string {
  const darkMode = theme === 'dark';
  const colors = getThemeColors(darkMode);
  const userProfileUrl = `https://velog.io/@${username}`;
  
  // 포스트 섹션 높이 조정 (태그가 없으면 더 높게)
  const hasTags = tags && tags.length > 0;
  const svgHeight = hasTags ? HEIGHT : 270;
  
  // 사용자 정의 포스트와 좋아요 순 포스트 구분
  const isCustomPosts = items.length > 0 && items[0].likes === 0;
  const postsContent = isCustomPosts ? createCustomPosts(items, colors) : createTopLikedPosts(items, colors);
  const tagsContent = hasTags ? createTags(tags, colors) : '';

  let svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${svgHeight}" viewBox="0 0 ${WIDTH} ${svgHeight}">
      ${createBackground(colors, darkMode)}
      ${createHeader(username, userProfileUrl, totalLikes, colors)}
      ${postsContent}
      ${tagsContent}
    </svg>
  `;

  return svgContent;
}