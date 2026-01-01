import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Timer as TimerIcon } from 'lucide-react';
import { Button } from './ui/button';

export function TimerScreen() {
  const [duration, setDuration] = useState(0); // in seconds
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            // Play completion sound/notification here
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleStart = () => {
    if (isEditing && duration > 0) {
      setTimeLeft(duration);
      setIsEditing(false);
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(0);
    setDuration(0);
    setIsEditing(true);
  };

  const adjustTime = (field: 'hours' | 'minutes' | 'seconds', value: number) => {
    let newDuration = duration;
    
    if (field === 'hours') {
      const currentHours = Math.floor(duration / 3600);
      newDuration = duration - (currentHours * 3600) + (value * 3600);
    } else if (field === 'minutes') {
      const currentMinutes = Math.floor((duration % 3600) / 60);
      newDuration = duration - (currentMinutes * 60) + (value * 60);
    } else {
      const currentSeconds = duration % 60;
      newDuration = duration - currentSeconds + value;
    }

    setDuration(Math.max(0, Math.min(359999, newDuration))); // Max 99:59:59
  };

  const displayTime = isEditing ? duration : timeLeft;
  const hours = Math.floor(displayTime / 3600);
  const minutes = Math.floor((displayTime % 3600) / 60);
  const seconds = displayTime % 60;

  const progress = duration > 0 ? (timeLeft / duration) * 100 : 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6">
      <div className="flex items-center gap-3 mb-12 opacity-60">
        <TimerIcon className="w-6 h-6" />
        <span className="text-sm">Timer</span>
      </div>

      {/* Circular Progress */}
      <div className="relative mb-12">
        <svg className="w-64 h-64 transform -rotate-90">
          <circle
            cx="128"
            cy="128"
            r="120"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-zinc-800"
          />
          <circle
            cx="128"
            cy="128"
            r="120"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-blue-500 transition-all duration-1000"
            strokeDasharray={2 * Math.PI * 120}
            strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
            strokeLinecap="round"
          />
        </svg>

        {/* Time Display */}
        <div className="absolute inset-0 flex items-center justify-center">
          {isEditing ? (
            <div className="flex items-center gap-1">
              <div className="flex flex-col items-center">
                <button
                  onClick={() => adjustTime('hours', hours + 1)}
                  className="w-12 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-800 transition-colors"
                >
                  <span className="text-xl opacity-40">▲</span>
                </button>
                <div className="text-5xl font-light w-20 text-center">
                  {hours.toString().padStart(2, '0')}
                </div>
                <button
                  onClick={() => adjustTime('hours', Math.max(0, hours - 1))}
                  className="w-12 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-800 transition-colors"
                >
                  <span className="text-xl opacity-40">▼</span>
                </button>
              </div>

              <span className="text-5xl font-light opacity-50 mb-8">:</span>

              <div className="flex flex-col items-center">
                <button
                  onClick={() => adjustTime('minutes', (minutes + 1) % 60)}
                  className="w-12 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-800 transition-colors"
                >
                  <span className="text-xl opacity-40">▲</span>
                </button>
                <div className="text-5xl font-light w-20 text-center">
                  {minutes.toString().padStart(2, '0')}
                </div>
                <button
                  onClick={() => adjustTime('minutes', Math.max(0, minutes - 1))}
                  className="w-12 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-800 transition-colors"
                >
                  <span className="text-xl opacity-40">▼</span>
                </button>
              </div>

              <span className="text-5xl font-light opacity-50 mb-8">:</span>

              <div className="flex flex-col items-center">
                <button
                  onClick={() => adjustTime('seconds', (seconds + 1) % 60)}
                  className="w-12 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-800 transition-colors"
                >
                  <span className="text-xl opacity-40">▲</span>
                </button>
                <div className="text-5xl font-light w-20 text-center">
                  {seconds.toString().padStart(2, '0')}
                </div>
                <button
                  onClick={() => adjustTime('seconds', Math.max(0, seconds - 1))}
                  className="w-12 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-800 transition-colors"
                >
                  <span className="text-xl opacity-40">▼</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-6xl font-light tracking-tight">
              {hours > 0 && `${hours.toString().padStart(2, '0')}:`}
              {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {!isRunning ? (
          <Button
            size="lg"
            onClick={handleStart}
            disabled={duration === 0 && isEditing}
            className="w-20 h-20 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-30"
          >
            <Play className="w-8 h-8" fill="currentColor" />
          </Button>
        ) : (
          <Button
            size="lg"
            onClick={handlePause}
            className="w-20 h-20 rounded-full bg-purple-600 hover:bg-purple-700"
          >
            <Pause className="w-8 h-8" fill="currentColor" />
          </Button>
        )}

        <Button
          size="lg"
          onClick={handleReset}
          variant="outline"
          className="w-20 h-20 rounded-full border-zinc-700 hover:bg-zinc-800"
        >
          <RotateCcw className="w-6 h-6" />
        </Button>
      </div>

      {/* Quick presets */}
      {isEditing && duration === 0 && (
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDuration(60)}
            className="rounded-full border-zinc-700"
          >
            1 min
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDuration(300)}
            className="rounded-full border-zinc-700"
          >
            5 min
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDuration(600)}
            className="rounded-full border-zinc-700"
          >
            10 min
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDuration(1800)}
            className="rounded-full border-zinc-700"
          >
            30 min
          </Button>
        </div>
      )}
    </div>
  );
}
