# WEB Design Parts Reference — 技術仕様書

本ドキュメントは実装者・保守担当者向けの技術ガイドです。  
プロジェクト全体の概要・機能仕様は [`docs/project-summary.md`](project-summary.md) を参照してください。

---

## 1. 技術スタック

### 1.1 使用技術

| 技術 | 詳細 | 用途 |
|------|------|------|
| HTML5 | — | マークアップ |
| CSS3 | カスタムプロパティ・Grid・`content-visibility`・`size-adjust`・`:focus-visible`・`prefers-reduced-motion` | スタイリング |
| JavaScript (ES6+) | アロー関数、Set、Map、テンプレートリテラル等 | ロジック |
| IBM Plex Sans / Mono | woff2、subset latin、self-hosted | タイポグラフィ |

### 1.2 外部ライブラリ

**JavaScript の外部ライブラリは 0 件**。すべて vanilla JS。  
唯一の外部依存はフォント（IBM Plex）だが、Google Fonts からダウンロードして `fonts/` にセルフホスト済み。

### 1.3 使用フォント

```css
--font-body: 'IBM Plex Sans', 'IBM Plex Sans Fallback',
             'Hiragino Sans', 'Yu Gothic', 'Noto Sans JP', sans-serif;
--font-mono: 'IBM Plex Mono', 'IBM Plex Mono Fallback',
             'SF Mono', 'Consolas', 'Liberation Mono', monospace;
```

- **IBM Plex Sans**: Variable font（4 weights 400/500/600/700 を 1 ファイルに）
- **IBM Plex Mono**: 静的フォント 3 ファイル（400/500/600）
- **Plex Sans Fallback / Plex Mono Fallback**: `local('Arial')` / `local('Consolas')` 等を `size-adjust` `ascent-override` `descent-override` `line-gap-override` で **Plex メトリックに整形**（CLS 削減用）
- 日本語: OS 標準フォントへフォールバック（Plex Sans JP は容量負担回避で未採用）
- `font-display: swap` で FOIT 回避
- `<link rel="preload">` で sans-var と mono-400 を先読み

### 1.4 対応ブラウザ

モダン CSS（CSS Grid・`content-visibility`・`:focus-visible`・`prefers-reduced-motion` 等）を使用するため、以下のブラウザバージョン以上を想定：

| ブラウザ | バージョン |
|---|---|
| Chrome / Edge | 111+ |
| Firefox | 113+ |
| Safari | 16.2+（`content-visibility` 対応は Safari 18+） |

古い Safari でも動作はするが、`content-visibility` の最適化は効かない。

---

## 2. ファイル構成

```
web-parts-reference/
├── README.md                      ← プロジェクト玄関口
├── index.html                     ← Critical CSS + OGP インライン化済み
├── favicon.svg
├── images/og.svg
├── fonts/
│   ├── plex-sans-var.woff2       (45KB, variable, 4 weights)
│   ├── plex-mono-400.woff2       (15KB)
│   ├── plex-mono-500.woff2       (15KB)
│   └── plex-mono-600.woff2       (16KB)
├── css/
│   ├── components.css             ← 全コンポーネント
│   ├── sections.css               ← サンプル用ユーティリティ
│   └── responsive.css             ← レスポンシブ
├── js/
│   ├── data.js                    ← CATEGORIES + TAGS + PARTS + TAG_ASSIGNMENTS + USE_NOTES
│   ├── components.js              ← 描画関数
│   └── app.js                     ← 状態 + イベントハンドラ
├── docs/
│   ├── project-summary.md         ← プロジェクト仕様書（正本）
│   ├── technical-guide.md         ← 本ファイル
│   ├── web-design-parts-list.md
│   └── work-log.md
├── .claude/skills/                ← 10 スキル
└── CLAUDE.md
```

> 注: 旧 `css/base.css` は廃止し、Critical CSS として `index.html` の `<style>` にインライン化されている。

---

## 3. アーキテクチャ

### 3.1 全体構成

```
index.html
  ├── <style> (Critical CSS: tokens / @font-face / reset / skip link)
  ├── <link rel="preload"> for fonts
  ├── <link rel="stylesheet"> for components.css / sections.css / responsive.css
  └── <script src="js/data.js"> → components.js → app.js
```

### 3.2 データフロー

