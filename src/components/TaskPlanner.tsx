import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface Task {
  id: number;
  text: string;
  done: boolean;
}

interface SuggestionResult {
  steps: string[];
}

function suggestSteps(text: string): SuggestionResult {
  const lower = text.toLowerCase();

  if (/презентаци|доклад|выступлени/.test(lower)) {
    return { steps: ['Собрать материалы по теме', 'Составить структуру', 'Написать текст', 'Подобрать иллюстрации и слайды', 'Отрепетировать выступление'] };
  }
  if (/экзамен|зачёт|зачет|тест/.test(lower)) {
    return { steps: ['Составить список тем для повторения', 'Распределить темы по дням', 'Повторять по 30 минут ежедневно', 'Решить пробные варианты'] };
  }
  if (/сочинени|эссе|стать/.test(lower)) {
    return { steps: ['Определить главную мысль', 'Составить план', 'Написать черновик', 'Отредактировать', 'Проверить ошибки'] };
  }
  if (/уборк|убрать|прибрать/.test(lower)) {
    return { steps: ['Убрать вещи на свои места', 'Протереть пыль', 'Пропылесосить', 'Вымыть пол'] };
  }
  if (/проект|исследовани/.test(lower)) {
    return { steps: ['Сформулировать цель и задачи', 'Найти источники информации', 'Собрать материал', 'Написать текст', 'Оформить по требованиям'] };
  }
  return { steps: ['Подготовить всё необходимое', 'Разбить задачу на 3–4 части', 'Выполнить первую часть', 'Выполнить вторую часть', 'Проверить результат'] };
}

export default function TaskPlanner() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState('');
  const [suggestion, setSuggestion] = useState<SuggestionResult | null>(null);
  const [suggestionSource, setSuggestionSource] = useState('');
  let nextId = tasks.length + 1;

  const addTask = () => {
    if (!input.trim()) return;
    setTasks(prev => [...prev, { id: nextId++, text: input.trim(), done: false }]);
    setInput('');
    setSuggestion(null);
  };

  const handleSuggest = () => {
    if (!input.trim()) return;
    const result = suggestSteps(input);
    setSuggestion(result);
    setSuggestionSource(input.trim());
  };

  const addAllSteps = () => {
    if (!suggestion) return;
    const newTasks = suggestion.steps.map((step, i) => ({
      id: Date.now() + i,
      text: step,
      done: false,
    }));
    setTasks(prev => [...prev, ...newTasks]);
    setSuggestion(null);
    setInput('');
  };

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const deleteTask = (id: number) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') addTask();
  };

  return (
    <div className="section-card p-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon name="ListTodo" size={18} className="text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Планер задач</h2>
        {tasks.length > 0 && (
          <span className="ml-auto text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
            {tasks.filter(t => t.done).length}/{tasks.length}
          </span>
        )}
      </div>

      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Введите задачу..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-muted/40 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all placeholder:text-muted-foreground"
        />
      </div>

      <div className="flex gap-2 mb-5">
        <button className="btn-primary flex-1 flex items-center justify-center gap-2" onClick={addTask}>
          <Icon name="Plus" size={15} />
          Добавить
        </button>
        <button className="btn-ghost flex-1 flex items-center justify-center gap-2" onClick={handleSuggest}>
          <Icon name="Sparkles" size={15} />
          Предложить решение
        </button>
      </div>

      {suggestion && (
        <div className="mb-5 p-4 bg-primary/5 border border-primary/15 rounded-xl animate-scale-in">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="Lightbulb" size={16} className="text-primary" />
            <span className="text-sm font-medium text-foreground">Шаги для: «{suggestionSource}»</span>
          </div>
          <ol className="space-y-1.5 mb-4">
            {suggestion.steps.map((step, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-foreground">
                <span className="w-5 h-5 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
          <button
            className="btn-primary w-full flex items-center justify-center gap-2 text-sm"
            onClick={addAllSteps}
          >
            <Icon name="CopyPlus" size={14} />
            Добавить все шаги в список
          </button>
        </div>
      )}

      {tasks.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground text-sm">
          <Icon name="ClipboardList" size={32} className="mx-auto mb-2 opacity-30" />
          Список задач пуст
        </div>
      ) : (
        <ul className="space-y-2">
          {tasks.map(task => (
            <li
              key={task.id}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/40 transition-colors group"
            >
              <button
                onClick={() => toggleTask(task.id)}
                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  task.done
                    ? 'bg-primary border-primary text-white'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                {task.done && <Icon name="Check" size={12} />}
              </button>
              <span className={`flex-1 text-sm ${task.done ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                {task.text}
              </span>
              <button
                onClick={() => deleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
              >
                <Icon name="X" size={13} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
