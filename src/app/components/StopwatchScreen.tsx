import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Flag } from 'lucide-react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

interface Lap {
  id: number;
  time: number;
  difference: number;
}

export function StopwatchScreen() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<Lap[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const accumulatedTimeRef = useRef<number>(0);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - accumulatedTimeRef.current;
      intervalRef.current = setInterval(() => {
        setTime(Date.now() - startTimeRef.current);
      }, 10);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      accumulatedTimeRef.current = time;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
    accumulatedTimeRef.current = 0;
  };

  const handleLap = () => {
    const previousLapTime = laps.length > 0 ? laps[0].time : 0;
    const difference = time - previousLapTime;
    
    setLaps([
      {
        id: laps.length + 1,
        time: time,
        difference: difference,
      },
      ...laps,
    ]);
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10);

    return {
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0'),
      milliseconds: milliseconds.toString().padStart(2, '0'),
    };
  };

  const currentTime = formatTime(time);

  const findFastestLap = () => {
    if (laps.length === 0) return null;
    return laps.reduce((min, lap) => lap.difference < min.difference ? lap : min);
  };

  const findSlowestLap = () => {
    if (laps.length === 0) return null;
    return laps.reduce((max, lap) => lap.difference > max.difference ? lap : max);
  };

  const fastestLap = findFastestLap();
  const slowestLap = findSlowestLap();

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] px-6 py-6">
      {/* Time Display */}
      <div className="flex flex-col items-center justify-center flex-shrink-0 py-12">
        <div className="flex items-baseline gap-1 mb-12">
          <span className="text-7xl font-light tracking-tight">
            {currentTime.minutes}:{currentTime.seconds}
          </span>
          <span className="text-4xl font-light opacity-50">
            .{currentTime.milliseconds}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          {!isRunning ? (
            <>
              <Button
                size="lg"
                onClick={handleStart}
                className="w-20 h-20 rounded-full bg-blue-600 hover:bg-blue-700"
              >
                <Play className="w-8 h-8" fill="currentColor" />
              </Button>
              {time > 0 && (
                <Button
                  size="lg"
                  onClick={handleReset}
                  variant="outline"
                  className="w-20 h-20 rounded-full border-zinc-700 hover:bg-zinc-800"
                >
                  <RotateCcw className="w-6 h-6" />
                </Button>
              )}
            </>
          ) : (
            <>
              <Button
                size="lg"
                onClick={handlePause}
                className="w-20 h-20 rounded-full bg-purple-600 hover:bg-purple-700"
              >
                <Pause className="w-8 h-8" fill="currentColor" />
              </Button>
              <Button
                size="lg"
                onClick={handleLap}
                variant="outline"
                className="w-20 h-20 rounded-full border-zinc-700 hover:bg-zinc-800"
              >
                <Flag className="w-6 h-6" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Laps */}
      {laps.length > 0 && (
        <div className="flex-1 min-h-0">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-sm opacity-60">Laps</span>
            <span className="text-sm opacity-60">{laps.length}</span>
          </div>
          <ScrollArea className="h-full">
            <div className="space-y-2 pb-4">
              {laps.map((lap) => {
                const lapTime = formatTime(lap.difference);
                const isFastest = fastestLap && lap.id === fastestLap.id && laps.length > 1;
                const isSlowest = slowestLap && lap.id === slowestLap.id && laps.length > 1;
                
                return (
                  <div
                    key={lap.id}
                    className={`flex items-center justify-between p-4 rounded-xl border ${
                      isFastest
                        ? 'bg-green-950/30 border-green-800/50'
                        : isSlowest
                        ? 'bg-red-950/30 border-red-800/50'
                        : 'bg-zinc-900/50 border-zinc-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg opacity-60 w-12">
                        {lap.id.toString().padStart(2, '0')}
                      </span>
                      <div>
                        <div className="text-xl font-light">
                          {lapTime.minutes}:{lapTime.seconds}.{lapTime.milliseconds}
                        </div>
                        {(isFastest || isSlowest) && (
                          <div className={`text-xs mt-1 ${isFastest ? 'text-green-400' : 'text-red-400'}`}>
                            {isFastest ? 'Fastest' : 'Slowest'}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-sm opacity-50">
                      {formatTime(lap.time).minutes}:{formatTime(lap.time).seconds}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
