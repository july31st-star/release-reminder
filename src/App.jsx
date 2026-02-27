import { useState, useMemo } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { getDaysUntil } from './utils/dateUtils';
import ReleaseCard from './components/ReleaseCard';
import AddEditModal from './components/AddEditModal';
import FilterBar from './components/FilterBar';
import EmptyState from './components/EmptyState';

function App() {
  const [items, setItems] = useLocalStorage('release-reminder-items-v2', []);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('date-asc');
  const [view, setView] = useState('upcoming');

  const handleSave = (formData) => {
    if (editItem) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === editItem.id ? { ...item, ...formData } : item
        )
      );
    } else {
      const newItem = {
        ...formData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      setItems((prev) => [newItem, ...prev]);
    }
    setEditItem(null);
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const filteredItems = useMemo(() => {
    let result = items;

    if (filter !== 'all') {
      result = result.filter((item) => item.category === filter);
    }

    result = result.filter((item) => {
      const days = getDaysUntil(item.releaseDate);
      switch (view) {
        case 'upcoming':
          return days === null || days > 0;
        case 'released':
          return days !== null && days <= 0;
        default:
          return true;
      }
    });

    result.sort((a, b) => {
      switch (sort) {
        case 'date-asc': {
          if (!a.releaseDate && !b.releaseDate) return 0;
          if (!a.releaseDate) return 1;
          if (!b.releaseDate) return -1;
          return a.releaseDate.localeCompare(b.releaseDate);
        }
        case 'date-desc': {
          if (!a.releaseDate && !b.releaseDate) return 0;
          if (!a.releaseDate) return 1;
          if (!b.releaseDate) return -1;
          return b.releaseDate.localeCompare(a.releaseDate);
        }
        case 'title':
          return a.title.localeCompare(b.title);
        case 'added':
          return (b.createdAt || '').localeCompare(a.createdAt || '');
        default:
          return 0;
      }
    });

    return result;
  }, [items, filter, sort, view]);

  const counts = useMemo(() => {
    let upcoming = 0, released = 0;
    for (const item of items) {
      const days = getDaysUntil(item.releaseDate);
      if (days === null || days > 0) upcoming++;
      else released++;
    }
    return { upcoming, released, total: items.length };
  }, [items]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Release Reminder</h1>
            <p className="text-sm text-gray-500">
              Tracking {counts.total} item{counts.total !== 1 ? 's' : ''} · {counts.upcoming} upcoming
            </p>
          </div>
          <button
            onClick={() => {
              setEditItem(null);
              setModalOpen(true);
            }}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Release
          </button>
        </header>

        <FilterBar
          filter={filter}
          setFilter={setFilter}
          sort={sort}
          setSort={setSort}
          view={view}
          setView={setView}
        />

        <div className="mt-6">
          {filteredItems.length === 0 ? (
            <EmptyState view={view} />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {filteredItems.map((item) => (
                <ReleaseCard
                  key={item.id}
                  item={item}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <AddEditModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditItem(null);
        }}
        onSave={handleSave}
        editItem={editItem}
      />
    </div>
  );
}

export default App;
