export async function searchBooks(query) {
  const params = new URLSearchParams({
    q: query,
    limit: '10',
    fields: 'key,title,author_name,first_publish_year,cover_i,subject',
  });

  const res = await fetch(`https://openlibrary.org/search.json?${params}`);
  if (!res.ok) throw new Error('Search failed');

  const data = await res.json();
  if (!data.docs || data.docs.length === 0) return [];

  return data.docs.map((doc) => {
    const title = doc.title || '';
    const authors = doc.author_name || [];
    const year = doc.first_publish_year ? String(doc.first_publish_year) : '';
    const coverId = doc.cover_i;
    const thumbnail = coverId
      ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
      : '';

    const series = extractSeries(title);

    return {
      title,
      series,
      category: 'book',
      releaseDate: year ? `${year}-01-01` : '',
      notes: authors.length ? `By ${authors.slice(0, 2).join(', ')}` : '',
      thumbnail,
      source: 'open_library',
    };
  });
}

function extractSeries(title) {
  const patterns = [
    /^(.+?)(?:\s*#\d+|\s*Book\s*\d+|\s*Vol\.?\s*\d+)/i,
    /^(.+?)(?:\s*:\s*.+)/,
  ];
  for (const pattern of patterns) {
    const match = title.match(pattern);
    if (match) return match[1].trim();
  }
  return '';
}

export async function searchGames(query) {
  // IGDB via a CORS-friendly proxy / free endpoint
  const params = new URLSearchParams({
    search: query,
    fields: 'name,first_release_date,cover,summary,genres.name',
    limit: '10',
  });

  // Use RAWG free tier (no key needed for basic search)
  const res = await fetch(
    `https://api.rawg.io/api/games?search=${encodeURIComponent(query)}&page_size=10&key=`
  );

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
