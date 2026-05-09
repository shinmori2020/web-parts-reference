/* =========================================
   components.js — 描画コンポーネント
   Crisp Mono / Sidebar layout (1+3+4)
   ========================================= */

/**
 * タグフィルターのチップを生成
 * @param {Set<string>} activeTags - 現在 active なタグID集合
 */
function renderTags(activeTags) {
  return TAGS.map(tag => {
    const isActive = activeTags.has(tag.id);
    return `<button type="button"
      class="tag-chip${isActive ? ' tag-chip--active' : ''}"
      data-tag="${tag.id}"
      aria-pressed="${isActive}"
    ><span class="tag-chip__hash" aria-hidden="true">#</span>${tag.label}</button>`;
  }).join('');
}

/**
 * サイドバーのカテゴリ項目を生成
 * @param {string} activeCategory - 現在のカテゴリID
 * @param {Map<string,number>} counts - カテゴリIDごとのフィルタ後件数
 */
function renderSidebar(activeCategory, counts) {
  return CATEGORIES.map(cat => {
    const count = counts.get(cat.id) ?? 0;
    const isActive = cat.id === activeCategory;
    const isEmpty = count === 0;
    const classes = ['sidebar__item'];
    if (isActive) classes.push('sidebar__item--active');
    if (isEmpty) classes.push('sidebar__item--empty');
    const disabled = isEmpty && !isActive;
    return `<li>
      <button type="button"
        class="${classes.join(' ')}"
        data-category="${cat.id}"
        aria-pressed="${isActive}"
        ${disabled ? 'disabled' : ''}
      ><span class="sidebar__prefix" aria-hidden="true">${cat.prefix}</span><span class="sidebar__label">${cat.label}</span><span class="sidebar__count">${count}</span></button>
    </li>`;
  }).join('');
}

/**
 * パーツカード1件を生成
 * @param {Object} part
 * @param {boolean} isOpen
 * @param {string} query - 検索クエリ（マッチをハイライト）
 */
function renderPartCard(part, isOpen, query = '') {
  const bodyId = `part-body-${part.id}`;
  const cat = CATEGORIES.find(c => c.id === part.category);
  const prefix = cat ? cat.prefix : '';
  const useWhen = part.useWhen || '';
  const avoidWhen = part.avoidWhen || '';
  const usageBlock = (useWhen || avoidWhen) ? `
    <dl class="part-usage">
      ${useWhen ? `<dt class="part-usage__term part-usage__term--use">推奨</dt><dd class="part-usage__desc">${escapeHtml(useWhen)}</dd>` : ''}
      ${avoidWhen ? `<dt class="part-usage__term part-usage__term--avoid">回避</dt><dd class="part-usage__desc">${escapeHtml(avoidWhen)}</dd>` : ''}
    </dl>` : '';
  return `
    <article class="part-card${isOpen ? ' part-card--open' : ''}" data-part-id="${part.id}" data-category="${part.category}">
      <button
        type="button"
        class="part-card-header"
        data-toggle="${part.id}"
        aria-expanded="${isOpen}"
        aria-controls="${bodyId}"
      >
        <span class="part-card-names">
          <span class="part-name-ja">${highlightMatch(part.ja, query)}</span>
          <span class="part-name-en">${highlightMatch(part.en, query)}</span>
        </span>
        <span class="part-card__tag" aria-label="カテゴリ ${prefix}">[${prefix}]</span>
        <span class="part-card-toggle" aria-hidden="true">▸</span>
      </button>
      <div class="part-card-body" id="${bodyId}">
        <div class="part-card-body-inner">
          <div class="part-card-body__main">
            <div class="part-description">${escapeHtml(part.desc)}</div>
            ${usageBlock}
            <div class="part-sample-wrapper">
              <div class="part-sample-label">Visual Sample</div>
              <div class="part-sample">${part.sampleHtml}</div>
            </div>
          </div>
          <div class="part-card-body__code">
            <div class="part-code-wrapper">
              <div class="part-code-label">HTML</div>
              <div class="code-block">
                <button type="button" class="code-copy-btn" data-code="${encodeURIComponent(part.html)}" aria-label="コードをコピー">Copy</button>
                <pre>${highlightHtml(part.html)}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  `;
}

