/* =========================================
   app.js — メインアプリケーションロジック
   Sidebar layout + dynamic counts
   ========================================= */

// ----- State -----
let activeCategory = 'all';
let activeTags = new Set();      // 空 Set = 未選択（タグ無効）
let searchQuery = '';
let openIds = new Set();

// ----- DOM References -----
const sidebarNavEl = document.getElementById('sidebarNav');
const tagFilterEl = document.getElementById('tagFilter');
const tagClearEl = document.getElementById('tagClear');
const shortcutModalEl = document.getElementById('shortcutModal');
const searchInputEl = document.getElementById('searchInput');
const searchClearEl = document.getElementById('searchClear');
const partsContainerEl = document.getElementById('partsContainer');
const resultsCountEl = document.getElementById('resultsCount');
const totalCountEl = document.getElementById('totalCount');
const footerTextEl = document.getElementById('footerText');
const expandAllEl = document.getElementById('expandAll');
const collapseAllEl = document.getElementById('collapseAll');

// ----- Helpers -----
function debounce(fn, ms) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

// ----- URL state persistence -----
function updateUrl() {
  const params = new URLSearchParams();
  if (activeCategory !== 'all') params.set('cat', activeCategory);
  if (activeTags.size > 0) params.set('tags', [...activeTags].join(','));
  if (searchQuery) params.set('q', searchQuery);
  const search = params.toString();
  const newUrl = search ? `${window.location.pathname}?${search}` : window.location.pathname;
  window.history.replaceState(null, '', newUrl);
}

function readUrlState() {
  const params = new URLSearchParams(window.location.search);
  const cat = params.get('cat');
  if (cat && CATEGORIES.some(c => c.id === cat)) {
    activeCategory = cat;
  }
  const tagsParam = params.get('tags');
  if (tagsParam) {
    tagsParam.split(',').forEach(t => {
      if (TAGS.some(tag => tag.id === t)) activeTags.add(t);
    });
  }
  const q = params.get('q');
  if (q) {
    searchQuery = q;
    if (searchInputEl) searchInputEl.value = q;
    if (searchClearEl) searchClearEl.classList.add('search-clear--visible');
  }
}

// ----- Filtering Logic -----
function getFilteredParts() {
  const q = searchQuery.toLowerCase();
  return PARTS.filter(p => {
    const catMatch = activeCategory === 'all' || p.category === activeCategory;
    // AND ロジック：選択中の全タグが p.tags に含まれている必要がある
    const tagMatch = activeTags.size === 0
      || (p.tags && [...activeTags].every(t => p.tags.includes(t)));
    const searchMatch = !q
      || p.ja.toLowerCase().includes(q)
      || p.en.toLowerCase().includes(q)
      || p.desc.toLowerCase().includes(q);
    return catMatch && tagMatch && searchMatch;
  });
}

function getGroupedParts(filtered) {
  return CATEGORIES
    .filter(c => c.id !== 'all')
    .reduce((acc, cat) => {
      const items = filtered.filter(p => p.category === cat.id);
      if (items.length > 0) {
        acc.push({ category: cat, items });
      }
      return acc;
    }, []);
}

/**
 * Compute per-category counts ignoring the active category filter
 * (so sidebar always shows what would match each category given search + tag)
 */
function computeSidebarCounts() {
  const q = searchQuery.toLowerCase();
  const matchesSearch = (p) => !q
    || p.ja.toLowerCase().includes(q)
    || p.en.toLowerCase().includes(q)
    || p.desc.toLowerCase().includes(q);
  const matchesTag = (p) => activeTags.size === 0
    || (p.tags && [...activeTags].every(t => p.tags.includes(t)));

  const counts = new Map();
  const allMatching = PARTS.filter(p => matchesSearch(p) && matchesTag(p));
  counts.set('all', allMatching.length);
  CATEGORIES.forEach(cat => {
    if (cat.id === 'all') return;
    counts.set(cat.id, allMatching.filter(p => p.category === cat.id).length);
  });
  return counts;
}

