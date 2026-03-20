import Icon from '@/components/ui/icon';

const causes = [
  'Страх неудачи или критики',
  'Перфекционизм — ожидание идеальных условий',
  'Недооценка времени, необходимого для задачи',
  'Низкая самодисциплина и слабая мотивация',
  'Тревожность и эмоциональный дискомфорт',
  'Усталость и недостаток энергии',
];

const methods = [
  { icon: 'Timer', title: 'Метод Помодоро', desc: '25 минут работы — 5 минут отдыха. Повторяйте циклы.' },
  { icon: 'Scissors', title: 'Разбейте задачу', desc: 'Разделите большую задачу на маленькие шаги по 15–30 минут.' },
  { icon: 'Target', title: 'Правило 2 минут', desc: 'Если дело займёт меньше 2 минут — сделайте прямо сейчас.' },
  { icon: 'Zap', title: 'Начните с малого', desc: 'Просто откройте документ или включите компьютер. Начало — самое трудное.' },
  { icon: 'Trophy', title: 'Система наград', desc: 'Отмечайте выполненные задачи и поощряйте себя за прогресс.' },
  { icon: 'BrainCircuit', title: 'Осознанность', desc: 'Замечайте моменты избегания и возвращайте внимание к задаче.' },
];

export default function InfoBlock() {
  return (
    <div className="space-y-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
      <div className="section-card p-8">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon name="BookOpen" size={18} className="text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Что такое прокрастинация?</h2>
        </div>
        <p className="text-sm text-foreground leading-relaxed">
          <strong>Прокрастинация</strong> — это склонность откладывать важные дела на потом, заменяя их
          менее значимыми или приятными занятиями. Это не лень: человек часто занят,
          но не тем, что действительно нужно сделать. Прокрастинация порождает стресс,
          чувство вины и снижает качество результата.
        </p>
      </div>

      <div className="section-card p-8">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center">
            <Icon name="HelpCircle" size={18} className="text-amber-500" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Основные причины</h2>
        </div>
        <ul className="space-y-2.5">
          {causes.map((cause, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2" />
              {cause}
            </li>
          ))}
        </ul>
      </div>

      <div className="section-card p-8">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
            <Icon name="Lightbulb" size={18} className="text-emerald-600" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Методы борьбы</h2>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {methods.map((m, i) => (
            <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-muted/40 border border-border/60">
              <div className="w-8 h-8 rounded-lg bg-white border border-border flex items-center justify-center flex-shrink-0">
                <Icon name={m.icon as 'Timer'} size={15} className="text-primary" />
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground mb-0.5">{m.title}</div>
                <div className="text-xs text-muted-foreground leading-relaxed">{m.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
