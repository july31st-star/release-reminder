const CATEGORIES = [
  { value: 'all', label: 'All', icon: '✦' },
  { value: 'game', label: 'Games', icon: '🎮' },
  { value: 'book', label: 'Books', icon: '📚' },
  { value: 'movie', label: 'Movies', icon: '🎬' },
  { value: 'show', label: 'Shows', icon: '📺' },
  { value: 'music', label: 'Music', icon: '🎵' },
  { value: 'other', label: 'Other', icon: '📦' },
];

const SORT_OPTIONS = [
  { value: 'date-asc', label: 'Soonest first' },
  { value: 'date-desc', label: 'Latest first' },
  { value: 'title', label: 'A → Z' },
  { value: 'added', label: 'Recently added' },
];

const VIEW_OPTIONS = [
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'released', label: 'Released' },
];

export default function FilterBar({ filter, setFilter, sort, setSort, view, setView }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {VIEW_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setView(opt.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              view === opt.value
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setFilter(cat.value)}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                filter === cat.value
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        <div className="ml-auto">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 focus:outline-none"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
