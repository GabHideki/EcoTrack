export const CATEGORIES = [
  'reciclagem',
  'descarte',
  'agua',
  'energia',
  'mobilidade',
  'consumo',
];

function toLocalISODate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isValidLocalDate(dateStr) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;

  const [year, month, day] = dateStr.split('-').map(Number);
  const parsed = new Date(year, month - 1, day);

  return (
    parsed.getFullYear() === year &&
    parsed.getMonth() === month - 1 &&
    parsed.getDate() === day
  );
}

export function validateAction(input) {
  const description = String(input?.description ?? '').trim();
  const category = String(input?.category ?? '');
  const date = String(input?.date ?? '');

  if (description.length < 5) {
    return { ok: false, error: 'A descrição deve ter pelo menos 5 caracteres.' };
  }
  if (description.length > 100) {
    return { ok: false, error: 'A descrição deve ter no máximo 100 caracteres.' };
  }
  if (!CATEGORIES.includes(category)) {
    return { ok: false, error: 'Selecione uma categoria válida.' };
  }
  if (!isValidLocalDate(date)) {
    return { ok: false, error: 'Informe uma data válida.' };
  }
  if (date > toLocalISODate()) {
    return { ok: false, error: 'A data não pode estar no futuro.' };
  }

  return { ok: true, value: { description, category, date } };
}

export function addAction(
  actions,
  input,
  id = globalThis.crypto?.randomUUID?.() ?? String(Date.now())
) {
  const checked = validateAction(input);
  if (!checked.ok) return checked;

  const next = [
    { id, ...checked.value, createdAt: new Date().toISOString() },
    ...actions,
  ];

  next.sort(
    (a, b) =>
      b.date.localeCompare(a.date) ||
      String(b.createdAt ?? '').localeCompare(String(a.createdAt ?? ''))
  );

  return { ok: true, actions: next };
}

export function filterActions(actions, category) {
  return category === 'todas'
    ? actions
    : actions.filter((a) => a.category === category);
}

export function countByCategory(actions) {
  return actions.reduce((counts, a) => {
    counts[a.category] = (counts[a.category] || 0) + 1;
    return counts;
  }, {});
}