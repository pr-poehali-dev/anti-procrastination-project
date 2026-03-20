import { useState, useEffect, useRef, useCallback } from 'react';
import Icon from '@/components/ui/icon';

type Phase = 'work' | 'break';

const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function playBeep() {
  try {
    const AudioCtx = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 520;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 1.2);
  } catch (e) {
    console.warn('Audio not available', e);
  }
}

export default function PomodoroTimer() {
  const [phase, setPhase] = useState<Phase>('work');
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const switchPhase = useCallback((newPhase: Phase) => {
    setPhase(newPhase);
    setTimeLeft(newPhase === 'work' ? WORK_TIME : BREAK_TIME);
    setRunning(true);
    playBeep();
  }, []);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            if (phase === 'work') {
              setSessions(s => s + 1);
              setTimeout(() => switchPhase('break'), 100);
            } else {
              setTimeout(() => switchPhase('work'), 100);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, phase, switchPhase]);

  const handleStart = () => setRunning(true);
  const handlePause = () => setRunning(false);
  const handleReset = () => {
    setRunning(false);
    setPhase('work');
    setTimeLeft(WORK_TIME);
  };

  const total = phase === 'work' ? WORK_TIME : BREAK_TIME;
  const progress = ((total - timeLeft) / total) * 100;
  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="section-card p-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon name="Timer" size={18} className="text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Таймер Помодоро</h2>
        {sessions > 0 && (
          <span className="ml-auto text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
            Сессий: {sessions}
          </span>
        )}
      </div>

      <div className="flex flex-col items-center gap-6">
        <div className="relative w-52 h-52 flex items-center justify-center">
          <svg className="absolute inset-0 -rotate-90" width="208" height="208" viewBox="0 0 208 208">
            <circle cx="104" cy="104" r="90" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
            <circle
              cx="104" cy="104" r="90" fill="none"
              stroke={phase === 'work' ? 'hsl(var(--primary))' : 'hsl(142 60% 48%)'}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: 'stroke-dashoffset 0.8s ease, stroke 0.5s ease' }}
            />
          </svg>

          <div className="text-center z-10">
            <div
              className="font-display text-5xl font-light tracking-wide"
              style={{ color: phase === 'work' ? 'hsl(var(--primary))' : 'hsl(142 60% 48%)' }}
            >
              {formatTime(timeLeft)}
            </div>
            <div className="text-sm text-muted-foreground mt-1 font-medium">
              {phase === 'work' ? 'Работа' : 'Отдых'}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          {!running ? (
            <button className="btn-primary flex items-center gap-2" onClick={handleStart}>
              <Icon name="Play" size={15} />
              Старт
            </button>
          ) : (
            <button className="btn-secondary flex items-center gap-2" onClick={handlePause}>
              <Icon name="Pause" size={15} />
              Пауза
            </button>
          )}
          <button className="btn-ghost flex items-center gap-2" onClick={handleReset}>
            <Icon name="RotateCcw" size={15} />
            Сброс
          </button>
        </div>

        <div className="flex gap-6 text-center text-sm text-muted-foreground">
          <div>
            <div className="font-semibold text-foreground">25 мин</div>
            <div>Работа</div>
          </div>
          <div className="w-px bg-border" />
          <div>
            <div className="font-semibold text-foreground">5 мин</div>
            <div>Отдых</div>
          </div>
        </div>
      </div>
    </div>
  );
}