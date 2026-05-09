# WEB Design Parts Reference — プロジェクト仕様書（正本）

WEBデザインパーツの名称・用途・コード例をまとめた **辞典・カタログ型** リファレンスサイト。  
**全 200 パーツ / 11 カテゴリ / 9 タグ収録**

---

## 1. プロジェクト概要

### 1.1 目的
WEB 制作に携わる人が、パーツの **正式名称・用途・見た目・コード** をすぐに確認できる辞典・カタログ型サイトを提供する。

### 1.2 想定利用者
- Web デザイナー・フロントエンド開発者
- Web 制作の学習者・教育者
- パーツ命名やパターンに迷ったとき調べたい人

### 1.3 利用シーン
- 制作中の素早い参照
- 「これ何ていうパーツ？」の用語確認
- HTML 雛形の取得・コピー
- サイトタイプ別に「必要なパーツ群」を俯瞰

---

## 2. デザインシステム：Crisp Mono

### 2.1 美学方針

| 項目 | 値 |
|---|---|
| 名称 | Crisp Mono（完全モノクロ・モダンフラット） |
| Intent | 作業場のような実用感 + カタログのような選びやすさ |
| Signature | 括弧付き monospace prefix タグ `[LAY]` |

### 2.2 カラートークン

| 用途 | 値 |
|---|---|
| 背景 | `#ffffff`（純白） |
| サーフェス 2（ホバー等） | `#fafafa` |
| サーフェス 3（コードブロック） | `#f4f4f5` |
| テキスト primary | `#0a0a0a` |
| テキスト secondary | `#525252` |
| テキスト muted | `#737373`（WCAG AA 4.6:1） |
| テキスト faint（装飾のみ） | `#a3a3a3` |
| 罫線 | `#e5e5e5` / `#d4d4d4` |
| アクセント色 | **なし**（active state は黒インバート `#0a0a0a`） |
| セマンティック例外 | エラー赤 `#ee5555` / 成功緑 `#4a6b3d` / 警告黄 `#f59e0b`（必要箇所のみ） |

### 2.3 タイポグラフィ

- sans: **IBM Plex Sans**（variable font）+ Hiragino Sans / Yu Gothic / Noto Sans JP
- mono: **IBM Plex Mono**（400/500/600）+ SF Mono / Consolas
- すべて Google Fonts からダウンロードしてセルフホスト（合計 91KB）
- fallback フォント（Arial / Consolas）には `size-adjust` / `ascent-override` 等で metric を Plex に整形 → CLS 削減

### 2.4 レイアウト・装飾規則

| 項目 | 値 |
|---|---|
| 角丸 | 6px（モダンフラット） |
| 影 | 原則使用しない |
| 罫線 | 1px の hairline のみ |
| アニメ | `transform` / `opacity` のみ（CLAUDE.md / core-web-vitals 準拠） |
| `prefers-reduced-motion` | 全アニメ短縮で対応 |

---

## 3. レイアウト構成（1 + 3 + 4）

```
┌─────────────────────────────────────────────────────────┐
│ Header (white, 1px bottom border)                        │
└─────────────────────────────────────────────────────────┘
┌──────────┬──────────────────────────────────────────────┐
│          │ Search bar (⌕ icon)                           │
│ SIDEBAR  │ #ランディング #ECサイト ...  × クリア          │
│ (sticky) │ Controls (件数 / すべて開く・閉じる)           │
│ ALL  200 │                                                │
│ LAY  19  │ [LAY] レイアウト                               │
│ NAV  19  │ ┌─────────────┐ ┌─────────────┐              │
│ ...      │ │ ヘッダー [LAY]│ │ フッター [LAY]│ ← 2カラムGrid│
│          │ └─────────────┘ └─────────────┘              │
│          │ ┌──────────────────────────────────────────┐ │
│          │ │ ヒーロー [LAY] ▼   全幅 + 内部 2 分割    │ │
│          │ │┌──────────┬──────────────────────┐       │ │
│          │ ││説明 + 見本│ <div>HTMLコード</div>│       │ │
│          │ │└──────────┴──────────────────────┘       │ │
│          │ └──────────────────────────────────────────┘ │
└──────────┴──────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│ Footer                                                   │
└─────────────────────────────────────────────────────────┘
```

### 3.1 主要寸法

| 領域 | サイズ |
|---|---|
| 全体 max-width | 1400px |
| サイドバー | 220px（sticky） |
| メインカラム | 残り（最大 ~1148px） |
| カード（閉時） | 2 カラムグリッド（各 ~570px） |
| カード（開時） | 行を独占 + 内部「説明+見本 / コード」の 2 分割 |

