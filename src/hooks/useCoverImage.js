import { useState, useEffect } from 'react';

const cache = {};

export function useCoverImage(item) {
  const cacheKey = item.id;
  const [src, setSrc] = useState(() => cache[cacheKey] || '');

  useEffect(() => {
    if (cache[cacheKey]) {
      setSrc(cache[cacheKey]);
      return;
    }

    if (item.category !== 'book') return;

    const query = encodeURIComponent(item.title);
    const url = `https://openlibrary.org/search.json?q=${query}&limit=1&fields=cover_i,title`;

    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        const coverId = data?.docs?.[0]?.cover_i;
        if (coverId) {
          const imgUrl = `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
          cache[cacheKey] = imgUrl;
          setSrc(imgUrl);
        }
      })
      .catch(() => {});
  }, [item.id, item.title, item.category, cacheKey]);

  return src;
}
