export function formatISTTime(): string {
  const now = new Date().toLocaleString('en-US', {
    hour12: false,
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return now.replace(/:/g, '_'); // Converts "14:30:05" to "14_30_05"
}
