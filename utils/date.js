export function formatDate(date) {
  if (!date) return "-";
  const d = new Date(date);
  return d.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

export function formatNumber(num) {
  if (num === null || num === undefined) return "0";
  return Number(num).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}