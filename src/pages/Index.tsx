import PomodoroTimer from '@/components/PomodoroTimer';
import TaskPlanner from '@/components/TaskPlanner';
import ProcrastinationTest from '@/components/ProcrastinationTest';
import InfoBlock from '@/components/InfoBlock';

export default function Index() {
  return (
    <div className="min-h-screen" style={{ background: 'hsl(210 30% 97%)' }}>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border/60">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
              style={{ background: 'hsl(var(--primary))' }}
            >
              А
            </div>
            <span className="font-display text-lg font-medium tracking-wide text-foreground">
              Антипрокрастинатор
            </span>
          </div>
          <span className="text-xs text-muted-foreground hidden sm:block">
            Действуй. Сейчас.
          </span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="font-display text-3xl sm:text-4xl font-light text-foreground tracking-wide mb-2">
            Победи прокрастинацию
          </h1>
          <p className="text-muted-foreground text-sm">
            Таймер, планер и тест — всё в одном месте
          </p>
        </div>

        <PomodoroTimer />
        <TaskPlanner />
        <ProcrastinationTest />
        <InfoBlock />
      </main>

      <footer className="border-t border-border/60 bg-white/60 mt-10">
        <div className="max-w-3xl mx-auto px-4 py-6 text-center space-y-1">
          <p className="text-xs text-muted-foreground">
            Проект по борьбе с прокрастинацией
          </p>
          <p className="text-xs text-muted-foreground/70">
            Индивидуальный проект, 10 класс · 2026
          </p>
        </div>
      </footer>
    </div>
  );
}