// ----- Render: parts list -----
function renderParts() {
  const filtered = getFilteredParts();
  const grouped = getGroupedParts(filtered);

  if (grouped.length === 0) {
    partsContainerEl.innerHTML = renderEmptyState({
      cat: activeCategory,
      query: searchQuery,
      tagCount: activeTags.size,
    });
  } else {
    partsContainerEl.innerHTML = grouped
      .map(g => renderCategoryGroup(g.category, g.items, openIds, searchQuery))
      .join('');
  }

  resultsCountEl.textContent = `${filtered.length} 件`;
}

// ----- Render: parts list with category-switch animation -----
let switchAnimTimer = null;
function renderPartsWithSwitchAnimation() {
  partsContainerEl.classList.add('is-switching');
  renderParts();
  clearTimeout(switchAnimTimer);
  switchAnimTimer = setTimeout(() => {
    partsContainerEl.classList.remove('is-switching');
  }, 1000);
}

// ----- Render: sidebar (full) -----
function renderSidebarFresh() {
  const counts = computeSidebarCounts();
  sidebarNavEl.innerHTML = renderSidebar(activeCategory, counts);
}

// ----- Render: tag filter chips (initial only) -----
function renderTagsFresh() {
  tagFilterEl.innerHTML = renderTags(activeTags);
  updateTagClearVisibility();
}

// クリアボタンの表示制御
function updateTagClearVisibility() {
  if (tagClearEl) {
    tagClearEl.classList.toggle('tag-clear--visible', activeTags.size > 0);
  }
}

// ----- Update sidebar counts only (no full re-render) -----
function updateSidebarCounts() {
  const counts = computeSidebarCounts();
  CATEGORIES.forEach(cat => {
    const item = sidebarNavEl.querySelector(`[data-category="${cat.id}"]`);
    if (!item) return;
    const count = counts.get(cat.id) ?? 0;
    const countEl = item.querySelector('.sidebar__count');
    if (countEl) countEl.textContent = count;
    const isActive = cat.id === activeCategory;
    const isEmpty = count === 0;
    item.classList.toggle('sidebar__item--empty', isEmpty);
    item.disabled = isEmpty && !isActive;
  });
}

// ----- Render: counts (header + footer) -----
function renderCounts() {
  totalCountEl.textContent = `${PARTS.length} parts · ${CATEGORIES.length - 1} categories`;
  footerTextEl.textContent = `WEB Design Parts Reference · ${PARTS.length} parts`;
}

// ----- Card open/close (DOM-only, no re-render) -----
function setCardOpen(card, headerBtn, isOpen) {
  card.classList.toggle('part-card--open', isOpen);
  if (headerBtn) {
    headerBtn.setAttribute('aria-expanded', String(isOpen));
  }
}

// ----- FLIP: animate sibling cards' displacement on open/close -----
//   First → Last → Invert → Play (transform/opacity only, skills compliant)
function setCardOpenWithFlip(card, headerBtn, isOpen) {
  // FIRST: capture current top of every other card
  const allCards = partsContainerEl.querySelectorAll('.part-card');
  const before = new Map();
  allCards.forEach(c => {
    if (c !== card) before.set(c, c.getBoundingClientRect().top);
  });

  // LAST: apply state change
  setCardOpen(card, headerBtn, isOpen);

  // INVERT + PLAY
  allCards.forEach(c => {
    if (c === card) return;
    const oldTop = before.get(c);
    if (oldTop === undefined) return;
    const newTop = c.getBoundingClientRect().top;
    const delta = oldTop - newTop;
    if (Math.abs(delta) > 0.5) {
      c.style.transition = 'none';
      c.style.transform = `translateY(${delta}px)`;
      // force reflow so the inverted transform paints first
      void c.offsetHeight;
      c.style.transition = 'transform 0.32s cubic-bezier(0.2, 0.8, 0.2, 1)';
      c.style.transform = '';
    }
  });

  // Cleanup after animation
  clearTimeout(setCardOpenWithFlip._t);
  setCardOpenWithFlip._t = setTimeout(() => {
    allCards.forEach(c => {
      c.style.transition = '';
      c.style.transform = '';
    });
  }, 380);
}

