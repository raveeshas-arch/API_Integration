import { useState, useEffect } from 'react';

export function DateTime() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="text-right">
      <div className="text-sm font-medium text-gray-900 dark:text-white transition-colors">{formatDate(currentTime)}</div>
      <div className="text-xs text-gray-500 dark:text-gray-400 transition-colors">{formatTime(currentTime)}</div>
    </div>
  );
}