/**
 * カテゴリグループを生成
 */
function renderCategoryGroup(category, parts, openIds, query = '') {
  const cards = parts.map(p => renderPartCard(p, openIds.has(p.id), query)).join('');
  return `
    <section class="category-group" data-category="${category.id}" aria-labelledby="cat-${category.id}">
      <header class="category-header">
        <span class="category-header__prefix" aria-hidden="true">[${category.prefix}]</span>
        <h2 class="category-title" id="cat-${category.id}">${category.label}</h2>
        <span class="category-title-en">${category.en}</span>
        <span class="category-count">${parts.length}</span>
      </header>
      <div class="category-group__cards">
        ${cards}
      </div>
    </section>
  `;
}

/**
 * 空状態を生成（条件緩和サジェスト付き）
 * @param {{cat:string, query:string, tagCount:number}} state
 */
function renderEmptyState(state = {cat:'all', query:'', tagCount:0}) {
  const actions = [];
  if (state.query) {
    actions.push(`<button type="button" class="empty-action" data-empty-action="clear-search">検索 "${escapeHtml(state.query)}" を解除</button>`);
  }
  if (state.tagCount > 0) {
    actions.push(`<button type="button" class="empty-action" data-empty-action="clear-tags">タグ ${state.tagCount} 個を解除</button>`);
  }
  if (state.cat !== 'all') {
    actions.push(`<button type="button" class="empty-action" data-empty-action="reset-category">「すべて」のカテゴリに戻す</button>`);
  }
  const hint = actions.length > 0
    ? '<div class="empty-state__hint">条件を緩めると見つかるかもしれません</div>'
    : '';
  const actionsHtml = actions.length > 0
    ? `<div class="empty-state__actions">${actions.join('')}</div>`
    : '';
  return `<div class="empty-state">
    <div class="empty-state__title">該当するパーツがありません</div>
    ${hint}
    ${actionsHtml}
  </div>`;
}

/**
 * HTMLエスケープ
 */
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * 検索クエリにマッチした部分を <mark> でラップする（テキスト用）
 */
function highlightMatch(text, query) {
  if (!query || !text) return escapeHtml(text || '');
  const safe = escapeHtml(text);
  const safeQuery = escapeHtml(query).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  if (!safeQuery) return safe;
  const regex = new RegExp(`(${safeQuery})`, 'gi');
  return safe.replace(regex, '<mark class="hl-match">$1</mark>');
}

/**
 * HTML コードに最小限のシンタックスハイライトを適用
 *   タグ名 / 属性 / 値 / コメント を grayscale で区別
 *   外部ライブラリ不使用、カスタム vanilla 実装
 */
function highlightHtml(code) {
  const escaped = escapeHtml(code);
  // HTML らしさが見当たらない（CSS/JS）→ そのまま返す
  if (!/&lt;/.test(escaped)) return escaped;

  // 1. コメント &lt;!-- ... --&gt;
  let out = escaped.replace(
    /(&lt;!--[\s\S]*?--&gt;)/g,
    '<span class="hl-comment">$1</span>'
  );

  // 2. タグ &lt;tagname ...&gt;
  out = out.replace(
    /(&lt;\/?)([a-zA-Z][\w-]*)((?:\s[^&]*)?)(\/?&gt;)/g,
    (match, open, tag, attrs, close) => {
      // 属性内をハイライト：name="value"
      const hlAttrs = attrs.replace(
        /(\s+)([\w-]+)(=)(&quot;[^&]*?&quot;)/g,
        '$1<span class="hl-attr">$2</span>$3<span class="hl-value">$4</span>'
      );
      return `${open}<span class="hl-tag">${tag}</span>${hlAttrs}${close}`;
    }
  );

  return out;
}

/**
 * コードをクリップボードにコピー
 */
function copyCode(button) {
  const code = decodeURIComponent(button.getAttribute('data-code'));
  navigator.clipboard.writeText(code).then(() => {
    const originalText = button.textContent;
    button.textContent = 'Copied';
    setTimeout(() => {
      button.textContent = originalText;
    }, 1500);
  });
}
