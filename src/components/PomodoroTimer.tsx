import { useState, useEffect, useRef, useCallback } from 'react';
import Icon from '@/components/ui/icon';

type Phase = 'work' | 'break' | 'longbreak';

const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;
const LONG_BREAK_TIME = 20 * 60;
const CYCLES_BEFORE_LONG = 4;

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

const phaseLabel: Record<Phase, string> = {
  work: 'Работа',
  break: 'Короткий отдых',
  longbreak: 'Длинный отдых',
};

const phaseColor: Record<Phase, string> = {
  work: 'hsl(var(--primary))',
  break: 'hsl(142 60% 48%)',
  longbreak: 'hsl(280 55% 55%)',
};

function getPhaseTime(phase: Phase): number {
  if (phase === 'work') return WORK_TIME;
  if (phase === 'longbreak') return LONG_BREAK_TIME;
  return BREAK_TIME;
}

export default function PomodoroTimer() {
  const [phase, setPhase] = useState<Phase>('work');
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [running, setRunning] = useState(false);
  const [cycles, setCycles] = useState(0);
  const [showLongBreakHint, setShowLongBreakHint] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseRef = useRef<Phase>('work');

  const switchPhase = useCallback((newPhase: Phase) => {
    phaseRef.current = newPhase;
    setPhase(newPhase);
    setTimeLeft(getPhaseTime(newPhase));
    setRunning(true);
    setShowLongBreakHint(false);
    playBeep();
  }, []);

  useEffect(() => {
    if (!running) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (phaseRef.current === 'work') {
            setCycles(c => {
              const newCycles = c + 1;
              if (newCycles % CYCLES_BEFORE_LONG === 0) {
                phaseRef.current = 'longbreak';
                setRunning(false);
                setShowLongBreakHint(true);
                setPhase('longbreak');
                setTimeLeft(LONG_BREAK_TIME);
              } else {
                setTimeout(() => switchPhase('break'), 100);
              }
              return newCycles;
            });
          } else {
            setTimeout(() => switchPhase('work'), 100);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, switchPhase]);

  const handleStart = () => {
    setShowLongBreakHint(false);
    setRunning(true);
  };
  const handlePause = () => setRunning(false);
  const handleReset = () => {
    setRunning(false);
    phaseRef.current = 'work';
    setPhase('work');
    setTimeLeft(WORK_TIME);
    setCycles(0);
    setShowLongBreakHint(false);
  };

  const total = getPhaseTime(phase);
  const progress = ((total - timeLeft) / total) * 100;
  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const color = phaseColor[phase];

  const cyclesDots = Array.from({ length: CYCLES_BEFORE_LONG }, (_, i) => i);

  return (
    <div className="section-card p-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon name="Timer" size={18} className="text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Таймер Помодоро</h2>
        <div className="ml-auto flex items-center gap-1.5">
          {cyclesDots.map(i => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full transition-all duration-300"
              style={{
                background: i < (cycles % CYCLES_BEFORE_LONG) || (cycles > 0 && cycles % CYCLES_BEFORE_LONG === 0 && i < CYCLES_BEFORE_LONG)
                  ? color
                  : 'hsl(var(--muted))',
                transform: i < (cycles % CYCLES_BEFORE_LONG) ? 'scale(1.15)' : 'scale(1)',
              }}
            />
          ))}
          {cycles > 0 && (
            <span className="ml-1.5 text-xs text-muted-foreground">
              {Math.floor(cycles / CYCLES_BEFORE_LONG) > 0 && `×${Math.floor(cycles / CYCLES_BEFORE_LONG) + (cycles % CYCLES_BEFORE_LONG > 0 ? 0 : 0)} `}
              {cycles} цикл{cycles === 1 ? '' : cycles < 5 ? 'а' : 'ов'}
            </span>
          )}
        </div>
      </div>

      {showLongBreakHint && (
        <div className="mb-5 p-4 rounded-xl border animate-scale-in" style={{ background: 'hsl(280 55% 55% / 0.08)', borderColor: 'hsl(280 55% 55% / 0.2)' }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🎉</span>
            <span className="text-sm font-semibold text-foreground">4 цикла завершены!</span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">Вы хорошо поработали. Рекомендуется длинный отдых — 20 минут.</p>
          <div className="flex gap-2">
            <button
              className="flex-1 text-sm py-2 px-3 rounded-lg font-medium text-white transition-all hover:opacity-90"
              style={{ background: 'hsl(280 55% 55%)' }}
              onClick={handleStart}
            >
              Отдохнуть 20 мин
            </button>
            <button
              className="flex-1 text-sm py-2 px-3 rounded-lg font-medium btn-ghost"
              onClick={() => { setShowLongBreakHint(false); switchPhase('work'); }}
            >
              Продолжить работу
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center gap-6">
        <div className="relative w-52 h-52 flex items-center justify-center">
          <svg className="absolute inset-0 -rotate-90" width="208" height="208" viewBox="0 0 208 208">
            <circle cx="104" cy="104" r="90" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
            <circle
              cx="104" cy="104" r="90" fill="none"
              stroke={color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: 'stroke-dashoffset 0.8s ease, stroke 0.5s ease' }}
            />
          </svg>

          <div className="text-center z-10">
            <div className="font-display text-5xl font-light tracking-wide" style={{ color }}>
              {formatTime(timeLeft)}
            </div>
            <div className="text-sm text-muted-foreground mt-1 font-medium">
              {phaseLabel[phase]}
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

        <div className="flex gap-5 text-center text-sm text-muted-foreground">
          <div>
            <div className="font-semibold text-foreground">25 мин</div>
            <div>Работа</div>
          </div>
          <div className="w-px bg-border" />
          <div>
            <div className="font-semibold text-foreground">5 мин</div>
            <div>Отдых</div>
          </div>
          <div className="w-px bg-border" />
          <div>
            <div className="font-semibold text-foreground">20 мин</div>
            <div>После 4 циклов</div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center max-w-xs leading-relaxed border-t border-border pt-4 w-full">
          Метод Помодоро: работай 25 минут без отвлечений, затем сделай короткий перерыв. После 4 таких циклов — длинный отдых.
        </p>
      </div>
    </div>
  );
}