```
data.js                          → 静的データ（CATEGORIES / TAGS / PARTS / TAG_ASSIGNMENTS / USE_NOTES）
   │ PARTS.forEach で tags / useWhen / avoidWhen を動的付与
   ▼
app.js                           → State (activeCategory / activeTags / searchQuery / openIds)
   │ readUrlState() で URL から復元
   │ filter / search / tag handlers
   │ debouncedSearchRender (200ms)
   │ updateUrl() / updateSidebarCounts()
   ▼
components.js                    → 純関数：HTML 文字列を返す
   │ renderSidebar / renderTags / renderPartCard / renderCategoryGroup
   │ highlightMatch / highlightHtml / escapeHtml / copyCode
   ▼
DOM (innerHTML / classList)      → ブラウザ描画
   │ FLIP transform で sibling card の displacement を滑らかに
```

### 3.3 レンダリング戦略

| イベント | 戦略 |
|---|---|
| 初期化 | URL 復元 → サイドバー・タグ・パーツ・件数を全描画 |
| カテゴリ切替 | サイドバー: クラス更新のみ。パーツ: `innerHTML` で再構築 + アニメ |
| タグ切替 | チップのクラス更新 + パーツ再構築 + アニメ + URL 更新 |
| 検索入力 | サイドバー件数のみ `textContent` 更新。パーツ: `innerHTML` 再構築（200ms デバウンス、アニメなし） |
| カード開閉 | 対象カードに `.part-card--open` をトグル + `aria-expanded` 更新（**DOM 全再描画なし**）+ FLIP で sibling 移動 |
| すべて開く/閉じる | 全カードに classList 操作のみ |

カード開閉時に DOM を再構築しないのは、CSS アニメーションの発火と FLIP 計測のため。

---

## 4. データ構造

### 4.1 カテゴリ定義（`CATEGORIES`、12 件）

```javascript
{
  id:     "layout",       // 一意のID
  label:  "レイアウト",    // 日本語表示
  en:     "Layout",       // 英語表示
  prefix: "LAY"           // 3 文字略称（カードタグ）
}
```

### 4.2 タグ定義（`TAGS`、9 件）

```javascript
{
  id:    "ec",            // 一意のID
  label: "ECサイト"        // 表示用ラベル
}
```

### 4.3 パーツデータ（`PARTS`、200 件）

```javascript
{
  id:         "header",                      // ケバブケース・unique
  ja:         "ヘッダー",                    // 日本語名
  en:         "Header",                      // 英語名
  category:   "layout",                      // CATEGORIES の id
  desc:       "ページ最上部に配置される…",   // 30〜80 字の説明
  html:       `<header>…</header>`,          // HTML コード（テンプレートリテラル）
  sampleHtml: `<div>…</div>`,                // ビジュアルサンプル HTML
  // 以下は TAG_ASSIGNMENTS / USE_NOTES から PARTS.forEach で動的付与
  tags:       ["landing","ec",...],
  useWhen:    "サイト全体で常時…",
  avoidWhen:  "1ページ完結のキャンペーン…"
}
```

### 4.4 タグ割り当て（`TAG_ASSIGNMENTS`、200 件）

```javascript
const TAG_ASSIGNMENTS = {
  "header": ["landing","ec","admin","blog","portfolio","corporate","saas","media","community"],
  "hero":   ["landing","portfolio","corporate","saas"],
  // ...
};
```

### 4.5 推奨/回避メモ（`USE_NOTES`、200 件）

```javascript
const USE_NOTES = {
  "header": {
    useWhen:   "サイト全体の主要ナビと識別を提供したい場面。",
    avoidWhen: "1ページ完結のキャンペーン LP では不要なことも。"
  },
  // ...
};
```

---

## 5. スタイルシステム（Crisp Mono）

### 5.1 デザイントークン（`index.html` の `<style>` 内 `:root`）

Critical CSS としてインライン化されている：

```css
:root {
  /* Color: pure monochrome */
  --color-bg: #ffffff;
  --color-surface: #ffffff;
  --color-surface-2: #fafafa;     /* ホバー */
  --color-surface-3: #f4f4f5;     /* コードブロック */

  --color-text: #0a0a0a;          /* primary */
  --color-text-secondary: #525252;/* body */
  --color-text-muted: #737373;    /* metadata (WCAG AA 4.6:1) */
  --color-text-faint: #a3a3a3;    /* decorative only */

  --border: #e5e5e5;
  --border-strong: #d4d4d4;

  --color-inverse-bg: #0a0a0a;    /* active state */
  --color-inverse-text: #ffffff;
  --color-inverse-text-muted: rgba(255, 255, 255, 0.6);

  --font-body: 'IBM Plex Sans', 'IBM Plex Sans Fallback',
               'Hiragino Sans', 'Yu Gothic', 'Noto Sans JP', sans-serif;
  --font-mono: 'IBM Plex Mono', 'IBM Plex Mono Fallback',
               'SF Mono', 'Consolas', 'Liberation Mono', monospace;

  --layout-max-width: 1400px;
  --sidebar-width: 220px;
  --radius-sm: 4px;
  --radius-md: 6px;

  /* Spacing scale (4px base) */
  --space-1: 4px;  --space-2: 8px;  --space-3: 12px;
  --space-4: 16px; --space-5: 20px; --space-6: 24px;
  --space-8: 32px; --space-10: 40px; --space-16: 64px;
}
```