### 3.2 レスポンシブ

| ブレークポイント | サイドバー | カード | 開時 2 分割 |
|---|---|---|---|
| 769px〜（Desktop） | 縦並び・sticky | 2 カラム | 横 2 分割 |
| 481〜768px（Tablet） | 横スクロールチップ | 1 カラム | 横 2 分割 |
| 〜480px（Mobile） | 横スクロールチップ | 1 カラム | 縦並びにフォールバック |

---

## 4. 機能一覧

### 4.1 4 軸の絞り込み

| 軸 | 仕様 |
|---|---|
| **カテゴリ**（構造別） | サイドバー単一選択。LAY / NAV / FRM / CNT / FBK / DEC / MED / COM / SOC / DAT / TYP の 11 個。サイドバーには件数も動的表示 |
| **タグ**（用途別、複数選択 AND） | 検索バー直下のチップ群。クリックで Set にトグル追加。クリアボタンで全解除。9 個のサイトタイプ |
| **検索**（キーワード） | ja / en / desc を横断検索。`200ms` デバウンス。マッチ部分を `<mark>` でハイライト |
| **URL 状態保持** | `?cat=&q=&tags=` で永続化、ブックマーク・共有・戻る/進むに対応 |

### 4.2 タグ一覧（9 個）

| ID | ラベル | 想定パーツ |
|---|---|---|
| `landing` | ランディング | hero, testimonial, pricing, scroll-animation |
| `ec` | ECサイト | product-card, cart-icon, wishlist, color-swatch |
| `admin` | 管理画面 | sidebar, table, KPI cards, command-palette |
| `saas` | SaaS | pricing, login, fab, KPI |
| `blog` | ブログ | blockquote, code-block, comments, drop-cap |
| `portfolio` | ポートフォリオ | gallery, lightbox, masonry, before-after |
| `corporate` | コーポレート | hero, embedded-map, testimonial |
| `media` | メディア | video-embed, audio-player, ranking |
| `community` | コミュニティ | chat-ui, like-button, profile, mention |

### 4.3 アコーディオン挙動（B 案 + FLIP）

| 機能 | 仕様 |
|---|---|
| 開閉 | クリック / Enter / Space で `.part-card--open` をトグル |
| 開時アニメ | 中身が translateY(-10px → 0) + opacity フェードイン（0.32s） |
| 中身スタガー | 説明 → 見本 → コードが順次フェード（0.04 / 0.10 / 0.16s 遅延） |
| 下カードの動き | **FLIP テクニック**で `transform: translateY()` で滑らかに押し下げ |
| カテゴリ切替 | カテゴリグループが順次フェードイン（最大 0.5s） |

### 4.4 マイクロインタラクション

すべて `transform` / `opacity` のみ使用：

| 対象 | 動き | duration |
|---|---|---|
| カード hover（PC のみ） | translateY(-2px) | 0.18s |
| トグル `▸` | 90°回転（slight overshoot） | 0.32s |
| フィルター/タグ/コピー押下 | scale(0.96 / 0.94) | 0.12s |

### 4.5 キーボードショートカット

| キー | 動作 |
|---|---|
| `/` | 検索バーへフォーカス + テキスト全選択 |
| `Esc` | 検索クリア + フォーカス解除 / モーダル閉じる |
| `Shift + E` | すべて開く |
| `Shift + C` | すべて閉じる |
| `?` | ショートカット一覧モーダル表示 |

入力欄フォーカス中は `Esc` 以外無効。

### 4.6 コードコピー / シンタックスハイライト

- ワンクリックで HTML コードをクリップボードにコピー、"Copied" 表示 1.5 秒
- シンタックスハイライトは **外部ライブラリ無しのカスタム vanilla 実装**
- 色を使わず font-weight + opacity でタグ・属性・値・コメントを区別

### 4.7 検索結果ハイライト
検索ヒット部分を `<mark class="hl-match">` でラップ、控えめな黒透過背景。

### 4.8 空状態リッチ化
0 件時：「条件を緩めると見つかるかも」+「検索を解除」「タグを N 個解除」「カテゴリリセット」のサジェストボタン。

### 4.9 各パーツが提供する情報

| フィールド | 型 | 例 |
|---|---|---|
| `id` | string (kebab-case) | `"product-card"` |
| `ja` | string | `"商品カード"` |
| `en` | string | `"Product Card"` |
| `category` | string | `"ecommerce"` |
| `desc` | string (30〜80字) | 用途解説 |
| `html` | string | HTML コード例 |
| `sampleHtml` | string | ビジュアルサンプル HTML |
| `tags` | string[] | `["ec"]` |
| `useWhen` | string (30〜60字) | 推奨される場面 |
| `avoidWhen` | string (30〜60字) | 避けるべき場面 |

