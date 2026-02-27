import { useState, useEffect } from 'react';

const cache = {};

async function fetchBookCover(title, series) {
  // Search by exact title first
  const queries = [title, series].filter(Boolean);
  for (const q of queries) {
    try {
      const res = await fetch(
        `https://openlibrary.org/search.json?title=${encodeURIComponent(q)}&limit=5&fields=cover_i,title`
      );
      const data = await res.json();
      const hit = data.docs?.find((d) => d.cover_i);
      if (hit?.cover_i) {
        return `https://covers.openlibrary.org/b/id/${hit.cover_i}-M.jpg`;
      }
    } catch {}
  }
  return '';
}

async function fetchMusicCover(title, series) {
  // series = artist name (e.g. "BTS", "BLACKPINK")
  const term = series ? `${series} ${title}` : title;
  try {
    const res = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=album&limit=5&country=us`
    );
    const data = await res.json();
    if (data.results?.length > 0) {
      const art = data.results[0].artworkUrl100;
      if (art) return art.replace('100x100bb', '400x400bb');
    }
  } catch {}
  return '';
}

async function fetchWikipediaCover(title) {
  // Converts "Some Title" -> "Some_Title" for Wikipedia slug
  const slug = title
    .replace(/\s+–\s+.*$/, '')   // strip " – subtitle" (e.g. album artist prefix)
    .replace(/\s+Season\s+\d+$/i, '')  // strip "Season N" suffix
    .trim()
    .replace(/\s+/g, '_');
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(slug)}`
    );
    if (!res.ok) return '';
    const data = await res.json();
    return data?.thumbnail?.source || '';
  } catch {}
  return '';
}

export function useCoverImage(item) {
  const cacheKey = item.id;
  const [src, setSrc] = useState(() => cache[cacheKey] || '');

  useEffect(() => {
    if (cache[cacheKey]) {
      setSrc(cache[cacheKey]);
      return;
    }

    let cancelled = false;

    (async () => {
      let url = '';
      const { category, title, series } = item;

      try {
        if (category === 'book') {
          url = await fetchBookCover(title, series);
        } else if (category === 'music') {
          url = await fetchMusicCover(title, series);
        } else if (category === 'show' || category === 'movie') {
          url = await fetchWikipediaCover(title);
        } else if (category === 'game') {
          url = await fetchWikipediaCover(title);
        }
      } catch {}

      if (!cancelled && url) {
        cache[cacheKey] = url;
        setSrc(url);
      }
    })();

    return () => { cancelled = true; };
  }, [item.id, item.category, item.title, item.series, cacheKey]);

  return src;
}
