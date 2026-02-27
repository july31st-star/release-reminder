export function getDaysUntil(dateString) {
  if (!dateString) return null;
  const target = new Date(dateString + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = target - today;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function formatDate(dateString) {
  if (!dateString) return 'TBA';
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getCountdownLabel(days) {
  if (days === null) return 'Date TBA';
  if (days < 0) return `Released ${Math.abs(days)} day${Math.abs(days) !== 1 ? 's' : ''} ago`;
  if (days === 0) return 'Releasing today!';
  if (days === 1) return 'Releasing tomorrow!';
  if (days <= 7) return `${days} days away`;
  if (days <= 30) {
    const weeks = Math.floor(days / 7);
    return `${weeks} week${weeks !== 1 ? 's' : ''} away`;
  }
  if (days <= 365) {
    const months = Math.floor(days / 30);
    return `${months} month${months !== 1 ? 's' : ''} away`;
  }
  const years = Math.floor(days / 365);
  const remainingMonths = Math.floor((days % 365) / 30);
  if (remainingMonths > 0) {
    return `${years}y ${remainingMonths}mo away`;
  }
  return `${years} year${years !== 1 ? 's' : ''} away`;
}
