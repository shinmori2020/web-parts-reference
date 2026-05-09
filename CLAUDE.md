# web-parts-reference

WEBデザインパーツの名称・用途・コード例をまとめたリファレンスサイト。  
**全 200 パーツ / 11 カテゴリ / 9 タグ収録**

---

## 必須：作業前にスキルを読むこと

**すべての作業を開始する前に、以下のスキルファイルを必ず読んでください。**  
スキルを読まずにコードの作成・編集を行うことは禁止です。

```
.claude/skills/frontend-design/
.claude/skills/ui-designer/
.claude/skills/interface-design/
.claude/skills/accessibility/
.claude/skills/best-practices/
.claude/skills/performance/
.claude/skills/seo/
.claude/skills/core-web-vitals/
.claude/skills/web-quality-audit/
.claude/skills/web-design-builder/
```

### スキルの読み方

1. 作業開始時に **全スキルフォルダ内の SKILL.md（または該当ファイル）を読む**
2. 作業内容に応じて **特に関連の深いスキルを重点的に参照** する
3. 判断に迷った場合は **スキルの指針に従う**

### スキルと作業の対応

| 作業内容 | 重点参照スキル |
|----------|-------------|
| HTML/CSS/JSの実装 | `frontend-design`, `best-practices` |
| UIコンポーネントの作成 | `ui-designer`, `interface-design` |
| ビジュアルサンプルの制作 | `ui-designer`, `frontend-design` |
| アニメーション・トランジション | `performance`, `core-web-vitals` |
| レスポンシブ対応 | `frontend-design`, `interface-design` |
| HTMLの構造設計 | `accessibility`, `seo` |
| 品質チェック・レビュー | `web-quality-audit`, `best-practices` |
| サイト全体の構築 | `web-design-builder` |

---

## デザインシステム：Crisp Mono

完全モノクロ・フラットデザイン。詳細は `docs/technical-guide.md` 参照。

| 項目 | 値 |
|---|---|
| Aesthetic | Crisp Mono（モダンフラット） |
| Intent | 作業場のような実用感 + カタログのような選びやすさ |
| 背景 | `#ffffff`（純白） |
| テキスト | `#0a0a0a` / `#525252` / `#737373` / `#a3a3a3`（4階調） |
| 罫線 | `#e5e5e5` / `#d4d4d4` |
| アクセント色 | **なし**（active state は黒インバート `#1a1a1a`） |
| Signature | 括弧付き monospace prefix タグ `[LAY]` |
| フォント | IBM Plex Sans / IBM Plex Mono（Google Fonts） |
| 角丸 | 6px（モダンフラット） |

### レイアウト：1 + 3 + 4 構成

- **案1（Sidebar）**: 左に sticky なカテゴリナビ（200px 幅）
- **案3（Grid）**: メイン領域は 2 カラムグリッドで閉じたカード並べ
- **案4（Internal split）**: 開いたカードは行を独占し、内部を「説明+見本 / コード」の 2 分割

モバイル（768px↓）: サイドバーが上部の横スクロールチップに変形、カードは 1 カラム  
モバイル（480px↓）: 開時の内部 2 分割が縦並びに

---

## 技術構成

- **HTML / CSS / JavaScript**（素の構成、フレームワーク不使用）
- **外部依存**: Google Fonts（IBM Plex Sans / IBM Plex Mono）のみ
- **対応ブラウザ**: モダン（Chrome 111+ / Firefox 113+ / Safari 16.2+）— CSS Grid / `aspect-ratio` / `:focus-visible` / `prefers-reduced-motion` / `inert` 相当のモダン機能を使用

---

## ディレクトリ構成

