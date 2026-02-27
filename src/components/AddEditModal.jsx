import { useState, useEffect } from 'react';
import { search } from '../utils/searchApi';
import { formatDate } from '../utils/dateUtils';

const CATEGORIES = [
  { value: 'game', label: 'Game', icon: '🎮' },
  { value: 'book', label: 'Book', icon: '📚' },
  { value: 'movie', label: 'Movie', icon: '🎬' },
  { value: 'show', label: 'TV Show', icon: '📺' },
  { value: 'music', label: 'Music', icon: '🎵' },
  { value: 'other', label: 'Other', icon: '📦' },
];

export default function AddEditModal({ isOpen, onClose, onSave, editItem }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('book');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  const [editForm, setEditForm] = useState({
    title: '', series: '', category: 'game', releaseDate: '', notes: '',
  });

  useEffect(() => {
    if (editItem) {
      setEditForm({
        title: editItem.title || '',
        series: editItem.series || '',
        category: editItem.category || 'game',
        releaseDate: editItem.releaseDate || '',
        notes: editItem.notes || '',
      });
    } else {
      setSearchQuery('');
      setResults([]);
      setSearchError('');
    }
  }, [editItem, isOpen]);

  if (!isOpen) return null;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    setSearchError('');
    try {
      const items = await search(searchQuery.trim(), searchCategory);
      setResults(items);
      if (items.length === 0) setSearchError('No results found. Try a different search.');
    } catch {
      setSearchError('Search failed. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  const handlePickResult = (result) => {
    onSave({
      title: result.title,
      series: result.series,
      category: result.category,
      releaseDate: result.releaseDate,
      notes: result.notes,
      thumbnail: result.thumbnail || '',
    });
    onClose();
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editForm.title.trim()) return;
    onSave({
      ...editForm,
      title: editForm.title.trim(),
      series: editForm.series.trim(),
      notes: editForm.notes.trim(),
    });
    onClose();
  };

  const updateEdit = (field, value) => setEditForm((f) => ({ ...f, [field]: value }));

  if (editItem) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
          <h2 className="mb-5 text-lg font-semibold text-gray-900">Edit Release</h2>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => updateEdit('title', e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
                autoFocus
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
              <div className="grid grid-cols-3 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => updateEdit('category', cat.value)}
                    className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm transition-colors ${
                      editForm.category === cat.value
                        ? 'border-indigo-300 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                value={editForm.notes}
                onChange={(e) => updateEdit('notes', e.target.value)}
                placeholder="Any extra details..."
                rows={2}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none resize-none"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="mb-5 text-lg font-semibold text-gray-900">Track a New Release</h2>

        <form onSubmit={handleSearch} className="mb-4">
          <div className="mb-3 flex gap-2">
            {[
              { value: 'book', label: 'Books', icon: '📚' },
              { value: 'game', label: 'Games', icon: '🎮' },
            ].map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setSearchCategory(cat.value)}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                  searchCategory === cat.value
                    ? 'border-indigo-300 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a title..."
              className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
              autoFocus
            />
            <button
              type="submit"
              disabled={searching}
              className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {searching ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {searchError && (
          <p className="mb-3 text-sm text-gray-500 text-center">{searchError}</p>
        )}

        {results.length > 0 && (
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {results.map((result, i) => (
              <button
                key={i}
                onClick={() => handlePickResult(result)}
                className="flex w-full items-start gap-3 rounded-xl border border-gray-200 p-3 text-left transition-colors hover:border-indigo-200 hover:bg-indigo-50/50"
              >
                {result.thumbnail ? (
                  <img
                    src={result.thumbnail}
                    alt=""
                    className="h-16 w-11 rounded-md object-cover bg-gray-100 flex-shrink-0"
                  />
                ) : (
                  <div className="flex h-16 w-11 items-center justify-center rounded-md bg-gray-100 text-lg flex-shrink-0">
                    {searchCategory === 'game' ? '🎮' : '📚'}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 line-clamp-2">{result.title}</p>
                  {result.notes && (
                    <p className="mt-0.5 text-xs text-gray-500">{result.notes}</p>
                  )}
                  <p className="mt-0.5 text-xs text-gray-400">
                    {result.releaseDate ? formatDate(result.releaseDate) : 'Release date TBA'}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="mt-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
