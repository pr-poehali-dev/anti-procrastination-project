import { useState } from 'react';
import Icon from '@/components/ui/icon';

const questions = [
  {
    text: 'Как часто вы откладываете важные дела на потом?',
    options: ['Почти никогда', 'Иногда', 'Довольно часто', 'Почти всегда'],
  },
  {
    text: 'Когда вы начинаете сложное задание?',
    options: ['Сразу, как получил', 'За несколько дней до дедлайна', 'За день до', 'В последний момент'],
  },
  {
    text: 'Как вы себя чувствуете перед началом трудной задачи?',
    options: ['Готов и сосредоточен', 'Немного тревожно', 'Сильное нежелание начинать', 'Паника, избегаю до последнего'],
  },
  {
    text: 'Что происходит, когда задача кажется скучной?',
    options: ['Выполняю всё равно', 'Делаю с перерывами', 'Постоянно отвлекаюсь', 'Не делаю вообще'],
  },
  {
    text: 'Как часто незавершённые дела мешают вам отдыхать?',
    options: ['Никогда — я всё выполняю', 'Редко', 'Часто', 'Постоянно — дел всегда много'],
  },
];

type ResultLevel = 'low' | 'medium' | 'high';

const results: Record<ResultLevel, { label: string; color: string; bg: string; icon: string; desc: string }> = {
  low: {
    label: 'Низкий уровень',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50 border-emerald-100',
    icon: 'ThumbsUp',
    desc: 'Отлично! Вы умеете управлять своим временем. Главное — сохранять эту привычку.',
  },
  medium: {
    label: 'Средний уровень',
    color: 'text-amber-600',
    bg: 'bg-amber-50 border-amber-100',
    icon: 'AlertCircle',
    desc: 'Прокрастинация присутствует, но в разумных пределах. Таймер Помодоро и планер помогут наладить рутину.',
  },
  high: {
    label: 'Высокий уровень',
    color: 'text-rose-600',
    bg: 'bg-rose-50 border-rose-100',
    icon: 'Flame',
    desc: 'Прокрастинация серьёзно мешает. Начните с малого: 1 задача + 1 помодоро в день. Постепенно станет лучше.',
  },
};

function getLevel(score: number): ResultLevel {
  if (score <= 8) return 'low';
  if (score <= 14) return 'medium';
  return 'high';
}

export default function ProcrastinationTest() {
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(-1));
  const [submitted, setSubmitted] = useState(false);

  const handleAnswer = (qIdx: number, aIdx: number) => {
    if (submitted) return;
    setAnswers(prev => {
      const next = [...prev];
      next[qIdx] = aIdx;
      return next;
    });
  };

  const handleSubmit = () => {
    if (answers.some(a => a === -1)) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setAnswers(Array(questions.length).fill(-1));
    setSubmitted(false);
  };

  const score = answers.reduce((sum, a) => sum + (a >= 0 ? a + 1 : 0), 0);
  const level = getLevel(score);
  const result = results[level];
  const allAnswered = answers.every(a => a !== -1);

  return (
    <div className="section-card p-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon name="ClipboardCheck" size={18} className="text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Тест на прокрастинацию</h2>
      </div>

      {!submitted ? (
        <>
          <div className="space-y-6 mb-6">
            {questions.map((q, qi) => (
              <div key={qi} className="animate-fade-in" style={{ animationDelay: `${0.05 * qi}s` }}>
                <p className="text-sm font-medium text-foreground mb-3">
                  <span className="text-primary font-semibold">{qi + 1}. </span>
                  {q.text}
                </p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {q.options.map((opt, oi) => (
                    <button
                      key={oi}
                      onClick={() => handleAnswer(qi, oi)}
                      className={`px-4 py-2.5 rounded-xl text-sm text-left transition-all border ${
                        answers[qi] === oi
                          ? 'border-primary bg-primary/10 text-primary font-medium'
                          : 'border-border bg-muted/30 text-foreground hover:border-primary/30 hover:bg-primary/5'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button
            className={`btn-primary w-full flex items-center justify-center gap-2 ${!allAnswered ? 'opacity-40 cursor-not-allowed' : ''}`}
            onClick={handleSubmit}
            disabled={!allAnswered}
          >
            <Icon name="BarChart3" size={15} />
            Узнать результат
          </button>

          {!allAnswered && (
            <p className="text-center text-xs text-muted-foreground mt-2">
              Ответьте на все вопросы
            </p>
          )}
        </>
      ) : (
        <div className={`p-5 rounded-xl border animate-scale-in ${result.bg}`}>
          <div className="flex items-center gap-3 mb-3">
            <Icon name={result.icon as 'ThumbsUp'} size={24} className={result.color} />
            <div>
              <div className={`font-semibold text-lg ${result.color}`}>{result.label}</div>
              <div className="text-xs text-muted-foreground">Счёт: {score} из 20</div>
            </div>
          </div>
          <p className="text-sm text-foreground leading-relaxed mb-4">{result.desc}</p>
          <button className="btn-ghost text-sm flex items-center gap-2" onClick={handleReset}>
            <Icon name="RefreshCw" size={14} />
            Пройти заново
          </button>
        </div>
      )}
    </div>
  );
}