// ----- Event Handlers -----

// Tag chip click — multi-select toggle (AND logic)
tagFilterEl.addEventListener('click', (e) => {
  const btn = e.target.closest('.tag-chip');
  if (!btn) return;
  const tag = btn.getAttribute('data-tag');
  // Toggle in/out of the Set
  if (activeTags.has(tag)) {
    activeTags.delete(tag);
  } else {
    activeTags.add(tag);
  }
  // Update active state on all chips
  tagFilterEl.querySelectorAll('.tag-chip').forEach(b => {
    const isActive = activeTags.has(b.getAttribute('data-tag'));
    b.classList.toggle('tag-chip--active', isActive);
    b.setAttribute('aria-pressed', String(isActive));
  });
  updateTagClearVisibility();
  renderPartsWithSwitchAnimation();
  updateSidebarCounts();
  updateUrl();
});

// Tag clear all
if (tagClearEl) {
  tagClearEl.addEventListener('click', () => {
    if (activeTags.size === 0) return;
    activeTags.clear();
    tagFilterEl.querySelectorAll('.tag-chip').forEach(b => {
      b.classList.remove('tag-chip--active');
      b.setAttribute('aria-pressed', 'false');
    });
    updateTagClearVisibility();
    renderPartsWithSwitchAnimation();
    updateSidebarCounts();
    updateUrl();
  });
}

// Sidebar category click — animated
sidebarNavEl.addEventListener('click', (e) => {
  const btn = e.target.closest('.sidebar__item');
  if (!btn || btn.disabled) return;
  const cat = btn.getAttribute('data-category');
  if (cat === activeCategory) return;
  activeCategory = cat;
  sidebarNavEl.querySelectorAll('.sidebar__item').forEach(b => {
    const isActive = b === btn;
    b.classList.toggle('sidebar__item--active', isActive);
    b.setAttribute('aria-pressed', String(isActive));
  });
  renderPartsWithSwitchAnimation();
  updateSidebarCounts();
  updateUrl();
});

// Search input — debounced render for performance
const debouncedSearchRender = debounce(() => {
  partsContainerEl.classList.remove('is-switching');
  renderParts();
  updateSidebarCounts();
  updateUrl();
}, 200);

searchInputEl.addEventListener('input', (e) => {
  searchQuery = e.target.value;
  searchClearEl.classList.toggle('search-clear--visible', searchQuery.length > 0);
  debouncedSearchRender();
});

// Search clear
searchClearEl.addEventListener('click', () => {
  searchQuery = '';
  searchInputEl.value = '';
  searchClearEl.classList.remove('search-clear--visible');
  searchInputEl.focus();
  partsContainerEl.classList.remove('is-switching');
  renderParts();
  updateSidebarCounts();
  updateUrl();
});

