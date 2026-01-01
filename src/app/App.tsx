import { useState } from 'react';
import { Clock, Globe, Timer, Watch } from 'lucide-react';
import { ClockScreen } from './components/ClockScreen';
import { WorldClockScreen } from './components/WorldClockScreen';
import { TimerScreen } from './components/TimerScreen';
import { StopwatchScreen } from './components/StopwatchScreen';

type Screen = 'clock' | 'world-clock' | 'timer' | 'stopwatch';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('clock');

  const navItems = [
    { id: 'clock' as Screen, label: 'Clock', icon: Clock },
    { id: 'world-clock' as Screen, label: 'World', icon: Globe },
    { id: 'timer' as Screen, label: 'Timer', icon: Timer },
    { id: 'stopwatch' as Screen, label: 'Stopwatch', icon: Watch },
  ];

  return (
    <div className="h-screen bg-black text-white flex flex-col max-w-md mx-auto dark">
      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {activeScreen === 'clock' && <ClockScreen />}
        {activeScreen === 'world-clock' && <WorldClockScreen />}
        {activeScreen === 'timer' && <TimerScreen />}
        {activeScreen === 'stopwatch' && <StopwatchScreen />}
      </main>

      {/* Bottom Navigation */}
      <nav className="flex items-center justify-around border-t border-zinc-800 bg-zinc-950/80 backdrop-blur-lg px-2 py-2 safe-area-bottom">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveScreen(item.id)}
              className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all ${
                isActive
                  ? 'text-blue-400'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'scale-110' : ''} transition-transform`} />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}