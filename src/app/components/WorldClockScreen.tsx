import { useState, useEffect } from 'react';
import { Globe, Plus, X } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';

interface WorldClock {
  id: string;
  city: string;
  country: string;
  timezone: string;
  offset: number; // Manual offset in hours
}

// Predefined cities with their timezones
const CITIES = [
  { city: 'New York', country: 'USA', timezone: 'America/New_York' },
  { city: 'Los Angeles', country: 'USA', timezone: 'America/Los_Angeles' },
  { city: 'London', country: 'UK', timezone: 'Europe/London' },
  { city: 'Paris', country: 'France', timezone: 'Europe/Paris' },
  { city: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo' },
  { city: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney' },
  { city: 'Dubai', country: 'UAE', timezone: 'Asia/Dubai' },
  { city: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore' },
  { city: 'Hong Kong', country: 'China', timezone: 'Asia/Hong_Kong' },
  { city: 'Mumbai', country: 'India', timezone: 'Asia/Kolkata' },
  { city: 'São Paulo', country: 'Brazil', timezone: 'America/Sao_Paulo' },
  { city: 'Mexico City', country: 'Mexico', timezone: 'America/Mexico_City' },
  { city: 'Toronto', country: 'Canada', timezone: 'America/Toronto' },
  { city: 'Berlin', country: 'Germany', timezone: 'Europe/Berlin' },
  { city: 'Moscow', country: 'Russia', timezone: 'Europe/Moscow' },
  { city: 'Istanbul', country: 'Turkey', timezone: 'Europe/Istanbul' },
  { city: 'Seoul', country: 'South Korea', timezone: 'Asia/Seoul' },
  { city: 'Bangkok', country: 'Thailand', timezone: 'Asia/Bangkok' },
  { city: 'Cairo', country: 'Egypt', timezone: 'Africa/Cairo' },
  { city: 'Johannesburg', country: 'South Africa', timezone: 'Africa/Johannesburg' },
];

export function WorldClockScreen() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [worldClocks, setWorldClocks] = useState<WorldClock[]>([
    { id: '1', city: 'New York', country: 'USA', timezone: 'America/New_York', offset: 0 },
    { id: '2', city: 'London', country: 'UK', timezone: 'Europe/London', offset: 0 },
    { id: '3', city: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo', offset: 0 },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const addClock = (city: string, country: string, timezone: string) => {
    const newClock: WorldClock = {
      id: Date.now().toString(),
      city,
      country,
      timezone,
      offset: 0,
    };
    setWorldClocks([...worldClocks, newClock]);
    setIsDialogOpen(false);
  };

  const removeClock = (id: string) => {
    setWorldClocks(worldClocks.filter(clock => clock.id !== id));
  };

  const adjustOffset = (id: string, delta: number) => {
    setWorldClocks(worldClocks.map(clock => 
      clock.id === id ? { ...clock, offset: clock.offset + delta } : clock
    ));
  };

  const getTimeForTimezone = (timezone: string, offset: number) => {
    const time = new Date(currentTime);
    const formatted = time.toLocaleTimeString('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    if (offset !== 0) {
      const [hours, minutes] = formatted.split(':').map(Number);
      const adjustedHours = (hours + offset + 24) % 24;
      return `${adjustedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }

    return formatted;
  };

  const getTimeDifference = (timezone: string) => {
    const localDate = new Date();
    const targetDate = new Date(localDate.toLocaleString('en-US', { timeZone: timezone }));
    const diff = (targetDate.getTime() - localDate.getTime()) / (1000 * 60 * 60);
    const sign = diff >= 0 ? '+' : '';
    return `${sign}${Math.round(diff)}h`;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Globe className="w-6 h-6 text-blue-400" />
          <h2 className="text-xl">World Clock</h2>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="rounded-full bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-zinc-800 max-w-sm">
            <DialogHeader>
              <DialogTitle>Add City</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-96">
              <div className="space-y-1">
                {CITIES.map((cityData, index) => (
                  <button
                    key={index}
                    onClick={() => addClock(cityData.city, cityData.country, cityData.timezone)}
                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-zinc-800 transition-colors"
                  >
                    <div className="font-medium">{cityData.city}</div>
                    <div className="text-sm opacity-60">{cityData.country}</div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-3 pb-4">
          {worldClocks.map((clock) => (
            <div
              key={clock.id}
              className="bg-zinc-900/50 rounded-2xl p-5 border border-zinc-800/50"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-medium mb-1">{clock.city}</h3>
                  <p className="text-sm opacity-60">{clock.country}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeClock(clock.id)}
                  className="opacity-60 hover:opacity-100"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-end justify-between">
                <div className="text-4xl font-light tracking-tight">
                  {getTimeForTimezone(clock.timezone, clock.offset)}
                </div>
                <div className="text-sm opacity-50">
                  {getTimeDifference(clock.timezone)}
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <span className="text-xs opacity-60">Manual adjust:</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => adjustOffset(clock.id, -1)}
                  className="h-7 px-3 bg-zinc-800 border-zinc-700"
                >
                  -1h
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => adjustOffset(clock.id, 1)}
                  className="h-7 px-3 bg-zinc-800 border-zinc-700"
                >
                  +1h
                </Button>
                {clock.offset !== 0 && (
                  <span className="text-xs text-blue-400">({clock.offset > 0 ? '+' : ''}{clock.offset}h)</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