```
web-parts-reference/
├── .claude/
│   └── skills/            ← スキルファイル（作業前に必読）
│       ├── accessibility/
│       ├── best-practices/
│       ├── core-web-vitals/
│       ├── frontend-design/
│       ├── interface-design/
│       ├── performance/
│       ├── seo/
│       ├── ui-designer/
│       ├── web-design-builder/
│       └── web-quality-audit/
├── css/
│   ├── components.css     ← レイアウト・サイドバー・カード・コードブロック等
│   ├── sections.css       ← ビジュアルサンプル内のユーティリティ
│   └── responsive.css     ← レスポンシブ対応（768px / 480px ブレークポイント）
│   (注: 基底トークン・@font-face・リセット・skip link は index.html の <style> にインライン化済み)
├── js/
│   ├── data.js            ← CATEGORIES (12) + TAGS (9) + PARTS (200) + TAG_ASSIGNMENTS + USE_NOTES
│   ├── components.js      ← renderSidebar / renderPartCard / renderCategoryGroup
│   └── app.js             ← フィルター・検索・カード開閉・サイドバー件数同期
├── docs/
│   ├── project-summary.md   ← プロジェクト仕様書
│   ├── technical-guide.md   ← 技術仕様書（実装ガイド）
│   ├── web-design-parts-list.md  ← 全137パーツ一覧
│   └── work-log.md          ← 作業ログ（作業後に更新すること）
├── images/
├── .gitignore
├── CLAUDE.md              ← 本ファイル（最初に読むこと）
└── index.html
```

---

## コーディングルール

### HTML
- セマンティックなタグを使用（`<header>`, `<main>`, `<nav>`, `<section>`, `<article>`, `<aside>` 等）
- ARIA 属性を適切に付与（`aria-expanded`, `aria-controls`, `aria-pressed`, `aria-label`, `aria-live` 等）
- `lang="ja"` を設定
- Skip link（`<a href="#main-content">`）を `<body>` 直下に配置
- 装飾的アイコンには `aria-hidden="true"`

### CSS
- CSS 変数（カスタムプロパティ）は `index.html` の `<style>` 内の `:root` で一元管理（Critical CSS としてインライン化）
- クラス名は **BEM 風命名規則**（Block: `.part-card` / Element: `.part-card-header` / Modifier: `.part-card--open`）
- インラインスタイルは `data.js` のビジュアルサンプル内のみ許可
- **アニメーションは `transform` と `opacity` のみ**使用（CLAUDE.md / core-web-vitals 規則）
- トランジションは 0.12〜0.5s の範囲（カテゴリ切替アニメ最終要素のみ 0.5s 許容）
- `prefers-reduced-motion: reduce` を尊重（base.css でグローバルに適用済み）
- `:focus-visible` で全インタラクティブ要素にフォーカスリング
- カラー：純モノクロのみ。アクセント色は使わない

### JavaScript
- `const` / `let` を使用（`var` 禁止）
- DOM 操作はイベント委譲（event delegation）パターンを優先
- 状態管理は `app.js` に集約
- データは `data.js` に集約
- 描画関数は `components.js` に集約
- カード開閉・フィルター切替は **DOM 全再描画ではなく対象要素のみクラス更新**（CSSアニメを動作させるため）

---

## パーツデータの追加方法

`js/data.js` の `PARTS` 配列に以下の形式でオブジェクトを追加する：

```javascript
{
  id: "part-id",            // ケバブケースで一意に
  ja: "パーツ名",            // 日本語名
  en: "Part Name",          // 英語名
  category: "layout",       // CATEGORIES のいずれかの id
  desc: "説明文。",          // 30〜80字の用途解説
  html: `<div>…</div>`,    // HTMLコード例（テンプレートリテラル）
  sampleHtml: `<div>…</div>`,  // ビジュアルサンプル用 HTML
}
```

### サンプル制作のガイドライン
- **Crisp Mono パレットのみ**使用（`#0a0a0a` / `#525252` / `#737373` / `#a3a3a3` / `#d4d4d4` / `#e5e5e5` / `#f4f4f5` / `#fafafa` / `#1a1a1a`）
- セマンティック色（赤=エラー / 緑=成功 / 黄=警告）は意味を伝える必要がある場面のみ
- インラインスタイルで完結させる（外部 CSS は避ける）
- `sections.css` のユーティリティクラス（`.sample-flex`, `.sample-box` 等）を活用

### カテゴリの追加方法

`js/data.js` の `CATEGORIES` 配列に以下を追加：

```javascript
{
  id: "new-category",       // ケバブケースで一意に
  label: "新カテゴリ",        // 日本語表示名
  en: "New Category",       // 英語表示名
  prefix: "NEW",            // 3 文字の英大文字略称（カード上のタグ表示）
}
```

---

## 作業ログ

作業完了後は `docs/work-log.md` に以下を記録すること：
- 作業日（YYYY-MM-DD）
- 実施内容（経緯・方針判断含む）
- 変更したファイル（パス一覧）
- 維持した skills 準拠ポイント
- 次回の作業予定
