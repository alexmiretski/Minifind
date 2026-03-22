const initialFolders = [
  { id: 'owned', name: 'Owned Collection', createdAt: '2026-03-22T00:00:00.000Z' },
  { id: 'wishlist', name: 'Wishlist', createdAt: '2026-03-22T00:00:00.000Z' },
  { id: 'display', name: 'Display Shelf', createdAt: '2026-03-22T00:00:00.000Z' }
];

const defaultFilters = {
  search: '',
  rarity: 'All',
  theme: 'All',
  year: 'All',
  ownership: 'All',
  sortBy: 'name',
  folderId: 'all'
};

const rarityOrder = {
  Common: 1,
  Uncommon: 2,
  Rare: 3,
  Epic: 4,
  Legendary: 5
};

const makeSvg = (primary, accent, badge) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg width="320" height="320" viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${primary}" />
        <stop offset="100%" stop-color="#101321" />
      </linearGradient>
      <radialGradient id="head" cx="35%" cy="20%" r="90%">
        <stop offset="0%" stop-color="#ffe08f" />
        <stop offset="100%" stop-color="#da9c27" />
      </radialGradient>
    </defs>
    <rect width="320" height="320" rx="36" fill="url(#bg)"/>
    <circle cx="160" cy="120" r="64" fill="url(#head)" />
    <rect x="114" y="54" width="92" height="18" rx="9" fill="#fff6c4" opacity="0.35"/>
    <circle cx="136" cy="112" r="14" fill="#20160b"/>
    <circle cx="184" cy="112" r="14" fill="#20160b"/>
    <path d="M128 152C141 164 153 170 160 170C167 170 179 164 192 152" stroke="#6f3810" stroke-width="10" stroke-linecap="round" fill="none" />
    <rect x="84" y="194" width="152" height="76" rx="24" fill="${accent}" />
    <rect x="100" y="210" width="120" height="14" rx="7" fill="#ffffff" opacity="0.22"/>
    <rect x="30" y="28" width="84" height="32" rx="16" fill="#ffffff" opacity="0.18" />
    <text x="72" y="49" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="16" fill="#ffffff">${badge}</text>
  </svg>
`)}`;

const initialMinifigures = [
  createEntry('mf-001', 'Classic Space Explorer', 'Series 1', 'Galaxy Rover', 'Space', 1984, 'Legendary', 89.5, 4.3, 7, ['#3666ff', '#5bc0ff'], ['vintage', 'helmet', 'logo'], true, ['owned', 'display']),
  createEntry('mf-002', 'Forest Guardian', 'Series 2', 'Emerald Keep', 'Castle', 1993, 'Epic', 61.2, -1.6, 9, ['#2a7c44', '#8adf70'], ['falcon', 'cape', 'shield'], false, ['wishlist']),
  createEntry('mf-003', 'Metro Fire Chief', 'Series 5', 'Downtown Rescue', 'City', 2008, 'Rare', 14.85, 0.4, 6, ['#d93c2f', '#ff9d6b'], ['fire', 'city', 'helmet']),
  createEntry('mf-004', 'Samurai Sensei', 'Series 7', 'Temple Showdown', 'Ninjago', 2012, 'Epic', 33.4, 2.6, 8, ['#6127cc', '#d6b5ff'], ['katana', 'training', 'robe'], true, ['owned']),
  createEntry('mf-005', 'Bounty Hunter Ace', 'Series 8', 'Outer Rim Hunt', 'Star Wars', 2015, 'Legendary', 124.95, 3.8, 10, ['#4d5565', '#9dd7ff'], ['helmet', 'jetpack', 'licensed']),
  createEntry('mf-006', 'Brick Street Musician', 'Series 11', 'Urban Stories', 'Collectible Minifigures', 2018, 'Common', 7.1, -0.3, 5, ['#f19b2c', '#ffd27c'], ['guitar', 'street', 'cmf']),
  createEntry('mf-007', 'Quantum Engineer', 'Series 12', 'Orbit Lab', 'Space', 2020, 'Rare', 19.9, 1.2, 11, ['#0f8f8f', '#85fff1'], ['science', 'visor', 'future'], true, ['owned', 'display']),
  createEntry('mf-008', 'Shield Agent', 'Series 13', 'Avengers Tower', 'Marvel', 2021, 'Rare', 16.45, 0.7, 6, ['#24406f', '#87aefc'], ['marvel', 'badge', 'licensed']),
  createEntry('mf-009', 'Golden Falcon Knight', 'Series 14', 'Lionheart Siege', 'Castle', 2022, 'Legendary', 78.75, 5.2, 12, ['#9d6a16', '#ffdd72'], ['gold', 'falcon', 'horse']),
  createEntry('mf-010', 'Neon Street Racer', 'Series 15', 'Velocity Underground', 'City', 2023, 'Uncommon', 10.2, 1.1, 6, ['#ff3b81', '#80f2ff'], ['racing', 'hoodie', 'city']),
  createEntry('mf-011', 'Festival Dragon Dancer', 'Series 16', 'Lantern Parade', 'Collectible Minifigures', 2024, 'Epic', 25.65, -2.1, 9, ['#ff5a36', '#ffd16b'], ['dragon', 'festival', 'cmf']),
  createEntry('mf-012', 'Deep Sea Diver', 'Series 17', 'Ocean Quest', 'City', 2019, 'Rare', 18.25, 0.9, 7, ['#006e92', '#73dbff'], ['diver', 'ocean', 'tank']),
  createEntry('mf-013', 'Imperial Pilot', 'Series 18', 'Battle of Hoth', 'Star Wars', 2022, 'Epic', 29.35, 1.5, 7, ['#151515', '#8c98a9'], ['empire', 'pilot', 'licensed']),
  createEntry('mf-014', 'Arcade Champion', 'Series 19', 'Retro Expo', 'Collectible Minifigures', 2025, 'Uncommon', 12.95, 3.1, 5, ['#7c3aed', '#35d0ff'], ['arcade', 'retro', 'cmf']),
  createEntry('mf-015', 'Moon Colony Medic', 'Series 20', 'Lunar Outpost', 'Space', 2026, 'Rare', 21.4, 2.3, 8, ['#3f8cff', '#c2f2ff'], ['medic', 'space', 'white'])
];