// Card toggle (event delegation)
partsContainerEl.addEventListener('click', (e) => {
  const copyBtn = e.target.closest('.code-copy-btn');
  if (copyBtn) {
    copyCode(copyBtn);
    return;
  }

  // Empty state action buttons (relax filters)
  const emptyAction = e.target.closest('.empty-action');
  if (emptyAction) {
    const action = emptyAction.getAttribute('data-empty-action');
    if (action === 'clear-search') {
      searchQuery = '';
      searchInputEl.value = '';
      searchClearEl.classList.remove('search-clear--visible');
    } else if (action === 'clear-tags') {
      activeTags.clear();
      tagFilterEl.querySelectorAll('.tag-chip').forEach(b => {
        b.classList.remove('tag-chip--active');
        b.setAttribute('aria-pressed', 'false');
      });
      updateTagClearVisibility();
    } else if (action === 'reset-category') {
      activeCategory = 'all';
      sidebarNavEl.querySelectorAll('.sidebar__item').forEach(b => {
        const isAll = b.getAttribute('data-category') === 'all';
        b.classList.toggle('sidebar__item--active', isAll);
        b.setAttribute('aria-pressed', String(isAll));
      });
    }
    renderPartsWithSwitchAnimation();
    updateSidebarCounts();
    updateUrl();
    return;
  }

  const headerBtn = e.target.closest('[data-toggle]');
  if (headerBtn) {
    const id = headerBtn.getAttribute('data-toggle');
    const card = headerBtn.closest('.part-card');
    const willOpen = !openIds.has(id);
    if (willOpen) {
      openIds.add(id);
    } else {
      openIds.delete(id);
    }
    // 単一カード開閉時は FLIP で他カードの变位をなめらかに
    setCardOpenWithFlip(card, headerBtn, willOpen);
  }
});

// Expand all
expandAllEl.addEventListener('click', () => {
  const filtered = getFilteredParts();
  filtered.forEach(p => openIds.add(p.id));
  partsContainerEl.querySelectorAll('.part-card').forEach(card => {
    const headerBtn = card.querySelector('[data-toggle]');
    setCardOpen(card, headerBtn, true);
  });
});

// Collapse all
collapseAllEl.addEventListener('click', () => {
  openIds = new Set();
  partsContainerEl.querySelectorAll('.part-card').forEach(card => {
    const headerBtn = card.querySelector('[data-toggle]');
    setCardOpen(card, headerBtn, false);
  });
});

// ----- Keyboard shortcuts -----
function openShortcutModal() {
  if (!shortcutModalEl) return;
  shortcutModalEl.hidden = false;
  // Move focus to close button for keyboard users
  const closeBtn = shortcutModalEl.querySelector('.shortcut-modal__close');
  if (closeBtn) closeBtn.focus();
}

function closeShortcutModal() {
  if (!shortcutModalEl) return;
  shortcutModalEl.hidden = true;
}

if (shortcutModalEl) {
  shortcutModalEl.addEventListener('click', (e) => {
    if (e.target.closest('[data-shortcut-close]')) {
      closeShortcutModal();
    }
  });
}

document.addEventListener('keydown', (e) => {
  const tag = e.target.tagName;
  const isTyping = tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable;

  // Esc: clear search if focused there, or close modal
  if (e.key === 'Escape') {
    if (shortcutModalEl && !shortcutModalEl.hidden) {
      e.preventDefault();
      closeShortcutModal();
      return;
    }
    if (e.target === searchInputEl) {
      e.preventDefault();
      if (searchQuery) {
        searchQuery = '';
        searchInputEl.value = '';
        searchClearEl.classList.remove('search-clear--visible');
        renderParts();
        updateSidebarCounts();
        updateUrl();
      }
      searchInputEl.blur();
      return;
    }
  }

  // While typing in inputs, don't trigger other shortcuts
  if (isTyping) return;

  // / : focus search
  if (e.key === '/') {
    e.preventDefault();
    searchInputEl.focus();
    searchInputEl.select();
    return;
  }

  // ? : show help modal
  if (e.key === '?') {
    e.preventDefault();
    openShortcutModal();
    return;
  }

  // Shift+E : expand all
  if (e.shiftKey && (e.key === 'E' || e.key === 'e')) {
    e.preventDefault();
    expandAllEl.click();
    return;
  }

  // Shift+C : collapse all
  if (e.shiftKey && (e.key === 'C' || e.key === 'c')) {
    e.preventDefault();
    collapseAllEl.click();
    return;
  }
});

// ----- Initialize -----
readUrlState();          // Restore filter/tag/search from URL
renderSidebarFresh();
renderTagsFresh();
renderParts();
renderCounts();