### 5.2 命名規則：BEM 風

| 役割 | 区切り | 例 |
|---|---|---|
| Block | — | `.part-card` |
| Element | シングルハイフン `-` | `.part-card-header` |
| Modifier | ダブルハイフン `--` | `.part-card--open` |

### 5.3 アニメーション規則

- **`transform` と `opacity` のみ**（CLAUDE.md / core-web-vitals 準拠）
- duration は 0.12〜0.5s
- `prefers-reduced-motion: reduce` で全アニメ短縮（`<style>` 内に定義）

### 5.4 主要アニメ一覧

| 対象 | プロパティ | duration / easing |
|---|---|---|
| カード hover | translateY(-2px) | 0.18s |
| トグル `▸` 回転 | rotate(90deg) | 0.32s cubic-bezier(0.34, 1.4, 0.64, 1) |
| カード body 開時 | opacity + translateY(-10px → 0) | 0.32s cubic-bezier(0.2, 0.8, 0.2, 1) |
| カード body 内のスタガー | partFadeUp keyframe | 0.32〜0.36s (0.04 / 0.10 / 0.16s 遅延) |
| カテゴリ切替 | groupEnter keyframe | 0.5s（最大 0.32s スタガー） |
| ボタン press | scale(0.96 / 0.94) | 0.12s |
| **FLIP（sibling）** | translateY(差分) → 0 | 0.32s cubic-bezier(0.2, 0.8, 0.2, 1) |

---

## 6. JavaScript アーキテクチャ

### 6.1 `data.js`

静的データの定義 + 動的付与の forEach。グローバル定数：
- `CATEGORIES`（12）
- `TAGS`（9）
- `PARTS`（200）
- `TAG_ASSIGNMENTS`（200）
- `USE_NOTES`（200）

### 6.2 `components.js`

すべて HTML 文字列を返す純関数：

| 関数 | 戻り値 | 用途 |
|---|---|---|
| `renderTags(activeTags: Set)` | `<button>` の連結 | タグチップ群 |
| `renderSidebar(activeCategory, counts)` | `<li><button>...</li>` の連結 | サイドバー |
| `renderPartCard(part, isOpen, query)` | `<article>` の HTML | カード 1 件 |
| `renderCategoryGroup(category, parts, openIds, query)` | `<section>` の HTML | カテゴリ単位 |
| `renderEmptyState(state)` | `<div>` の HTML | 0 件時の表示（条件緩和ボタン付） |
| `escapeHtml(str)` | エスケープ済み文字列 | XSS 対策 |
| `highlightMatch(text, query)` | 文字列（`<mark>` 入り） | 検索ハイライト |
| `highlightHtml(code)` | 文字列（`<span class="hl-*">` 入り） | シンタックスハイライト |
| `copyCode(button)` | void | クリップボードへコピー |

### 6.3 `app.js`

状態とイベントハンドラを集約：

```javascript
// State
let activeCategory = 'all';
let activeTags = new Set();
let searchQuery = '';
let openIds = new Set();

// Helpers
function debounce(fn, ms) { /* ... */ }

// URL state
function updateUrl() { /* ?cat=&q=&tags= */ }
function readUrlState() { /* 復元 */ }

// Filtering
function getFilteredParts() { /* cat AND tag AND search */ }
function getGroupedParts(filtered) { /* カテゴリ単位にグループ */ }
function computeSidebarCounts() { /* tag + search 反映の動的件数 */ }

// Rendering
function renderParts() { /* パーツ一覧 */ }
function renderPartsWithSwitchAnimation() { /* + .is-switching */ }
function renderSidebarFresh() { /* サイドバー全描画 */ }
function renderTagsFresh() { /* タグチップ全描画 */ }
function updateSidebarCounts() { /* 件数のみ軽量更新 */ }
function renderCounts() { /* ヘッダー / フッター */ }
function updateTagClearVisibility() { /* クリアボタン表示制御 */ }

// Card open/close (DOM-only)
function setCardOpen(card, headerBtn, isOpen) { /* class + ARIA */ }
function setCardOpenWithFlip(card, headerBtn, isOpen) { /* + FLIP */ }

// Keyboard shortcuts
function openShortcutModal() / closeShortcutModal()

// Initialize
readUrlState();
renderSidebarFresh();
renderTagsFresh();
renderParts();
renderCounts();
```