function createEntry(id, name, series, setName, theme, year, rarity, price, change24h, parts, colors, tags, owned = false, folders = []) {
  return {
    id,
    name,
    series,
    setName,
    theme,
    year,
    rarity,
    price,
    change24h,
    parts,
    tags,
    owned,
    folders,
    image: makeSvg(colors[0], colors[1], series)
  };
}

function storageGet(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function storageSet(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

const state = {
  folders: storageGet('minifind-folders', initialFolders),
  minifigures: storageGet('minifind-minifigures', initialMinifigures),
  filters: storageGet('minifind-filters', defaultFilters)
};

function persist() {
  storageSet('minifind-folders', state.folders);
  storageSet('minifind-minifigures', state.minifigures);
  storageSet('minifind-filters', state.filters);
}

function uniqueFolderName(baseName) {
  const normalized = baseName.trim();
  if (!normalized) {
    return '';
  }
  if (!state.folders.some((folder) => folder.name.toLowerCase() === normalized.toLowerCase())) {
    return normalized;
  }
  let suffix = 2;
  while (state.folders.some((folder) => folder.name.toLowerCase() === `${normalized} ${suffix}`.toLowerCase())) {
    suffix += 1;
  }
  return `${normalized} ${suffix}`;
}

function getYears() {
  return [...new Set(state.minifigures.map((item) => item.year))].sort((a, b) => b - a);
}

function getThemes() {
  return [...new Set(state.minifigures.map((item) => item.theme))].sort();
}

function getRarities() {
  return [...new Set(state.minifigures.map((item) => item.rarity))];
}

function getFilteredMinifigures() {
  const { filters } = state;
  const search = filters.search.trim().toLowerCase();

  return state.minifigures
    .filter((item) => {
      const searchable = [item.name, item.series, item.setName, item.theme, ...item.tags].join(' ').toLowerCase();
      const matchesSearch = !search || searchable.includes(search);
      const matchesRarity = filters.rarity === 'All' || item.rarity === filters.rarity;
      const matchesTheme = filters.theme === 'All' || item.theme === filters.theme;
      const matchesYear = filters.year === 'All' || item.year === Number(filters.year);
      const matchesOwnership =
        filters.ownership === 'All' ||
        (filters.ownership === 'Owned' && item.owned) ||
        (filters.ownership === 'Unowned' && !item.owned);
      const matchesFolder =
        filters.folderId === 'all' ||
        (filters.folderId === 'unfiled' && item.folders.length === 0) ||
        item.folders.includes(filters.folderId);
      return matchesSearch && matchesRarity && matchesTheme && matchesYear && matchesOwnership && matchesFolder;
    })
    .sort((left, right) => {
      switch (state.filters.sortBy) {
        case 'priceHigh':
          return right.price - left.price;
        case 'priceLow':
          return left.price - right.price;
        case 'yearNewest':
          return right.year - left.year;
        case 'yearOldest':
          return left.year - right.year;
        case 'rarity':
          return rarityOrder[right.rarity] - rarityOrder[left.rarity] || left.name.localeCompare(right.name);
        case 'name':
        default:
          return left.name.localeCompare(right.name);
      }
    });
}

function getStats(visibleItems) {
  const ownedItems = state.minifigures.filter((item) => item.owned);
  const ownedValue = ownedItems.reduce((sum, item) => sum + item.price, 0);
  const visibleValue = visibleItems.reduce((sum, item) => sum + item.price, 0);
  return {
    ownedCount: ownedItems.length,
    ownedValue,
    visibleValue,
    avgPrice: visibleItems.length ? visibleValue / visibleItems.length : 0
  };
}

function updateMinifigure(id, updater) {
  state.minifigures = state.minifigures.map((item) => (item.id === id ? updater(item) : item));
  persist();
  render();
}

function toggleOwned(id) {
  updateMinifigure(id, (item) => {
    const owned = !item.owned;
    const folders = owned
      ? [...new Set([...item.folders, 'owned'])]
      : item.folders.filter((folderId) => folderId !== 'owned');
    return { ...item, owned, folders };
  });
}

function toggleFolder(id, folderId) {
  updateMinifigure(id, (item) => {
    const hasFolder = item.folders.includes(folderId);
    const folders = hasFolder ? item.folders.filter((value) => value !== folderId) : [...item.folders, folderId];
    const owned = folderId === 'owned' ? !hasFolder : item.owned;
    return { ...item, folders, owned };
  });
}

function createFolder(name) {
  const nextName = uniqueFolderName(name);
  if (!nextName) {
    return;
  }
  state.folders.push({
    id: `folder-${crypto.randomUUID()}`,
    name: nextName,
    createdAt: new Date().toISOString()
  });
  persist();
  render();
}

function deleteFolder(folderId) {
  if (folderId === 'owned') {
    return;
  }
  state.folders = state.folders.filter((folder) => folder.id !== folderId);
  state.minifigures = state.minifigures.map((item) => ({
    ...item,
    folders: item.folders.filter((id) => id !== folderId)
  }));
  if (state.filters.folderId === folderId) {
    state.filters.folderId = 'all';
  }
  persist();
  render();
}

function setFilter(patch) {
  state.filters = { ...state.filters, ...patch };
  persist();
  render();
}

function resetFilters() {
  state.filters = { ...defaultFilters };
  persist();
  render();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function render() {
  const app = document.querySelector('#app');
  const visibleItems = getFilteredMinifigures();
  const stats = getStats(visibleItems);
  const years = getYears();
  const themes = getThemes();
  const rarities = getRarities();

  app.innerHTML = `
    <div class="app-shell">
      <header class="topbar">
        <div class="brand-wrap">
          <img class="brand-logo" src="./logo.svg" alt="MiniFind logo" />
          <div>
            <p class="eyebrow">Desktop minifigure intelligence</p>
            <h1>MiniFind</h1>
            <p class="muted">
              A desktop-first collector dashboard for browsing minifigures, tracking value, and organizing a collection across folders.
            </p>
          </div>
        </div>

        <div class="header-actions">
          <label class="searchbar">
            <span class="sr-only">Search minifigures</span>
            <input id="search-input" type="search" placeholder="Search by name, set, series, theme, or tag" value="${escapeHtml(state.filters.search)}" />
          </label>
          <div class="header-stats">
            <div class="stat-card compact">
              <span>Owned</span>
              <strong>${stats.ownedCount}</strong>
            </div>
            <div class="stat-card compact">
              <span>Collection value</span>
              <strong>$${stats.ownedValue.toFixed(2)}</strong>
            </div>
          </div>
        </div>
      </header>

      <section class="stats-grid">
        <article class="stat-card">
          <span>Catalog tracked</span>
          <strong>${state.minifigures.length}</strong>
          <small>Seed data wired for a real catalog API later.</small>
        </article>
        <article class="stat-card">
          <span>Owned figures</span>
          <strong>${stats.ownedCount}</strong>
          <small>Ownership syncs with the default collection folder.</small>
        </article>
        <article class="stat-card">
          <span>Folders</span>
          <strong>${state.folders.length}</strong>
          <small>Each minifigure can live in multiple folders.</small>
        </article>
        <article class="stat-card">
          <span>Visible market value</span>
          <strong>$${stats.visibleValue.toFixed(2)}</strong>
          <small>Average visible price $${stats.avgPrice.toFixed(2)}.</small>
        </article>
      </section>

      <div class="dashboard-layout">
        <aside class="sidebar-card">
          <div class="section-title-row">
            <div>
              <p class="eyebrow">Collections</p>
              <h2>Folders</h2>
            </div>
          </div>

          <div class="folder-list">
            <button class="folder-pill ${state.filters.folderId === 'all' ? 'active' : ''}" data-folder-select="all">All minifigures</button>
            <button class="folder-pill ${state.filters.folderId === 'unfiled' ? 'active' : ''}" data-folder-select="unfiled">Unfiled only</button>
            ${state.folders
              .map(
                (folder) => `
                  <div class="folder-row">
                    <button class="folder-pill ${state.filters.folderId === folder.id ? 'active' : ''}" data-folder-select="${folder.id}">${escapeHtml(folder.name)}</button>
                    ${folder.id !== 'owned' ? `<button class="ghost-button danger" data-folder-delete="${folder.id}">Delete</button>` : ''}
                  </div>
                `
              )
              .join('')}
          </div>

          <form id="folder-form" class="folder-form">
            <label>
              <span>New folder</span>
              <input type="text" name="folderName" placeholder="Examples: Trade, Sealed, Favorites" />
            </label>
            <button type="submit" class="primary-button">Add folder</button>
          </form>
        </aside>

        <main class="content-area">
          <section class="controls-card">
            <div class="section-title-row">
              <div>
                <p class="eyebrow">Discover</p>
                <h2>Search & filters</h2>
              </div>
              <button class="ghost-button" id="reset-filters">Reset filters</button>
            </div>
            <div class="filter-grid">
              ${selectMarkup('rarity-filter', 'Rarity', ['All', ...rarities], state.filters.rarity)}
              ${selectMarkup('theme-filter', 'Theme', ['All', ...themes], state.filters.theme)}
              ${selectMarkup('year-filter', 'Year', ['All', ...years], state.filters.year)}
              ${selectMarkup('ownership-filter', 'Ownership', ['All', 'Owned', 'Unowned'], state.filters.ownership)}
              ${selectMarkup(
                'sort-filter',
                'Sort',
                [
                  ['name', 'Name A-Z'],
                  ['priceHigh', 'Price high-low'],
                  ['priceLow', 'Price low-high'],
                  ['yearNewest', 'Newest first'],
                  ['yearOldest', 'Oldest first'],
                  ['rarity', 'Rarity']
                ],
                state.filters.sortBy
              )}
            </div>
          </section>

          <section class="results-header">
            <div>
              <p class="eyebrow">Catalog</p>
              <h2>${visibleItems.length} minifigures visible</h2>
            </div>
            <p class="muted">Live pricing is simulated every 6 seconds to demonstrate a continuously updating market feed.</p>
          </section>

          <section class="catalog-grid">
            ${visibleItems.map(renderCard).join('')}
          </section>

          ${
            visibleItems.length === 0
              ? `
                <section class="empty-state">
                  <h3>No minifigures match the current filters.</h3>
                  <p>Try clearing the search term, changing folders, or resetting filters.</p>
                </section>
              `
              : ''
          }
        </main>
      </div>
    </div>
  `;

  bindEvents();
}

function selectMarkup(id, label, options, selectedValue) {
  const optionMarkup = options
    .map((option) => {
      const value = Array.isArray(option) ? option[0] : option;
      const text = Array.isArray(option) ? option[1] : option;
      return `<option value="${escapeHtml(value)}" ${String(selectedValue) === String(value) ? 'selected' : ''}>${escapeHtml(text)}</option>`;
    })
    .join('');

  return `
    <label>
      <span>${label}</span>
      <select id="${id}">${optionMarkup}</select>
    </label>
  `;
}

function renderCard(item) {
  return `
    <article class="minifigure-card">
      <div class="minifigure-image-wrap">
        <img src="${item.image}" alt="${escapeHtml(item.name)}" class="minifigure-image" />
        <span class="rarity rarity-${item.rarity.toLowerCase()}">${item.rarity}</span>
      </div>
      <div class="minifigure-body">
        <div class="minifigure-topline">
          <div>
            <h3>${escapeHtml(item.name)}</h3>
            <p>${escapeHtml(item.theme)} · ${escapeHtml(item.series)}</p>
          </div>
          <button class="own-toggle ${item.owned ? 'owned' : ''}" data-owned-toggle="${item.id}">${item.owned ? 'Owned' : 'Mark owned'}</button>
        </div>
        <p class="set-name">${escapeHtml(item.setName)}</p>
        <div class="price-row">
          <strong>$${item.price.toFixed(2)}</strong>
          <span class="${item.change24h >= 0 ? 'positive' : 'negative'}">${item.change24h >= 0 ? '+' : ''}${item.change24h.toFixed(1)}% today</span>
        </div>
        <dl class="meta-grid">
          <div>
            <dt>Year</dt>
            <dd>${item.year}</dd>
          </div>
          <div>
            <dt>Parts</dt>
            <dd>${item.parts}</dd>
          </div>
          <div>
            <dt>Figure ID</dt>
            <dd>${escapeHtml(item.id)}</dd>
          </div>
        </dl>
        <div class="tag-row">
          ${item.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
        </div>
        <div class="folder-assignment">
          <span>Folders</span>
          <div class="folder-chip-wrap">
            ${state.folders
              .map(
                (folder) => `
                  <button class="folder-chip ${item.folders.includes(folder.id) ? 'selected' : ''}" data-folder-toggle="${item.id}" data-folder-id="${folder.id}">
                    ${escapeHtml(folder.name)}
                  </button>
                `
              )
              .join('')}
          </div>
        </div>
      </div>
    </article>
  `;
}

function bindEvents() {
  document.querySelector('#search-input').addEventListener('input', (event) => setFilter({ search: event.target.value }));
  document.querySelector('#rarity-filter').addEventListener('change', (event) => setFilter({ rarity: event.target.value }));
  document.querySelector('#theme-filter').addEventListener('change', (event) => setFilter({ theme: event.target.value }));
  document.querySelector('#year-filter').addEventListener('change', (event) => setFilter({ year: event.target.value }));
  document.querySelector('#ownership-filter').addEventListener('change', (event) => setFilter({ ownership: event.target.value }));
  document.querySelector('#sort-filter').addEventListener('change', (event) => setFilter({ sortBy: event.target.value }));
  document.querySelector('#reset-filters').addEventListener('click', resetFilters);

  document.querySelectorAll('[data-folder-select]').forEach((button) => {
    button.addEventListener('click', () => setFilter({ folderId: button.dataset.folderSelect }));
  });

  document.querySelectorAll('[data-folder-delete]').forEach((button) => {
    button.addEventListener('click', () => deleteFolder(button.dataset.folderDelete));
  });

  document.querySelector('#folder-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    createFolder(data.get('folderName'));
    event.currentTarget.reset();
  });

  document.querySelectorAll('[data-owned-toggle]').forEach((button) => {
    button.addEventListener('click', () => toggleOwned(button.dataset.ownedToggle));
  });

  document.querySelectorAll('[data-folder-toggle]').forEach((button) => {
    button.addEventListener('click', () => toggleFolder(button.dataset.folderToggle, button.dataset.folderId));
  });
}

function tickPrices() {
  state.minifigures = state.minifigures.map((item, index) => {
    const drift = Math.sin(Date.now() / 240000 + index) * 0.015;
    const price = Math.max(1, Number((item.price * (1 + drift)).toFixed(2)));
    const change24h = Number(Math.max(-12, Math.min(12, item.change24h + drift * 100)).toFixed(1));
    return { ...item, price, change24h };
  });
  persist();
  render();
}

render();
window.setInterval(tickPrices, 6000);
