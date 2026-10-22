/**
 * Video helper utilities for YouTube, Vimeo, Loom and Direct Embeds.
 * Automatically parses user-pasted watch URLs into compliant iframe embed URLs
 * and extracts video thumbnails (e.g. YouTube high-quality cover).
 */

/**
 * Extracts a YouTube 11-character video ID from any format:
 * - https://www.youtube.com/watch?v=dQw4w9WgXcQ
 * - https://youtu.be/dQw4w9WgXcQ
 * - https://youtube.com/shorts/dQw4w9WgXcQ
 * - https://www.youtube.com/embed/dQw4w9WgXcQ
 * - https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ
 * - https://m.youtube.com/watch?v=dQw4w9WgXcQ
 * - With query params like &t=10s, &si=...
 */
export function getYouTubeId(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  const regExp = /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|shorts)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i;
  const match = trimmed.match(regExp);
  return match ? match[1] : null;
}

/**
 * Extracts Vimeo video ID from URL
 */
export function getVimeoId(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  const match = url.trim().match(/(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|))(\d+)/i);
  return match ? match[1] : null;
}

/**
 * Extracts Loom video ID from URL
 */
export function getLoomId(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  const match = url.trim().match(/loom\.com\/(?:share|embed)\/([a-zA-Z0-9_-]+)/i);
  return match ? match[1] : null;
}

/**
 * Detects the platform of the given video URL
 */
export function getVideoPlatform(url: string): 'youtube' | 'vimeo' | 'loom' | 'direct' | 'unknown' {
  if (!url) return 'unknown';
  if (getYouTubeId(url)) return 'youtube';
  if (getVimeoId(url)) return 'vimeo';
  if (getLoomId(url)) return 'loom';
  if (/\.(mp4|webm|ogg)($|\?)/i.test(url)) return 'direct';
  return 'unknown';
}

/**
 * Converts any user-entered video URL into an iframe-compatible embed URL
 * with autoplay and inline options.
 */
export function formatVideoEmbedUrl(url: string, autoplay = true): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();

  // 1. YouTube -> use privacy-friendly youtube-nocookie with rel=0 & playsinline
  const ytId = getYouTubeId(trimmed);
  if (ytId) {
    const params = new URLSearchParams({
      rel: '0',
      enablejsapi: '1',
      playsinline: '1'
    });
    if (autoplay) {
      params.set('autoplay', '1');
    }
    return `https://www.youtube-nocookie.com/embed/${ytId}?${params.toString()}`;
  }

  // 2. Vimeo
  const vimeoId = getVimeoId(trimmed);
  if (vimeoId) {
    const params = new URLSearchParams({
      dnt: '1'
    });
    if (autoplay) {
      params.set('autoplay', '1');
    }
    return `https://player.vimeo.com/video/${vimeoId}?${params.toString()}`;
  }

  // 3. Loom
  const loomId = getLoomId(trimmed);
  if (loomId) {
    return `https://www.loom.com/embed/${loomId}${autoplay ? '?autoplay=1' : ''}`;
  }

  // 4. Direct embed fallback
  if (autoplay && !trimmed.includes('autoplay=')) {
    return trimmed.includes('?') ? `${trimmed}&autoplay=1` : `${trimmed}?autoplay=1`;
  }

  return trimmed;
}

/**
 * Returns a high-res video thumbnail URL.
 * If user provided a custom thumbnail, returns that.
 * Otherwise, if it's YouTube, returns YouTube's hqdefault thumbnail.
 */
export function getVideoThumbnail(url?: string, customThumbnail?: string): string {
  if (customThumbnail && customThumbnail.trim()) {
    return customThumbnail.trim();
  }
  if (!url) return '';
  const ytId = getYouTubeId(url);
  if (ytId) {
    return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
  }
  return '';
}