### 6.4 イベントハンドリング

イベント委譲（event delegation）を採用。各カードに個別ハンドラなし。

| 要素 | イベント | 処理 |
|---|---|---|
| `sidebarNavEl` | click | カテゴリ切替（disabled なら無視） |
| `tagFilterEl` | click | タグの Set 操作 + URL 更新 |
| `tagClearEl` | click | activeTags クリア |
| `searchInputEl` | input | searchQuery 更新 + デバウンス再描画 |
| `searchClearEl` | click | 検索クリア |
| `partsContainerEl` | click | カード開閉（FLIP）/ コピー / 空状態アクション |
| `expandAllEl` / `collapseAllEl` | click | 一括開閉 |
| `document` | keydown | キーボードショートカット |
| `shortcutModalEl` | click | モーダル閉じる |

---

## 7. パフォーマンス最適化

### 7.1 `content-visibility: auto`

```css
.part-card {
  content-visibility: auto;
  contain-intrinsic-size: auto 80px;
}
.part-card--open {
  content-visibility: visible;
  contain-intrinsic-size: none;
}
```

画面外カードの paint / layout を browser がスキップ。仮想スクロール相当の効果を CSS だけで実現。

### 7.2 font-metric override（CLS 削減）

```css
@font-face {
  font-family: 'IBM Plex Sans Fallback';
  src: local('Arial'), local('Helvetica');
  size-adjust: 105%;
  ascent-override: 95%;
  descent-override: 24%;
  line-gap-override: 0%;
}
```

fallback フォントを Plex のメトリックに整形 → フォント swap でレイアウトがピクセル単位で揃う → CLS 0.874 → 0。

### 7.3 Critical CSS インライン化

`base.css` 全文を `index.html` の `<style>` に直書き → render-blocking なリクエストが 1 つ削減 → LCP / FCP -0.7〜0.8s。

### 7.4 FLIP アニメーション（カード開閉時の sibling 移動）

```javascript
function setCardOpenWithFlip(card, headerBtn, isOpen) {
  // First: 他カードの top を記録
  // Last: クラス変更で layout 即時更新
  // Invert: 各カードに transform: translateY(差分) で逆転
  // Play: transition で 0 まで戻す
}
```

`transform / opacity のみ` の skills 規則を厳守したまま、layout 変化を滑らかに見せる。

### 7.5 検索デバウンス

```javascript
const debouncedSearchRender = debounce(() => {
  renderParts();
  updateSidebarCounts();
  updateUrl();
}, 200);
```

連打時の DOM 再描画負荷を軽減。

---

## 8. アクセシビリティ実装

### 8.1 実装済み（WCAG 2.1 AA）

| 項目 | 実装場所 |
|---|---|
| Skip link | `<a href="#main-content" class="skip-link">` |
| キーボード操作 | カードヘッダーが `<button>` |
| `aria-expanded` | カード開閉状態 |
| `aria-controls` | カード body の id を関連付け |
| `aria-pressed` | サイドバー / タグの選択状態 |
| `aria-label` | 検索クリア・コードコピー等の icon-only ボタン |
| `aria-live` | 結果件数 |
| `aria-modal` / `aria-labelledby` | ショートカット モーダル |
| `aria-hidden` | 装飾アイコン（`▸` `⌕` `[LAY]` `#` 等） |
| `:focus-visible` | 全インタラクティブ要素 |
| `prefers-reduced-motion` | `<style>` 内のメディアクエリで全アニメ短縮 |
| セマンティック HTML | `<aside>` / `<nav>` / `<main>` / `<article>` / `<section>` / `<dl>` / `<kbd>` |
| `<label class="visually-hidden">` | 検索入力の隠しラベル |
| コントラスト 4.5:1 | テキスト全 WCAG AA |

### 8.2 タブ順序

1. Skip link
2. 検索入力 → 検索クリアボタン
3. タグチップ → クリアボタン
4. サイドバーの各カテゴリボタン
5. すべて開く / 閉じる
6. パーツカードヘッダー（順次）
7. 開いたカード内のコピーボタン

---

## 9. パーツ追加ガイド

### 9.1 既存カテゴリへの追加

1. `js/data.js` の `PARTS` 配列に新オブジェクトを追加
2. `id` は既存と重複しないケバブケースで命名
3. `category` は `CATEGORIES` の id を指定
4. `sampleHtml` は **Crisp Mono パレット**で記述（紫禁止）
5. `TAG_ASSIGNMENTS` に該当タグを追加
6. `USE_NOTES` に推奨 / 回避メモ（30〜60 字）を追加

