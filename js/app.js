import { addAction, filterActions, countByCategory } from './actions.js';

const KEY = 'ecotrack.actions.v1';

const LABELS = {
  reciclagem: 'Reciclagem',
  descarte: 'Descarte correto',
  agua: 'Economia de água',
  energia: 'Economia de energia',
  mobilidade: 'Mobilidade sustentável',
  consumo: 'Consumo consciente',
};

let actions = load();
let filter = 'todas';

const list = document.querySelector('#action-list');
const empty = document.querySelector('#empty');
const form = document.querySelector('#action-form');

function toLocalISODate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function load() {
  try {
    const value = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(actions));
  } catch {
    // Ignora falha caso o storage esteja bloqueado ou cheio
  }
}

function render() {
  document.querySelector('#total').textContent = actions.length;

  const counts = countByCategory(actions);
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  document.querySelector('#top-category').textContent = top
    ? (LABELS[top[0]] || top[0])
    : '—';

  const today = toLocalISODate();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 6);
  const start = toLocalISODate(cutoff);

  document.querySelector('#recent').textContent = actions.filter(
    (a) => a.date >= start && a.date <= today
  ).length;

  const visible = filterActions(actions, filter);
  document.querySelector('#count-label').textContent =
    `${visible.length} ${visible.length === 1 ? 'registro' : 'registros'}`;

  list.replaceChildren();
  empty.hidden = visible.length > 0;

  for (const a of visible) {
    const row = document.createElement('article');
    row.className = 'task';

    const icon = document.createElement('span');
    icon.className = 'leaf';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = '✳';

    const main = document.createElement('div');
    main.className = 'task-main';

    const title = document.createElement('div');
    title.className = 'task-title';
    title.textContent = a.description;

    const meta = document.createElement('div');
    meta.className = 'task-meta';
    meta.textContent = new Date(`${a.date}T12:00:00`).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    main.append(title, meta);

    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.textContent = LABELS[a.category] || a.category;

    const remove = document.createElement('button');
    remove.className = 'remove';
    remove.type = 'button';
    remove.textContent = '×';
    remove.setAttribute('aria-label', `Excluir registro: ${a.description}`);
    remove.addEventListener('click', () => {
      actions = actions.filter((x) => x.id !== a.id);
      save();
      render();
    });

    row.append(icon, main, badge, remove);
    list.append(row);
  }
}

document.querySelector('#new-action').addEventListener('click', () => {
  form.hidden = !form.hidden;
  if (!form.hidden) {
    document.querySelector('#date').value = toLocalISODate();
    document.querySelector('#description').focus();
  }
});

document.querySelector('#cancel').addEventListener('click', () => {
  form.reset();
  form.hidden = true;
});

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const result = addAction(actions, {
    description: document.querySelector('#description').value,
    category: document.querySelector('#category').value,
    date: document.querySelector('#date').value,
  });

  if (!result.ok) {
    alert(result.error);
    return;
  }

  actions = result.actions;
  save();
  form.reset();
  form.hidden = true;
  filter = 'todas';

  document.querySelectorAll('.filter').forEach((b) => {
    b.classList.toggle('selected', b.dataset.filter === 'todas');
  });

  render();
});

document.querySelector('#filters').addEventListener('click', (event) => {
  const button = event.target.closest('[data-filter]');
  if (!button) return;

  filter = button.dataset.filter;
  document.querySelectorAll('.filter').forEach((b) => {
    b.classList.toggle('selected', b === button);
  });

  render();
});

render();