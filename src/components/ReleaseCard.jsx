import { useState } from 'react';
import { getDaysUntil, formatDate, getCountdownLabel } from '../utils/dateUtils';
import { useCoverImage } from '../hooks/useCoverImage';

const CATEGORY_STYLES = {
  game: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200', icon: '🎮' },
  book: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', icon: '📚' },
  movie: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', icon: '🎬' },
  show: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200', icon: '📺' },
  music: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200', icon: '🎵' },
  other: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200', icon: '📦' },
};

function getUrgencyColor(days) {
  if (days === null) return 'text-gray-400';
  if (days < 0) return 'text-gray-400';
  if (days === 0) return 'text-red-500';
  if (days <= 7) return 'text-orange-500';
  if (days <= 30) return 'text-yellow-600';
  return 'text-emerald-600';
}

function CoverImage({ item, style }) {
  const fetchedSrc = useCoverImage(item);
  const src = item.thumbnail || fetchedSrc;
  const [failed, setFailed] = useState(false);

  if (src && !failed) {
    return (
      <img
        src={src}
        alt=""
        className="h-24 w-16 flex-shrink-0 rounded-lg object-cover bg-gray-100"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div className="flex h-24 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 text-2xl">
      {style.icon}
    </div>
  );
}

export default function ReleaseCard({ item, onEdit, onDelete }) {
  const days = getDaysUntil(item.releaseDate);
  const style = CATEGORY_STYLES[item.category] || CATEGORY_STYLES.other;

  return (
    <div className="group relative flex gap-4 rounded-2xl border bg-white p-4 shadow-sm transition-all hover:shadow-md">
      <CoverImage item={item} style={style} />

      <div className="min-w-0 flex-1">
        <div className="absolute top-3 right-3 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={() => onEdit(item)}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            title="Edit"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
            title="Delete"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        <h3 className="font-semibold text-gray-900 leading-tight pr-14">
          {item.title}
        </h3>
        {item.series && (
          <p className="mt-0.5 text-sm text-gray-500">{item.series}</p>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${style.bg} ${style.text} border ${style.border}`}>
            {item.category}
          </span>
          <span className="text-xs text-gray-400">
            {formatDate(item.releaseDate)}
          </span>
        </div>

        {item.notes && (
          <p className="mt-1.5 text-sm text-gray-500 line-clamp-1">{item.notes}</p>
        )}

        <span className={`mt-1.5 inline-block text-sm font-medium ${getUrgencyColor(days)}`}>
          {getCountdownLabel(days)}
        </span>
      </div>
    </div>
  );
}