---

## 5. アクセシビリティ（WCAG 2.1 Level AA）

| 機能 | 説明 |
|---|---|
| Skip link | "メインコンテンツへスキップ" — Tab キーで表示 |
| キーボード操作 | カードヘッダーが `<button>` のため Tab + Enter / Space で開閉 |
| ARIA 属性 | `aria-expanded` / `aria-controls` / `aria-pressed` / `aria-label` / `aria-live` / `aria-modal` / `aria-labelledby` / `aria-hidden` |
| disabled | 件数 0 のサイドバー項目を disabled で表示 |
| `:focus-visible` | 全インタラクティブ要素に黒 outline |
| `prefers-reduced-motion` | OS 設定で「動きを減らす」を尊重し全アニメを 0.01ms に短縮 |
| セマンティック HTML | `<aside>` / `<nav>` / `<article>` / `<section>` / `<header>` / `<main>` / `<dl>` / `<kbd>` |
| 視覚的隠蔽 | `.visually-hidden` でスクリーンリーダー専用ラベル |
| コントラスト | 全テキストが WCAG AA 4.5:1 以上を達成 |

→ **Lighthouse Accessibility スコア 100 達成**

---

## 6. パフォーマンス

### 6.1 Lighthouse 実測値（ローカル http-server 環境）

| 領域 | スコア |
|---|---:|
| **Performance** | 92 |
| **Accessibility** | 100 |
| Best Practices | 96+ |
| **SEO** | 100 |
| LCP | 2.9s |
| **CLS** | **0** |
| **TBT** | **0ms** |
| FCP | 2.3s |

### 6.2 主要な最適化手法

| 手法 | 効果 |
|---|---|
| `content-visibility: auto` | 画面外カードの paint / layout を完全スキップ（仮想スクロール相当） |
| `contain-intrinsic-size: auto 80px` | 仮想化時のレイアウト推定サイズ |
| Critical CSS インライン化 | render-blocking 解消 |
| font-metric override（fallback） | フォント swap CLS をゼロに |
| 検索 200ms デバウンス | 連打時の DOM 再描画負荷軽減 |
| カード開閉は class 切替のみ | DOM 全再描画なし、CSS アニメ動作 |
| イベント委譲 | 各カードに個別ハンドラなし |
| FLIP アニメ | 仮想スクロール不要で滑らかな layout 変化 |
| Google Fonts セルフホスト | CDN 依存解消、preload で初回描画前読込 |

---

## 7. 技術仕様

### 7.1 技術スタック

| 項目 | 内容 |
|---|---|
| フレームワーク | **なし**（vanilla HTML / CSS / JavaScript） |
| ビルド工程 | **なし**（ファイルをそのまま配信） |
| 外部 JS ライブラリ | **0 件** |
| 外部依存 | Google Fonts（IBM Plex Sans / Mono、ファイルはセルフホスト） |
| 対応ブラウザ | Chrome 111+ / Firefox 113+ / Safari 16.2+ |

### 7.2 ファイル構成

```
web-parts-reference/
├── README.md                      ← プロジェクト玄関口
├── index.html                     ← Critical CSS + OGP インライン化済み
├── favicon.svg                    ← 黒地に [] ブラケット
├── images/
│   └── og.svg                     ← 1200×630 OGP カード
├── fonts/                         ← セルフホスト IBM Plex（合計 91KB）
│   ├── plex-sans-var.woff2       (45KB, variable, 4 weights)
│   ├── plex-mono-400.woff2       (15KB)
│   ├── plex-mono-500.woff2       (15KB)
│   └── plex-mono-600.woff2       (16KB)
├── css/
│   ├── components.css             ← 全コンポーネント
│   ├── sections.css               ← サンプル用ユーティリティ
│   └── responsive.css             ← 768px / 480px ブレークポイント
├── js/
│   ├── data.js                    ← CATEGORIES + TAGS + PARTS + TAG_ASSIGNMENTS + USE_NOTES
│   ├── components.js              ← renderXxx + escapeHtml + highlightMatch + highlightHtml + copyCode
│   └── app.js                     ← state / debounce / URL / FLIP / shortcuts / handlers
├── docs/
│   ├── project-summary.md         ← 本ファイル（プロジェクト仕様書・正本）
│   ├── technical-guide.md         ← 技術仕様書（実装ガイド）
│   ├── web-design-parts-list.md   ← パーツ一覧表
│   └── work-log.md                ← 作業ログ（時系列）
├── .claude/skills/                ← 10 個のスキルファイル（必読）
└── CLAUDE.md                      ← エージェント向け指示
```

