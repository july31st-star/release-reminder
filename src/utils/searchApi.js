const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';

export async function searchBooks(query) {
  const params = new URLSearchParams({
    q: query,
    maxResults: '10',
    orderBy: 'relevance',
    printType: 'books',
  });

  const res = await fetch(`${GOOGLE_BOOKS_API}?${params}`);
  if (!res.ok) throw new Error('Search failed');

  const data = await res.json();
  if (!data.items) return [];

  return data.items.map((item) => {
    const info = item.volumeInfo;
    const releaseDate = info.publishedDate || '';
    let formattedDate = '';
    if (releaseDate.length === 10) {
      formattedDate = releaseDate;
    } else if (releaseDate.length === 7) {
      formattedDate = `${releaseDate}-01`;
    } else if (releaseDate.length === 4) {
      formattedDate = `${releaseDate}-01-01`;
    }

    const series = extractSeries(info.title, info.subtitle);

    return {
      title: info.title + (info.subtitle ? `: ${info.subtitle}` : ''),
      series,
      category: 'book',
      releaseDate: formattedDate,
      notes: info.authors ? `By ${info.authors.join(', ')}` : '',
      thumbnail: info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail || '',
      description: info.description || '',
      source: 'google_books',
    };
  });
}

function extractSeries(title, subtitle) {
  const combined = `${title} ${subtitle || ''}`;
  const seriesPatterns = [
    /^(.+?)(?:\s*#\d+|\s*Book\s*\d+|\s*Vol\.?\s*\d+)/i,
    /^(.+?)(?:\s*:\s*.+)/,
  ];
  for (const pattern of seriesPatterns) {
    const match = combined.match(pattern);
    if (match) return match[1].trim();
  }
  return '';
}

const RAWG_API = 'https://api.rawg.io/api/games';

export async function searchGames(query, apiKey) {
  if (!apiKey) return [];

  const params = new URLSearchParams({
    key: apiKey,
    search: query,
    page_size: '10',
    ordering: '-released',
  });

  const res = await fetch(`${RAWG_API}?${params}`);
  if (!res.ok) throw new Error('Game search failed');

  const data = await res.json();
  if (!data.results) return [];

  return data.results.map((game) => ({
    title: game.name,
    series: '',
    category: 'game',
    releaseDate: game.released || '',
    notes: game.genres ? game.genres.map((g) => g.name).join(', ') : '',
    thumbnail: game.background_image || '',
    description: '',
    source: 'rawg',
  }));
}

export async function search(query, category = 'book') {
  switch (category) {
    case 'book':
      return searchBooks(query);
    case 'game':
      return searchGames(query);
    default:
      return searchBooks(query);
  }
}
