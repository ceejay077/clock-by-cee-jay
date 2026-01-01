import { useEffect, useState } from 'react';
import { Clock as ClockIcon } from 'lucide-react';

export function ClockScreen() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [apiTime, setApiTime] = useState<Date | null>(null);
  const [timezone, setTimezone] = useState('');

  // Update local time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch time from WorldTimeAPI on mount
  useEffect(() => {
    fetch('https://worldtimeapi.org/api/ip')
      .then(res => res.json())
      .then(data => {
        setApiTime(new Date(data.datetime));
        setTimezone(data.timezone);
      })
      .catch(() => {
        // If API fails, use local time
        setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
      });
  }, []);

  const displayTime = apiTime || currentTime;
  const hours = displayTime.getHours().toString().padStart(2, '0');
  const minutes = displayTime.getMinutes().toString().padStart(2, '0');
  const seconds = displayTime.getSeconds().toString().padStart(2, '0');

  const dateOptions: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  const dateString = displayTime.toLocaleDateString(undefined, dateOptions);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6">
      <div className="flex items-center gap-3 mb-8 opacity-60">
        <ClockIcon className="w-6 h-6" />
        <span className="text-sm">{timezone || 'Loading timezone...'}</span>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className="text-8xl font-light tracking-tight">{hours}</span>
        <span className="text-8xl font-light opacity-50 animate-pulse">:</span>
        <span className="text-8xl font-light tracking-tight">{minutes}</span>
      </div>

      <div className="text-4xl font-light opacity-40 mb-12">
        {seconds}
      </div>

      <div className="text-center opacity-60">
        <p className="text-lg">{dateString}</p>
      </div>
    </div>
  );
}
