export default function EmptyState({ view }) {
  const messages = {
    upcoming: {
      emoji: '🎯',
      title: 'No upcoming releases',
      subtitle: 'Start tracking releases you\'re excited about!',
    },
    released: {
      emoji: '📭',
      title: 'Nothing released yet',
      subtitle: 'Your tracked items haven\'t released yet.',
    },
  };

  const msg = messages[view] || messages.upcoming;

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 py-16 text-center">
      <span className="mb-3 text-4xl">{msg.emoji}</span>
      <h3 className="mb-1 font-semibold text-gray-700">{msg.title}</h3>
      <p className="text-sm text-gray-400">{msg.subtitle}</p>
    </div>
  );
}