### 9.2 新規カテゴリの追加

1. `CATEGORIES` 配列に `{ id, label, en, prefix }` を追加
2. `prefix` は 3 文字の英大文字（既存と重複させない）
3. 対応するパーツの `category` に新 id を設定

### 9.3 新規タグの追加

1. `TAGS` 配列に `{ id, label }` を追加
2. 該当する `TAG_ASSIGNMENTS` のエントリに新 id を含める

### 9.4 コード例

```javascript
// 新規パーツの追加例
{
  id: "tooltip-rich",
  ja: "リッチツールチップ",
  en: "Rich Tooltip",
  category: "content",
  desc: "画像やリンクを含むツールチップ。ヘルプアイコンの拡張版。",
  html: `<div class="tooltip-rich">\n  <h4>タイトル</h4>\n  <p>本文…</p>\n</div>`,
  sampleHtml: `<div style="...">…</div>`,
}

// TAG_ASSIGNMENTS に追加
"tooltip-rich": ["admin","saas","blog"],

// USE_NOTES に追加
"tooltip-rich": {
  useWhen:   "アイコン横で詳細情報やリッチコンテンツを表示したい場面。",
  avoidWhen: "短文の補足ならツールチップ（通常版）の方が軽い。"
}
```

---

## 10. ビジュアルサンプルの制作方針

### 10.1 基本ルール

- 全てのサンプルは **インラインスタイルを含む HTML 文字列** で記述
- 外部画像は使用せず、**CSS グラデーション・Unicode 文字・SVG** で代用
- サンプルは実際の見た目の **簡略化されたミニチュア版**
- インタラクティブ要素は静的な見た目で表現

### 10.2 カラールール

- **Crisp Mono パレット**のみ使用：`#0a0a0a` / `#525252` / `#737373` / `#a3a3a3` / `#d4d4d4` / `#e5e5e5` / `#f4f4f5` / `#fafafa` / `#1a1a1a` / `#ffffff`
- 例外（**意味的に必要な場合のみ**）：
  - 赤 `#ee5555`: エラー・削除アクション
  - 緑 `#4a6b3d`: 成功
  - 黄 `#f59e0b`: 警告
- 紫・青・ピンク等の装飾色は禁止

### 10.3 ユーティリティクラス（`sections.css`）

```css
.sample-flex      /* display: flex; align-items: center; gap: 8px */
.sample-flex-col  /* display: flex; flex-direction: column; gap: 8px */
.sample-center    /* display: flex; align-items: center; justify-content: center */
.sample-box       /* border-radius: 8px; border: 1px solid */
.sample-text-muted/* font-size: 11px; color: muted */
.sample-label     /* font-size: 11px; font-weight: 600 */
.anim-spin        /* spin keyframe animation */
.anim-pulse       /* pulse keyframe animation */
.sample-gradient-soft  /* light grayscale gradient */
```

---

## 11. 既知の制約

| 項目 | 内容 |
|---|---|
| `content-visibility: auto` | Safari 18 未満では効かない（表示は壊れず最適化のみ無効） |
| 古い Safari の Find（Ctrl+F） | `content-visibility: auto` 要素の Find は Chrome 113+ で改善済み、古い環境では制限あり |
| Google Fonts セルフホスト | フォント更新は手動 |
| `prefers-reduced-motion` | OS 設定依存 |
| サンプルのインラインスタイル | data.js が大きい（約 180KB）。gzip で大幅圧縮可能 |

---

## 12. 管理ドキュメント一覧

| ファイル | 用途 | 更新タイミング |
|---|---|---|
| [`README.md`](../README.md) | プロジェクト玄関口（5 行サマリ + リンク） | 仕様変更時 |
| [`docs/project-summary.md`](project-summary.md) | プロジェクト仕様書（正本） | 機能 / 仕様変更時 |
| [`docs/technical-guide.md`](technical-guide.md) | 技術仕様書（本ファイル） | 技術的変更時 |
| [`docs/web-design-parts-list.md`](web-design-parts-list.md) | 全パーツ一覧 | パーツ追加・変更時 |
| [`docs/work-log.md`](work-log.md) | 作業ログ（時系列） | 作業完了時 |
| [`CLAUDE.md`](../CLAUDE.md) | エージェント向け指示 | 方針変更時 |

---

*最終更新: 2026年5月6日 — 200 パーツ完備、Lighthouse Performance 92・Accessibility 100 達成*