---

## 8. コンテンツ構成

### 8.1 カテゴリ別件数（11 カテゴリ・全 200 パーツ）

| No. | カテゴリ名 | 英語名 | prefix | 件数 |
|-----|-----------|--------|--------|-----:|
| 1 | レイアウト | Layout | LAY | 19 |
| 2 | ナビゲーション | Navigation | NAV | 19 |
| 3 | フォーム | Form | FRM | 25 |
| 4 | コンテンツ | Content | CNT | 27 |
| 5 | フィードバック | Feedback | FBK | 16 |
| 6 | 装飾 | Decoration | DEC | 19 |
| 7 | メディア | Media | MED | 13 |
| 8 | Eコマース | E-commerce | COM | 17 |
| 9 | ソーシャル | Social | SOC | 13 |
| 10 | データ表示 | Data Display | DAT | 17 |
| 11 | タイポグラフィ | Typography | TYP | 15 |
| | **合計** | | | **200** |

→ 全パーツの一覧は [`docs/web-design-parts-list.md`](web-design-parts-list.md) 参照（仕様書版は 137 件、追加 63 件は data.js で管理）。

---

## 9. 制作経緯

| 日付 | 内容 |
|------|------|
| 2026-04-15 | 要件ヒアリング・初版（React / 6カテゴリ・30件）→ 11カテゴリ・75件に拡張 |
| 2026-05-05 | 素のHTML/CSS/JSへの再構築。基本機能実装（35件） |
| 2026-05-05 | デザイン改善 Phase 1 実装（紫グラデ + パステル11色） |
| 2026-05-05 | スキル準拠リファクタ（B案アコーディオン / a11y / BEM） |
| 2026-05-05 | デザイン方向性見直し → Catalog Workbench 試作 → 「古い」と評価され破棄 |
| 2026-05-05 | **Crisp Mono（完全モノクロ）採用** |
| 2026-05-05 | アニメーション追加・紫の全廃 |
| 2026-05-06 | レイアウト全面改修：1（Sidebar）+ 3（Grid）+ 4（Internal split） |
| 2026-05-06 | 残102パーツを追加し全 137 パーツ完備 |
| 2026-05-06 | ドキュメント整合性修正（CLAUDE.md / project-summary / technical-guide） |
| 2026-05-06 | タグ機能追加（9 タグ）・FLIP アニメ・タグ多重選択（AND）・フォントセルフホスト |
| 2026-05-06 | 11 機能追加（デバウンス・URL state・空状態・検索ハイライト・シンタックス・ショートカット・推奨/回避メモ・favicon・OGP）、a11y 100 点達成 |
| 2026-05-06 | Performance 改善（content-visibility / font-metric / Critical CSS）：35 → **92** |
| 2026-05-06 | Dead code 整理（未使用ファイル・クラス・変数の削除） |
| 2026-05-06 | 標準拡張：63 件追加し**全 200 パーツ**達成 |

---

## 10. 残タスク

### 🟡 中優先度
- [ ] GitHub にプッシュ → Pages デプロイ
- [ ] `docs/web-design-parts-list.md` を 200 件版に拡張

### 🟢 低優先度（あれば嬉しい）
- [ ] ダークモード対応
- [ ] 印刷スタイル（print 用 CSS）
- [ ] i18n（英語 UI 切替）
- [ ] お気に入り機能（localStorage）
- [ ] 複数言語のコード例（HTML だけでなく Vue / React 等）
- [ ] 自動テスト（vitest 等）
- [ ] アナリティクス（Plausible 等）

---

## 11. ドキュメント体系

| ファイル | 役割 | 更新タイミング |
|---|---|---|
| [README.md](../README.md) | プロジェクトの玄関口（5 行サマリ + リンク） | 仕様変更時 |
| [docs/project-summary.md](project-summary.md) | **プロジェクト仕様書（本ファイル）** | 機能 / 仕様変更時 |
| [docs/technical-guide.md](technical-guide.md) | 技術仕様書・実装ガイド | 技術的変更時 |
| [docs/web-design-parts-list.md](web-design-parts-list.md) | パーツ一覧表 | パーツ追加・変更時 |
| [docs/work-log.md](work-log.md) | 作業ログ（時系列） | 作業完了時 |
| [CLAUDE.md](../CLAUDE.md) | エージェント向け指示 / スキル参照 | 方針変更時 |

---

*最終更新: 2026年5月6日 — 200 パーツ完備、Lighthouse Performance 92 達成*
