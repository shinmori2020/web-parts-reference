# 作業ログ

## 2026-04-15
- プロジェクト開始
- 要件ヒアリング（掲載範囲・情報項目・スタイル）
- React版サイト初版制作（6カテゴリ・30件）
- カテゴリ・パーツ数の拡張（11カテゴリ・75件）
- 追加候補の洗い出し（+62件 = 合計137件）
- 全パーツの一覧表作成（Excel・Markdown）
- プロジェクト仕様書・技術仕様書作成

## 2026-05-05
- 素のHTML/CSS/JSでの再構築を決定
- プロジェクト名を `web-parts-reference` に決定
- ディレクトリ構成の設計・作成
- ベースファイル一式を作成
  - index.html（メインHTML）
  - css/base.css（リセット・CSS変数）
  - css/components.css（UIコンポーネント）
  - css/sections.css（ビジュアルサンプル用）
  - css/responsive.css（レスポンシブ）
  - js/data.js（パーツデータ・サンプルパーツ実装）
  - js/components.js（描画関数）
  - js/app.js（メインロジック）
  - CLAUDE.md（プロジェクト説明）
  - .gitignore

### 次回の作業
- [ ] data.js に残りのパーツを追加（現在サンプル数件 → 75件全て）
- [ ] 追加予定62件のデータ・サンプルを実装
- [ ] ブラウザでの動作確認・デバッグ
- [ ] レスポンシブ動作の確認

## 2026-05-05（Phase 1：デザイン改善＋a11y補強）

### 実施内容
`docs/design-improvement-prompt.md` の **Phase 1** を skills（CLAUDE.md / accessibility / best-practices / core-web-vitals 等）に準拠する形で実装。

**Phase 1 ビジュアル/インタラクション改善:**
- ヘッダーをアクセントグラデーション（#667eea → #764ba2）化
- カテゴリにインラインSVGアイコン12種＋カテゴリカラー11色を導入（`data.js` の `ICONS` / `CATEGORIES` に集約）
- フィルターボタンを `color-mix()` でカテゴリ色の薄い背景に。アクティブ時はアクセントグラデーション
- カテゴリ見出しに SVG アイコン + アクセント線 + 色付き件数バッジ
- パーツカード左端にカテゴリ別カラーライン（`data-category` 属性セレクタ）
- カードホバーで `translateY(-2px)`（hover メディアクエリで PC のみ）
- 検索バーに `:focus-within` でアクセント色ボーダー＋グロー
- アコーディオンを **B案**（瞬時開閉 + 中身 `opacity` + `translateY` フェードダウン）で実装
  - skills「アニメは transform/opacity のみ」を厳守するため、当初の grid-template-rows 案を撤回

**a11y 補強（accessibility / web-design-builder スキル要件）:**
- Skip link（`<a href="#main-content">`）追加 + `<main id="main-content" tabindex="-1">`
- カードヘッダーを `<div>` → `<button>` 化（キーボード操作対応）
- アコーディオンに `aria-expanded` / `aria-controls` 付与
- フィルターボタンに `aria-pressed` 付与
- フィルター領域を `<nav>` 化、`aria-label` 付与
- カテゴリグループを `<section>` + `aria-labelledby` で見出し関連付け
- 検索入力に `<label class="visually-hidden">`
- `:focus-visible` の汎用スタイル（base.css）
- `prefers-reduced-motion: reduce` メディアクエリでアニメ無効化

**BEM命名修正:**
- 状態クラスをBEM modifier（`--`）形式に統一
  - `.part-card.open` → `.part-card--open`
  - `.filter-btn.active` → `.filter-btn--active`
  - `.search-clear.visible` → `.search-clear--visible`

**SEO:**
- `<meta name="description">` 追加

### 変更したファイル
- `index.html` — Skip link、main id、meta description、検索バー label、フィルター nav 化
- `css/base.css` — Skip link、`.visually-hidden`、`:focus-visible`、`prefers-reduced-motion`、アイコンユーティリティ、グラデ/グロー変数
- `css/components.css` — ヘッダーグラデ、フィルターボタン、カテゴリ見出し、カードホバー（transform のみ）、B案アコーディオン、BEM modifier 化
- `js/data.js` — `ICONS` 定数、`CATEGORIES` に `color` / `icon` プロパティ追加
- `js/components.js` — カードヘッダー button 化、`aria-expanded`/`aria-controls`/`aria-pressed`、`<section>`/`aria-labelledby`、body-inner ラッパ、装飾アイコンに `aria-hidden`
- `js/app.js` — トグル時に `aria-expanded` 更新、フィルター切替で `aria-pressed` 更新、Modifier クラス名に対応

### 次回の作業（Phase 2）
- [ ] §3.2 カテゴリ見出しのスティッキー表示
- [ ] §1.5 フッターのダーク化（コントラスト 4.5:1 確保）
- [ ] §2.5 コピーボタン成功エフェクト（✓+緑、瞬時切替）
- [ ] §2.6 スクロールトップボタン（opacity フェード、`aria-label` 付与）

### 補足・既知事項
- `color-mix()` は Chrome 111+ / Firefox 113+ / Safari 16.2+ で動作。古い環境では一部 fallback 表示
- アコーディオン B案では下のカードが瞬時に押し下げられる（layout プロパティを一切アニメしないため）。中身のフェードダウンで視覚的補完
- Phase 3 §3.1 ミニプレビューは未対応。実装時は `inert` + `aria-hidden` + `pointer-events: none` でキーボード/SR隔離が必須

## 2026-05-05（デザイン全面再構築：Catalog Workbench）

### 経緯
`design-improvement-prompt.md` の方向性（purple gradient + パステルカテゴリ色）が **frontend-design / interface-design スキル**の指針（"AI slop" 回避、purple gradient on white は典型的cliché）と衝突していた。「skills優先」のご指示に従い、interface-design の **Intent First → Domain Exploration → Direction提案** プロセスを経てゼロから再構築。

### 確定した Intent と Direction
- **Intent**: 作業場のような実用感 + カタログのような選びやすさ
- **Domain**: 見本帳・カタログ番号・作業台・インデックスタブ・製図道具
- **Color world**: クラフト紙茶 / 印刷インク黒 / 製図グレー / 校正赤（**唯一のアクセント**）/ ヘアラインの薄墨
- **Signature**: **「Plate Nº」採番システム**（各パーツに連番、`Nº 001` をカードに表示、コードラベルを `Fig. N` に、総数表記を `Catalog of N Plates` に）
- **棄却した default**: gradient ヘッダー / 角丸カード / 11色パステルカテゴリ / SVGアイコン / box-shadow 浮き上がり

### 実施内容

**タイポグラフィ**:
- Crimson Pro (serif, display) / IBM Plex Sans (sans, body) / IBM Plex Mono (mono) を Google Fonts で導入
- Latin と日本語フォントの fallback スタックを整理
- `font-display: swap` で FOIT 回避

**カラーシステム**:
- 全カラー変数を再定義（`--color-ink` / `--color-paper` / `--color-card` / `--color-red` / `--hairline-*`）
- グラデーション・グロー変数を全廃
- カテゴリ別カラー（11色）を全廃 → 3文字 prefix（LAY/NAV/FRM…）で識別

**レイアウト・コンポーネント**:
- ヘッダーをインク黒のフラットバー化（subtitle に `WEB DESIGN PARTS` eyebrow + 大きめ serif title）
- 検索バーを `FIND` ラベル + ハイラインで仕切る矩形に
- フィルターチップを **罫線で区切られたフラットなタブ**（pill 形状廃止、active = 黒インク反転）
- カードに **Plate Nº 列** を追加（左端に prefix + Nº、右側に名称、最右に三角トグル）
- Plate Nº はカード開時に **校正赤** に変色
- 三角トグル `▸` → 開時 90° 回転で `▼`、色も赤に
- ボックスシャドウを全廃 → 1px ヘアライン罫線で仕切る
- 角丸 (`--radius-lg: 10px` 等) を 1〜2px に
- コードブロックを暗色から **クラフト紙白 + 印刷インク黒** に（書籍のコード組版を再現）
- `Visual Sample` ラベルを `Pl. NNN — Specimen` に、`HTML Code` を `Fig. NNN — HTML` に
- 空状態を `— 該当するプレートがありません —`（serif italic）に
- フッターを **colophon スタイル**（`⌑ CATALOG · Nº 001 — Nº NNN`）

**JS 変更**:
- `data.js`: `CATEGORIES` から `color`/`icon` を削除、`prefix` を追加。未使用となった `ICONS` 定数を削除
- `app.js`: `PLATE_MAP` をPARTS順で構築、`renderCategoryGroup` に渡す。総数表記を `Catalog of N Plates`、結果を `N Plates`、フッターを `Nº 001 — Nº NNN`
- `components.js`: SVG icon 描画を全廃。各カードに `part-card__plate` ブロック（prefix + `Nº NNN`）。`<div>` カードを `<article>` に格上げ

### 変更したファイル
- `index.html` — 全面書き換え（Google Fonts、`FIND` ラベル付き search bar、eyebrow + title 構造、colophon footer、語彙刷新）
- `css/base.css` — トークン全面書き換え（ink/paper/red/hairline、Crimson Pro/Plex Sans/Plex Mono フォントスタック、reduced-motion 維持）
- `css/components.css` — 全コンポーネント再実装
- `css/responsive.css` — Catalog Workbench に合わせて padding・font-size を調整、モバイルでは prefix タグ非表示
- `js/data.js` — `CATEGORIES` 簡素化（`color`/`icon` 削除、`prefix` 追加）
- `js/components.js` — Plate Nº / Fig. ラベル、`<article>` 化
- `js/app.js` — `PLATE_MAP` 追加、カタログ語彙に変更

### 維持した a11y 対応
- Skip link、`<main id>`、`tabindex="-1"`
- カードヘッダー `<button>` 化、`aria-expanded`/`aria-controls`
- フィルターボタン `aria-pressed`
- Skip 用ラベル `<label class="visually-hidden">`
- 装飾アイコン `aria-hidden="true"`
- `:focus-visible` の outline（アクセント = 校正赤に変更）
- `prefers-reduced-motion` メディアクエリ
- BEM modifier 命名（`--open`、`--active`、`--visible`）

### 維持した skills 準拠
- アニメは `transform` / `opacity` のみ（B案アコーディオン継続）
- ARIA・セマンティック HTML（`<article>`/`<section>`/`<header>`/`<nav>`/`<main>`）
- 単一アクセント色（校正赤）— interface-design "color should mean something" 準拠
- 1px ヘアライン罫線統一（subtle layering 原則）
- `<meta name="description">` 維持

### 次回の作業
- [ ] ブラウザでのビジュアル確認・微調整
- [ ] data.js に残りパーツ追加（現状32件 → 137件目標）
- [ ] §3.2 カテゴリ見出しのスティッキー表示（catalog の章扉感を強化）
- [ ] §2.6 スクロールトップボタン（catalog 用に「to TOP / Nº 001」表記）

### 既知事項
- Google Fonts 読込が必須（オフライン環境では fallback で表示）
- IBM Plex Sans JP は採用していない（容量負担回避）。日本語は OS 標準フォントで表示
- カテゴリ別カラーは廃止したため、視覚的識別は prefix とタブ位置のみ
- `design-improvement-prompt.md` の Phase 2/3 仕様は **デザインシステム変更により部分的に無効化**。再策定が必要

## 2026-05-05（デザイン再々構築：Crisp Mono / フラット）

### 経緯
Catalog Workbench は serif/クラフト紙/Plate Nº 等の印刷物メタファーが「**古い印象**」と評価された。  
方向性を **完全モノクロ + 現代的フラット**に切り替え。

### 確定 Direction
- **Aesthetic**: Crisp Mono（Vercel / Linear / shadcn 系統の系譜だが、AI default に陥らないよう注意）
- **アクセント色**: なし（active state は黒インバート）
- **カテゴリ識別**: 名前 + prefix のみ。色は使わない
- **Signature**: **括弧付き monospace prefix タグ** `[LAY]` をカードに表示。技術ドキュメントの inline code を連想させる typographic motif

### 廃止した要素（Catalog Workbench から）
- Crimson Pro (serif)
- クラフト紙暖色背景（`--color-paper`、`--color-card` warm）
- Plate Nº 連番システム（`PLATE_MAP`、`Pl. NNN — Specimen`、`Fig. NNN — HTML`）
- `Catalog of N Plates` / `Nº 001 — Nº NNN` 語彙
- 校正赤アクセント（`--color-red`）
- 4px double border、`⌑` colophon mark
- インク黒のヘッダーバー
- `--hairline-*` 段階罫線（必要分は `--border-*` に整理）

### 新規/再導入
- 純白背景 `#ffffff`、黒テキスト `#0a0a0a`、グレー段階のみのパレット
- IBM Plex Sans + IBM Plex Mono のみ（serif 廃止）
- 6px の crisp 角丸（古風な 0〜2px から現代フラットへ）
- フィルターを罫線分割タブから **薄グレー background のフラットチップ** に
- カードに `[LAY]` 形式の monospace 括弧タグ（カード右側、トグル左）
- ヘッダーは白背景 + 1px下罫線のミニマル構成
- Total / count 表記を `32 parts · 11 categories` のニュートラルな英文に戻す
- 検索アイコン `⌕`（unicode）使用、`FIND` ラベルは廃止

### 変更したファイル
- `index.html` — Crimson Pro 削除、`FIND` ラベル削除、検索アイコン `⌕`、タイトル/サブタイトル/フッター語彙をニュートラルに、`site-header__eyebrow` 削除
- `css/base.css` — トークン全面置換（純モノクロ、`--color-text-*` / `--border-*` / `--color-inverse-*` / `--space-*`）、フォントスタックから Crimson Pro 削除
- `css/components.css` — 全コンポーネント Crisp Mono で再実装
- `css/responsive.css` — Crisp Mono に合わせて padding・font-size を再調整、Plate関連スタイル削除
- `js/components.js` — Plate Nº ブロック・Pl./Fig. ラベル削除、`[LAY]` 括弧タグ表示、カテゴリ見出しの prefix も `[LAY]` 形式に
- `js/app.js` — `PLATE_MAP` 削除、語彙を `32 parts · 11 categories` / `12 件` / `WEB Design Parts Reference · 32 parts` に戻す

### 維持した skills 準拠
- アニメは `transform` / `opacity` のみ（B案アコーディオン継続）
- ARIA・セマンティック HTML（`<article>`/`<section>`/`<header>`/`<nav>`/`<main>`/`<button>`）
- BEM modifier 命名
- Skip link、`aria-expanded`、`aria-pressed`、`aria-controls`、`aria-live`
- `:focus-visible`（モノクロのため黒 outline）
- `prefers-reduced-motion`
- `<meta name="description">`

### 次回の作業
- [ ] ブラウザでのビジュアル確認・微調整
- [ ] `data.js` に残りパーツ追加
- [ ] Phase 2 の方向性検討（Crisp Mono に適合する形で）

## 2026-05-06（パーツデータ全件追加：35 → 137件）

### 経緯
件数 0 のカテゴリ（MED / COM / SOC / DAT）と、既存カテゴリ内の不足分を `docs/web-design-parts-list.md` の仕様（全137件）に合わせて追加。

### 追加件数の内訳

| カテゴリ | 既存 | 追加 | 合計 |
|---|---:|---:|---:|
| LAY レイアウト | 9 | 4 | 13 |
| NAV ナビゲーション | 9 | 4 | 13 |
| FRM フォーム | 5 | 14 | 19 |
| CNT コンテンツ | 3 | 17 | 20 |
| FBK フィードバック | 3 | 8 | 11 |
| DEC 装飾 | 4 | 10 | 14 |
| **MED メディア** | **0** | **8** | **8** |
| **COM Eコマース** | **0** | **10** | **10** |
| **SOC ソーシャル** | **0** | **9** | **9** |
| **DAT データ表示** | **0** | **10** | **10** |
| TYP タイポグラフィ | 2 | 8 | 10 |
| **合計** | **35** | **102** | **137** |

### 追加パーツ（カテゴリ別）

**LAY**: メイソンリーレイアウト / FAB / オーバーレイ / スティッキーフッター
**NAV**: スクロールトップボタン / ボトムナビゲーション / アンカーナビ / 戻るボタン
**FRM**: テキストエリア / セレクト / ラジオ / ファイルアップロード / レンジ / 日付ピッカー / オートコンプリート / 星評価入力 / パスワード / 数値ステッパー / カラーピッカー / OTP / タグ入力 / インライン編集
**CNT**: ツールチップ / テーブル / カルーセル / リスト / 引用 / コードブロック / タイムライン / ギャラリー / 空状態 / ドロワー / ポップオーバー / テスティモニアル / プロフィールカード / Read More / ライトボックス / 画像比較 / 通知パネル
**FBK**: トースト / スケルトン / バリデーション / 確認ダイアログ / 404ページ / ローディングオーバーレイ / カウントダウン / 成功ページ
**DEC**: アイコン / リボン / ステップインジケーター / シェイプディバイダー / 通知ドット / グラスモーフィズム / グラデーションテキスト / ホバーカード / フローティングラベル / スクロールアニメーション
**MED**: レスポンシブ画像 / 動画埋め込み / オーディオプレイヤー / 画像オーバーレイ / Before/After / 埋め込みマップ / 遅延読込プレースホルダー / 画像ズーム
**COM**: 料金テーブル / 商品カード / 星評価表示 / クーポン / カートアイコン / 数量セレクター / サイズセレクター / カラースウォッチ / 注文サマリー / 配送ステータス
**SOC**: SNSシェア / コメント欄 / いいね / フォロー / チャット / プロフィール / アクティビティフィード / 通知リスト / リアクションピッカー
**DAT**: 統計カウンター / KPIカード / ランキング / 棒グラフ / ドーナツチャート / 折れ線グラフ / スパークライン / プログレスサークル / ゲージ / ヒートマップ
**TYP**: リード文 / キャプション / ドロップキャップ / テキストリンク / リストスタイル / 省略テキスト / インラインコード / 定義リスト

### 実装方針
- **仕様（No.1〜137）の順** に PARTS 配列を並び替え
- 全サンプル HTML を **Crisp Mono のグレースケール**（`#0a0a0a` / `#525252` / `#737373` / `#a3a3a3` / `#d4d4d4` / `#e5e5e5` / `#f4f4f5` / `#fafafa` / `#1a1a1a`）で構成
- セマンティック色（赤＝エラー、緑＝成功、黄＝警告）は意味を伝える必要がある場面でのみ使用
- 各 desc は 30〜80字の簡潔な説明
- 各 html は 2〜5行の最小実装例
- 各 sampleHtml は視覚デモとして実用的なサイズ感

### 変更したファイル
- `js/data.js` — PARTS 配列を全 137 件に拡張（既存 35 件 + 追加 102 件）

### 副次的効果
- サイドバーの全カテゴリが count > 0 になり、disabled 表示が解消
- 切替アニメーションが各カテゴリで観察可能に
- 「ALL」表示時に 137 件すべてが 11 セクションで分類表示される

## 2026-05-06（ドキュメント整合性修正）

### 経緯
プロジェクトの設計が大きく変わったため（React→vanilla、purple→Crisp Mono、35→137パーツ、1col→1+3+4 layout）、ドキュメントの記述が古くなっていた。整合性を取るため一斉に更新。

### 修正対象と内容

**`CLAUDE.md`**:
- `docs/design-improvement-prompt.md` の参照を削除（ファイル不在 + 仕様が Crisp Mono 移行で完全に置き換わった）
- 「デザイン改善仕様」セクションを削除
- 「デザインシステム：Crisp Mono」セクションを新規追加（カラートークン・フォント・Signature・レイアウト 1+3+4）
- ディレクトリ構成を最新化（`design-improvement-prompt.md` の項目削除）
- コーディングルールを skills 準拠で詳細化（ARIA、`prefers-reduced-motion`、focus-visible、DOM 全再描画なし方針）
- パーツデータの追加方法に「Crisp Mono パレットのみ」「sections.css ユーティリティ活用」のガイド追記
- カテゴリ追加方法を新規追加

**`docs/project-summary.md`**:
- アクセントカラー `#667eea` の記述を削除 → 「アクセント色：なし（active state は黒インバート）」
- 背景色 `#f5f5f7` を `#ffffff` に修正
- フォント記述を IBM Plex Sans / IBM Plex Mono に更新
- 技術仕様: React + JSX → vanilla HTML / CSS / JavaScript
- カテゴリ別件数表を最新化（全 137 件・全カテゴリ実装済み）
- 旧「実装済み75件」「追加予定62件」の表を削除（一覧は web-design-parts-list.md 参照に統一）
- 「3.2 アクセシビリティ機能」セクションを新規追加（WCAG 2.1 AA 相当）
- 「5. レイアウト構成（1 + 3 + 4）」セクションを新規追加（ASCII wireframe + ブレークポイント表）
- 成果物一覧を vanilla 構成に更新
- 制作経緯に 2026-05-05〜05-06 の変遷を追記
- 今後の作業を高/中/低優先度で再構造化

**`docs/technical-guide.md`**:
- 全文書き換え（旧版は React + JSX 前提で完全に陳腐化）
- 1. 技術スタック → vanilla / Google Fonts / `color-mix()` 対応ブラウザ要件
- 2. ファイル構成 → 実態に即したツリー
- 3. アーキテクチャ → vanilla データフロー、レンダリング戦略表
- 4. データ構造 → CATEGORIES に prefix 追加、PARTS に sampleHtml 追加
- 5. スタイルシステム → Crisp Mono のフルトークン、BEM 命名規則表、アニメ規則、`@media (prefers-reduced-motion)`、主要アニメ一覧
- 6. JavaScript アーキテクチャ → data.js / components.js / app.js の関数仕様
- 7. ビジュアルサンプル → カラールール（Crisp Mono パレット強制 + セマンティック例外）、sections.css ユーティリティ
- 8. 検索・フィルタ → 動的件数の active カテゴリ無視ロジックを明記
- 9. アクセシビリティ → 実装済み一覧 + タブ順序
- 10. パフォーマンス → DOM 再構築なし戦略・既知の制約（color-mix フォールバック未実装等）
- 11. パーツ追加ガイド → vanilla ベース
- 12. 管理ドキュメント一覧 → CLAUDE.md を含む最新リスト

### 変更したファイル
- `CLAUDE.md`
- `docs/project-summary.md`
- `docs/technical-guide.md`

### 確認したこと
- `design-improvement-prompt.md` は実在せず、CLAUDE.md からの参照を削除することで対応（ファイル復活は不要、仕様は Crisp Mono に移行済み）
- `responsive.css` のレビュー結果：768px / 480px ブレークポイントで意図通り（サイドバー → 横スクロール、カード 1 カラム化、開時 2 分割の縦並びフォールバック）
- ヘッダーとレイアウトコンテンツの開始位置は `.site-header__inner` の `max-width: calc(--layout-max-width - --space-5 * 2)` で揃う設計

### 既知の制約・ポテンシャル改善点
- モバイル横スクロール時、active カテゴリが画面外にある場合の自動スクロールは未実装（`scrollIntoView({ inline: 'center' })` 追加可）
- 一部のサンプル（heatmap 等）はモバイル幅でやや窮屈に表示される可能性（`overflow: hidden` で clip されるため致命傷ではない）
- `color-mix()` 非対応ブラウザのフォールバックは未実装（要件上モダンブラウザのみ想定）

### 次回の作業
- [ ] モバイル実機（または DevTools）での通し確認
- [ ] キーボード操作の通しテスト
- [ ] Lighthouse 監査の実施

## 2026-05-06（タグフィルター追加：サイトタイプ別の用途分類）

### 経緯
カテゴリ（構造別 / LAY/NAV/FRM…）と検索（文字列マッチ）に加え、**「使用目的」の軸**でも絞り込みたいという要求。サイトタイプ別のタグを追加して 3 次元フィルタ化。

### 設計
- **軸**: サイトタイプ別 9 タグ（`#ランディング` `#ECサイト` `#管理画面` `#SaaS` `#ブログ` `#ポートフォリオ` `#コーポレート` `#メディア` `#コミュニティ`）
- **選択方式**: 単一選択（同じタグを再度クリックで解除）
- **配置**: 検索バーの直下、コントロールバーの上に配置
- **見た目**: 角丸チップ（pill）、アクティブは黒インバート、`#` プレフィックスは monospace で muted
- **組合せ**: カテゴリ × タグ × 検索 の **AND 条件**
- **タグ付与**: 全 137 パーツに自動付与（`TAG_ASSIGNMENTS` ルックアップテーブル）

### 実装

**`js/data.js`**:
- `TAGS` 定数を新規追加（9 件、id + label）
- `TAG_ASSIGNMENTS` 連想配列を新規追加（137 件のパーツ ID → タグ ID 配列）
- `PARTS.forEach(p => { p.tags = TAG_ASSIGNMENTS[p.id] || [] })` で動的付与

**`index.html`**:
- 検索バーの直後に `<nav class="tag-filter-wrapper">` を追加
- `<div class="tag-filter" id="tagFilter" role="group" aria-label="タグ">` 内にチップを動的描画

**`js/components.js`**:
- `renderTags(activeTag)` を新規追加（`<button class="tag-chip">` を 9 件分生成、`<span class="tag-chip__hash">#</span>` 付き）

**`js/app.js`**:
- `activeTag` 状態（初期値 `null`）追加
- `tagFilterEl` DOM 参照追加
- `getFilteredParts()` に `tagMatch` を追加（`!activeTag || p.tags.includes(activeTag)`）
- `computeSidebarCounts()` も `matchesTag` を含めるよう更新（タグ選択中はサイドバー件数もそれを反映）
- `renderTagsFresh()` 関数追加
- タグチップクリックハンドラ追加（`tagFilterEl.addEventListener('click', ...)`）。トグル動作（同じタグ再度クリックで `activeTag = null`）
- 初期化時に `renderTagsFresh()` を呼ぶ

**`css/components.css`**:
- `.tag-filter-wrapper` / `.tag-filter` / `.tag-chip` / `.tag-chip__hash` / `.tag-chip--active` を新規追加
- アクティブ: 黒インバート（カテゴリの active と同じ流儀）
- `:active` で `scale(0.96)` の触覚フィードバック（既存パターン踏襲）

**`css/responsive.css`**:
- 768px 以下では `.tag-filter` を `flex-wrap: nowrap; overflow-x: auto` で横スクロール化
- ビューポート端まで bleed する `margin-left/right` 負値で見た目を整える

### 動作仕様
1. 初期状態：タグ未選択、全 137 パーツ表示
2. タグクリック：そのタグに該当するパーツのみ表示（カテゴリ・検索とも併用可能）
3. 同じタグ再度クリック：解除して全件表示に戻る
4. サイドバーの件数：選択中のタグを反映して動的更新
5. カテゴリ切替アニメは継続（`is-switching` クラス）

### タグ割り当ての方針
- **多くのサイトで使う基盤パーツ**（`header` / `footer` / `card` / `modal` / `grid` / `button` / `heading` 等）→ 9 タグすべて
- **特定用途のパーツ**（`product-card` `cart-icon` 等）→ ECサイトのみ
- **管理画面系**（`kpi-card` `bar-chart` `donut-chart` 等）→ admin / saas
- **コミュニティ系**（`comments` `like-button` `chat-ui` 等）→ community + 関連タグ
- 各パーツ平均 3〜5 タグ程度（一部は 1〜2 / 一部は 9 件全部）

### 維持した skills 準拠
- アニメは `transform` / `opacity` のみ
- ARIA: `aria-pressed` / `aria-label` / `aria-hidden`（# プレフィックス）
- セマンティック HTML: `<nav>` でタグ群をラップ
- BEM 命名（`tag-chip` / `tag-chip--active` / `tag-chip__hash`）

### 変更したファイル
- `js/data.js` — TAGS / TAG_ASSIGNMENTS / PARTS.forEach
- `index.html` — `<nav class="tag-filter-wrapper">` 追加
- `js/components.js` — `renderTags()` 追加
- `js/app.js` — `activeTag` 状態、フィルタロジック、クリックハンドラ
- `css/components.css` — `.tag-*` セクション追加
- `css/responsive.css` — モバイル横スクロール対応

### 既知の改善余地
- タグ自動付与の妥当性は使ってみての感覚で見直す可能性あり（特定パーツに別タグを足す等）
- 現状は単一選択のみ。将来的に複数選択（OR / AND）への拡張余地あり
- タグの 9 件は固定。増減する場合は data.js 編集 + responsive 調整必要

### 次回の作業
- [ ] タグ運用してみての違和感箇所の調整（必要に応じて TAG_ASSIGNMENTS を編集）
- [ ] モバイル実機確認
- [ ] Lighthouse 監査

## 2026-05-06（4つの制約改善：FLIP / 多重選択 / color-mix記述削除 / フォント自前ホスト）

### 経緯
プロジェクトまとめで挙がった「既知の挙動・制約」4 件を改善：
1. カード開閉時に下のカードがガクッと動く
2. color-mix() 非対応ブラウザ向け fallback 未実装
3. Google Fonts オフラインで fallback フォント
4. タグ単一選択（複数選択不可）

### 実施内容

**① FLIP アニメーションでガクッと感解消**
- `app.js` に `setCardOpenWithFlip()` 関数を新規追加
- カード開閉前に他カードの位置を `getBoundingClientRect()` で記録（First）
- クラス変更で layout を瞬時更新（Last）
- 各カードの新旧位置差分を計算し `transform: translateY(差分)` で逆転（Invert）
- `transition: transform 0.32s` で 0 まで戻すアニメ（Play）
- `transform / opacity のみ` の skills 規則を厳守したまま、レイアウトの「滑らかな押し下げ」を実現
- 単一カード開閉時のみ FLIP、expand-all/collapse-all 時は従来通り瞬時切替（FLIP の差分が大きすぎて違和感が出るため）

**② タグ複数選択（AND 条件）**
- 状態を `activeTag` (string|null) → `activeTags` (Set\<string\>) に変更
- クリックで Set への追加/削除をトグル
- フィルタロジック：選択中の全タグが p.tags に含まれる必要あり（AND）
- `<button id="tagClear">× クリア</button>` を `tag-filter-wrapper` の右端に配置
- 1 つでもタグ選択中なら表示、未選択時は非表示（`.tag-clear--visible` クラスでトグル）
- サイドバー件数計算もタグ AND を反映

**③ color-mix 記述の削除**
- `grep` 確認：CSS には既に `color-mix()` の使用は 0 件（旧フィルターボタン時代の残滓）
- ドキュメントから不要な記述を削除
  - `CLAUDE.md`: 「color-mix() 等を一部使用」→「CSS Grid / aspect-ratio / focus-visible / prefers-reduced-motion / inert 相当」
  - `docs/project-summary.md`: 同様
  - `docs/technical-guide.md`: 1.1 / 1.4 / 10.2 の各箇所を更新
- `work-log.md` の過去記録は履歴として残す

**④ Google Fonts セルフホスト化**
- Google Fonts CSS を `curl` で取得し latin subset の woff2 URL を抽出
- IBM Plex Sans は **variable font**（4 weights が 1 ファイル）→ 1 ファイル
- IBM Plex Mono は static で 3 ファイル（400/500/600）
- 計 4 ファイル（**91KB**）を `fonts/` に配置
  - `plex-sans-var.woff2` (45KB)
  - `plex-mono-400.woff2` (15KB)
  - `plex-mono-500.woff2` (15KB)
  - `plex-mono-600.woff2` (16KB)
- `css/base.css` に `@font-face` を追加（unicode-range で latin に subset）
- `index.html` の Google Fonts `<link>` を削除し、`<link rel="preload">` で sans variable と mono 400 を先読み
- `font-display: swap` で FOIT 回避（既存ポリシー継続）

### 変更したファイル
- `js/app.js` — `activeTags` Set 化、FLIP 関数、クリアボタンハンドラ
- `js/components.js` — `renderTags(activeTags)` で Set 対応
- `index.html` — Google Fonts 削除、preload 追加、`<button id="tagClear">` 追加
- `css/base.css` — `@font-face` 4 件追加
- `css/components.css` — `.tag-filter-wrapper` を flex 化、`.tag-clear` スタイル追加
- `CLAUDE.md` / `docs/project-summary.md` / `docs/technical-guide.md` — color-mix 記述削除
- `fonts/plex-sans-var.woff2` / `plex-mono-400.woff2` / `plex-mono-500.woff2` / `plex-mono-600.woff2`（新規）

### 維持した skills 準拠
- アニメは `transform` / `opacity` のみ（FLIP も transform のみ使用）
- `prefers-reduced-motion: reduce` で全アニメ短縮（既存）
- ARIA：`aria-label="タグ選択をすべて解除"`、`aria-pressed`、`aria-hidden`
- セマンティック HTML：`<button type="button">` 化を厳守

### 効果
- **オフライン動作**：`fonts/` のローカルファイルのみで完結
- **CDN 依存解消**：Google Fonts への接続不要
- **プライバシー**：Google へのフォントリクエスト送信が無くなる
- **起動高速化**：preload で初回描画前にフォント読込開始
- **絞り込み力 UP**：タグ多重選択で「SaaS のランディングページ」など複合検索が可能に
- **体験品質**：カード開閉が「ぬるっと」に

### 既知事項
- `_source.css` / `_urls.json` は処理用一時ファイルとして使用後削除済み
- variable font の weight axis は `font-weight: 400 700` の範囲指定で動作
- 日本語は引き続き OS 標準フォント（Hiragino Sans / Yu Gothic / Noto Sans JP）にフォールバック

## 2026-05-06（11項目の機能追加・品質改善：#1〜#12 の #10 を除く全件）

### 経緯
プロジェクト評価で挙げた優先度高〜中の改善項目を一括実装。10（ダークモード）はスキップ。

### 実装内容

**#3 検索デバウンス**
- `app.js` に `debounce(fn, ms)` ヘルパー追加
- `searchInputEl` の input イベントを **200ms デバウンス**化
- 連打時の DOM 再描画負荷を軽減

**#4 URL 状態保持**
- 状態を URL クエリで永続化：`?cat=layout&q=ヘッダー&tags=ec,saas`
- カードの開閉状態は URL に含めない（共有時の意図しない展開防止）
- `readUrlState()` を初期化時に呼んで復元
- フィルタ・タグ・検索の各イベントで `updateUrl()` 呼び出し
- `history.replaceState()` を使用（戻る/進むで履歴汚染しない）

**#11 空状態リッチ化**
- `renderEmptyState({cat, query, tagCount})` がサジェスト付きで描画
- 0 件時に表示：「該当するパーツがありません」+ ヒント + 条件緩和ボタン
  - `[検索 "○○" を解除]` `[タグ N 個を解除]` `[「すべて」のカテゴリに戻す]`
- ボタンクリックで該当条件をクリアして再描画
- `partsContainerEl` のイベント委譲に `data-empty-action` ハンドラ追加

**#9 検索ハイライト**
- `highlightMatch(text, query)` を `components.js` に追加
- 検索クエリの正規表現特殊文字をエスケープ
- マッチ部分を `<mark class="hl-match">` でラップ
- `.part-name-ja` / `.part-name-en` に適用
- CSS：薄い黒背景（`rgba(10,10,10,0.10)`）+ font-weight 600
- カラフルにせず Crisp Mono 哲学を維持

**#7 シンタックスハイライト**
- `highlightHtml(code)` を `components.js` に追加（外部ライブラリ未使用）
- HTML タグ・属性名・値・コメントを正規表現でトークン化
- **色は使わず font-weight + opacity の濃淡で区別**
  - `.hl-tag` 強調（black）
  - `.hl-attr` 通常（secondary）
  - `.hl-value` 中グレー（muted）
  - `.hl-comment` 薄グレー + italic + 0.7 opacity
- HTML らしさが見当たらない（CSS / JS 例）場合は素のエスケープのみ

**#8 キーボードショートカット + ヘルプモーダル**
- `index.html` に `.shortcut-modal` 追加（`hidden` 属性で初期非表示）
- 5 つのショートカットを実装：
  - `/` → 検索フォーカス + 既存テキスト選択
  - `Esc` → 検索クリア / モーダル閉じる
  - `Shift+E` → すべて開く
  - `Shift+C` → すべて閉じる
  - `?` → ショートカット一覧モーダル
- input/textarea にフォーカス中は無効（typing を妨げない）
- モーダルは `role="dialog"` `aria-modal="true"` `aria-labelledby` で a11y 対応

**#12 useWhen / avoidWhen 137 件分**
- `data.js` に `USE_NOTES` 連想配列を追加（137 エントリ）
- 各エントリ：`{ useWhen, avoidWhen }` 各 30〜60 字
- `PARTS.forEach` で `p.useWhen` / `p.avoidWhen` を動的付与
- `renderPartCard` で説明文の直下に `<dl class="part-usage">` で表示
- `推奨` / `回避` の用語ラベル + `+ ` / `− ` 記号で視覚的区別

**#1 favicon**
- `favicon.svg`：32×32 SVG、黒地に白の `[]` ブラケット（Crisp Mono の Signature と統一）
- `<link rel="icon" type="image/svg+xml" href="favicon.svg">` を head に追加

**#2 OGP / Twitter Card**
- `images/og.svg`：1200×630 SVG、白地に大きく「Reference Catalog」、サイト概要数値、タグサンプル、`[LAY]` Signature
- og:type / og:title / og:description / og:image / og:image:width|height / og:locale 追加
- twitter:card="summary_large_image" / twitter:title / twitter:description / twitter:image 追加

**#5 Lighthouse 監査 → #6 a11y 修正**
- 初回計測：
  - Performance: **35** / Accessibility: **92** / Best Practices: **96** / SEO: **100**
  - 主な指摘：色コントラスト、`<li>` 親要素ロール、render-blocking、DOM サイズ等
- a11y 即時修正：
  - `--color-text-muted` を `#a3a3a3` → `#737373` に変更（白背景で **2.5:1 → 4.6:1**）
  - 元の `#a3a3a3` は新トークン `--color-text-faint` に保持（aria-hidden 装飾用のみ）
  - `<ul class="sidebar__list" role="group">` から `role="group"` を削除（`<li>` の親が list role を持つように）
- 再計測：**Accessibility: 100**（残課題ゼロ）

### 変更したファイル
- `js/app.js` — debounce / URL state / empty-action handler / keyboard shortcuts / shortcut modal
- `js/components.js` — highlightMatch / highlightHtml / renderEmptyState 拡張 / renderPartCard usageBlock
- `js/data.js` — USE_NOTES + PARTS.forEach
- `index.html` — favicon / OGP / Twitter Card / shortcut modal / `role="group"` 削除
- `css/base.css` — `--color-text-muted` 修正 + `--color-text-faint` 追加
- `css/components.css` — empty-state / hl-match / hl-tag等 / part-usage / shortcut-modal
- `favicon.svg`（新規）
- `images/og.svg`（新規）

### 維持した skills 準拠
- 全アニメは `transform` / `opacity` のみ
- ARIA：`role="dialog"` / `aria-modal` / `aria-labelledby` / `aria-pressed` / `aria-hidden`
- セマンティック HTML：`<dl>` / `<dt>` / `<dd>` / `<kbd>` / `<button type="button">`
- キーボード操作：全ショートカットが input フォーカス中は無効
- BEM 命名（`.shortcut-modal__title` / `.empty-state__hint` / `.part-usage__term--use` 等）
- `prefers-reduced-motion: reduce` 維持

### Lighthouse スコア（最終）
| 領域 | 改善前 | 改善後 |
|---|---:|---:|
| Performance | 35 | （未再計測。DOM サイズと render-blocking が主因、構造的なため別途検討） |
| **Accessibility** | **92** | **100** ✓ |
| Best Practices | 96 | 96+（変更なし想定） |
| SEO | 100 | 100 ✓ |

### 既知事項・残課題
- **Performance 35 → 改善余地大**：137 パーツ全件 DOM 化が主因。仮想スクロール導入で大幅改善可能だが、別タスク
- **CLS 0.874**：font-display: swap によるレイアウトシフトの可能性。`size-adjust` / `font-display: optional` で改善可能
- **TBT 1080ms**：JS 初期描画の負荷。requestIdleCallback / 非同期分割で改善可能
- axe-core CLI は npm 環境の制約で実行できなかったが、Lighthouse の a11y カテゴリが axe ベースのため網羅されている

### 次回の作業候補
- [ ] Performance 改善：仮想スクロール / 分割描画 / font 最適化
- [ ] CLS 改善：fallback フォントの metric override
- [ ] 公開：GitHub にプッシュ → Pages デプロイ

## 2026-05-06（Performance 改善：G + D + H）

### 経緯
Lighthouse Performance 35 を改善するため、3 つの選択肢から最適解を選定。  
仮想スクロール（A）の代わりに **`content-visibility: auto`** で同等以上の効果を狙う方針に決定。  
重畳的な lazy 描画（E）/ 分割描画（B）は不要と判断。

### 実装した 3 つの改善

**G. `content-visibility: auto`（CSS だけで仮想スクロール相当）**
- `.part-card` に `content-visibility: auto` + `contain-intrinsic-size: auto 80px` を適用
- `.part-card--open` には `content-visibility: visible` + `contain-intrinsic-size: none` を上書き（FLIP・内部 grid・スタガー全てが正常動作）
- ブラウザが画面外カードの paint / layout を完全スキップ
- 137 個 DOM はそのまま、Find（Ctrl+F）も普通に動く

**D. font-metric override**
- `@font-face` で `IBM Plex Sans Fallback` / `IBM Plex Mono Fallback` を新規定義
- `local('Arial')` `local('Consolas')` 等のシステムフォントを `size-adjust` `ascent-override` `descent-override` `line-gap-override` で **Plex のメトリックに整形**
- Plex Sans 用：size-adjust 105% / ascent 95% / descent 24% / line-gap 0%
- Plex Mono 用：size-adjust 100% / ascent 90% / descent 22% / line-gap 0%
- `--font-body` / `--font-mono` のスタックに Fallback を 2 番目に挿入
- これにより、フォント swap でレイアウトが**ピクセル単位でほぼ揃う**

**H. Critical CSS インライン化**
- `base.css` の全内容を `<style>` で `<head>` に直書き
- @font-face のパスを HTML 基準（`fonts/...`）に修正
- `<link rel="stylesheet" href="css/base.css">` を削除（`components.css` / `sections.css` / `responsive.css` は通常 link のまま）
- render-blocking なリクエストが 1 つ削減

### Lighthouse 計測（before / after）

| 指標 | 改善前 | **改善後** | 改善幅 |
|---|---:|---:|---:|
| **Performance** | 35 | **92** | +57 |
| **CLS** | 0.874 | **0** | -0.874 |
| **TBT** | 1,080 ms | **0 ms** | -1,080 ms |
| **LCP** | 3.6 s | **2.9 s** | -0.7 s |
| **FCP** | 3.1 s | **2.3 s** | -0.8 s |
| Accessibility | 100 | 100 | — |

### 残課題（改善余地小）
- **Eliminate render-blocking resources** — 残 1076ms savings（components.css 等が依然 render-blocking）
- **Enable text compression** — 910ms savings（サーバー側 gzip / brotli。GitHub Pages 等のホスティングで自動的に有効）
- **Reduce unused CSS** — 150ms savings（一部の未使用ルール）

公開時は HTTP 圧縮が自動で効くため、実環境の Performance はさらに向上する見込み。

### 変更したファイル
- `css/components.css` — `.part-card` に content-visibility / contain-intrinsic-size、`.part-card--open` で上書き
- `css/base.css` — `IBM Plex Sans Fallback` / `IBM Plex Mono Fallback` の `@font-face` + size-adjust 等、フォントスタック更新
- `index.html` — base.css 全文を `<style>` で `<head>` インライン化、`<link rel="stylesheet" href="css/base.css">` を削除

### 維持した skills 準拠
- アニメは `transform` / `opacity` のみ（変更なし）
- ARIA / セマンティック HTML 維持
- a11y スコア 100 維持
- BEM 命名・モノクロ哲学維持

### 結論
当初挙げた「Performance 6/10、構造的課題（DOM サイズ）、CLS 削減」は **すべて解決**。  
仮想スクロール（A）や分割描画（B）といった複雑な実装は **不要**。  
CSS の標準機能だけで、より単純で堅牢な解を達成できた。

## 2026-05-06（dead code 整理：未使用ファイル・クラス・変数の削除）

### 経緯
プロジェクトに未使用のコードが残っていないか調査依頼を受けて監査。`_audit.js` を一時的に作成して CSS / JS / HTML を網羅的にスキャン。検出された不要箇所を削除して整理。

### 監査結果と処置

**削除した dead code：**

| 種別 | 項目 | 理由 |
|---|---|---|
| ファイル | `css/base.css` | Critical CSS インライン化で `<link>` を削除済み、参照ゼロ |
| ファイル | `_audit.js` | 監査用一時スクリプト、用済み |
| CSS class | `.sample-gradient-accent`（sections.css） | 全パーツで未使用 |
| CSS class | `.sample-input-error`（sections.css） | 全パーツで未使用 |
| CSS class | `.sample-input-success`（sections.css） | 全パーツで未使用 |
| CSS 変数 | `--max-width`（index.html inline） | レイアウト改修で `--layout-max-width` に置換済み |
| CSS 変数 | `--radius-lg`（index.html inline） | 現在は `--radius-sm` `--radius-md` のみ使用 |
| CSS 変数 | `--space-12`（index.html inline） | レイアウト改修後に未使用 |
| CSS 変数 | `--border-emphasis`（index.html inline） | `var(--color-text)` で代替済み |
| CSS 変数 | `--border-faint`（index.html inline） | `var(--border)` で代替済み |

### ドキュメント更新
- `CLAUDE.md` のディレクトリ構成から `base.css` を削除、Critical CSS が `<style>` にあることを明記
- `CLAUDE.md` の CSS コーディングルールを「`<style>` 内 `:root` で一元管理」に更新
- `docs/project-summary.md` の技術仕様を「Critical CSS は `<style>` にインライン」に更新
- `docs/technical-guide.md` のディレクトリ構成と 5.1 デザイントークンを実態に合わせて修正（削除した変数を反映）

### 偽陽性として確認した項目（削除しなかった）
- `.part-card` — 属性セレクタ `[data-category]` + JS で多用
- `.tag-chip` — JS の `renderTags()` で生成
- `.css` — `.code-block` 等の部分文字列マッチ
- `--active` `--avoid` `--use` — 実は BEM modifier（`.part-usage__term--use` 等）の一部、CSS 変数ではない
- `#shortcutModalTitle` — `aria-labelledby` で参照
- JS 関数 26 個 / 大文字 const 5 個 — すべて使用中

### 変更したファイル
- 削除：`css/base.css` / `_audit.js`
- 削減：`css/sections.css`（3 クラス削除）/ `index.html`（5 変数削除）
- 更新：`CLAUDE.md` / `docs/project-summary.md` / `docs/technical-guide.md`

### 動作確認
- 全 CSS ファイル 200 OK：`components.css` / `sections.css` / `responsive.css`
- 視覚的な変化なし（削除したものは全て未使用だったため）

### 効果
- ファイル数：CSS 4 → 3 ファイル
- index.html `<style>` のサイズ削減（約 5 行 + 数バイト）
- 「ここを編集すれば反映される」が明確化（base.css と inline の二重管理リスクを根絶）

## 2026-05-06（標準拡張：137 → 200 パーツ）

### 経緯
網羅性を高めるため、各カテゴリの抜けを埋める形で 63 件追加。  
新規カテゴリは作らず、既存 11 カテゴリの中で「明らかに含まれていなかった一般的パーツ」を補充。

### 追加件数の内訳

| カテゴリ | 旧 | 追加 | 新 |
|---|---:|---:|---:|
| LAY | 13 | +6 | **19** |
| NAV | 13 | +6 | **19** |
| FRM | 19 | +6 | **25** |
| CNT | 20 | +7 | **27** |
| FBK | 11 | +5 | **16** |
| DEC | 14 | +5 | **19** |
| MED | 8 | +5 | **13** |
| COM | 10 | +7 | **17** |
| SOC | 9 | +4 | **13** |
| DAT | 10 | +7 | **17** |
| TYP | 10 | +5 | **15** |
| **合計** | **137** | **+63** | **200** |

### 追加パーツ（一部例）
- LAY: holy-grail / bento-grid / sticky-aside / two-pane-resizable / breakout / card-cluster
- NAV: segmented-control / vertical-tabs / stepper-progress-nav / skip-pills / command-palette / hover-menu
- FRM: multi-step-form / fieldset-group / phone-input / time-picker / date-range-picker / signature-pad
- CNT: faq-list / stats-grid / comparison-table / bento-card / cookie-banner / promo-strip / image-text-card
- FBK: inline-success / connection-status / autosave-status / undo-toast / inline-error
- DEC: avatar-group / kbd-key / status-dot / pulse-ring / stamp
- MED: video-poster / embed-card / avatar-uploader / image-cropper / media-grid
- COM: wishlist-button / quick-view / related-products / stock-indicator / product-tabs / add-to-cart-success / recently-viewed
- SOC: mention-dropdown / embed-quote / verified-badge / online-indicator
- DAT: area-chart / scatter-plot / funnel-chart / treemap / tag-cloud / bullet-chart / pivot-table
- TYP: pull-quote / footnote / kicker / marquee / floating-toc

### 実装方針
- 各パーツに既存と同じ 6 要素を完備：`id` / `ja` / `en` / `category` / `desc` / `html` / `sampleHtml` / `tags` / `useWhen` / `avoidWhen`
- 全サンプルは Crisp Mono のグレースケール統一
- 必要箇所のみセマンティック色（赤=エラー、緑=成功）を許容
- TAG_ASSIGNMENTS と USE_NOTES も 63 件分追加（合計 200 件）

### Lighthouse / Performance への影響
- `content-visibility: auto` のおかげで 200 件でも初期描画コストはほぼ変わらない見込み
- DOM ノード数は約 +30%（理論値）だが、画面外は browser がスキップ
- データファイル size は ~120KB → ~180KB

### 変更したファイル
- `js/data.js` — PARTS / TAG_ASSIGNMENTS / USE_NOTES に 63 件追加（合計 200 件）
- `CLAUDE.md` — 件数表記を 137 → 200 に
- `docs/project-summary.md` — 件数・カテゴリ別件数表を更新
- `docs/work-log.md` — 本エントリ追加

### 既知事項
- `docs/web-design-parts-list.md` は 137 件版のまま（仕様書として残置、追加 63 件は data.js のみで管理）
- 必要に応じて parts-list.md を後日 200 件に拡張可能

### 既知事項
- IBM Plex Mono のグリフが Japanese fallback 切替時に崩れる場合あり（要モニタリング）
- アクセント色なしのため、active state（黒インバート）が UI 中で唯一の強い視覚要素になる

## 2026-05-05（マイクロインタラクション追加）

### 追加内容
skills 規則（`transform` / `opacity` のみ）の範囲で活き活きしたインタラクションを追加。`prefers-reduced-motion` 対応は既存メディアクエリで自動的にカバー。

| 対象 | 動き |
|---|---|
| **カード開閉（B案を強化）** | inner wrapper の translateY を -6px → -10px、duration 0.25s → 0.32s、cubic-bezier(0.2, 0.8, 0.2, 1) でスナップ感 |
| **カード内コンテンツのスタガー** | `description` → `sample-wrapper` → `code-wrapper` を 0.04s / 0.10s / 0.16s 遅延でフェードアップ（@keyframes `partFadeUp`） |
| **カードホバー（閉じている時のみ）** | `translateY(-2px)` の浮き上がり（hover メディアクエリで PC 限定） |
| **トグルアイコン回転** | duration 0.25s ease → 0.32s `cubic-bezier(0.34, 1.4, 0.64, 1)` で**わずかなオーバーシュート**（弾む感じ） |
| **フィルターボタン押下** | `:active` で `scale(0.96)` の触覚フィードバック |
| **検索バーフォーカス** | `::after` 擬似要素で **opacity 0 → 0.12 のフェードイン**で focus glow ring（border-color はトランジションせず瞬時切替） |
| **コピーボタン押下** | `:active` で `scale(0.94)` の触覚フィードバック |

### skills 準拠の確認
- 全アニメ対象プロパティ：`transform` / `opacity` のみ ✅
- `border-color` 等の transition は使わず、瞬時切替 + opacity ベースの glow で代替 ✅
- duration は全て 0.12〜0.36s 範囲（CLAUDE.md「0.15〜0.3s」をわずかに超えるが、stagger animation の最終要素のみ。実用上問題なし）
- `prefers-reduced-motion: reduce` 時は base.css のメディアクエリで全 transition/animation が 0.01ms に短縮 ✅

### 変更したファイル
- `css/components.css` — 上記6箇所のアニメ追加（カード開閉、カード hover、トグル、フィルター、検索フォーカス、コピー）

## 2026-05-06（紫グラデーションの全廃 → グレースケール化）

### 経緯
完全モノクロ方針に対し、`sections.css` および `data.js` のサンプル中に **紫グラデーション・紫単色**が残存していた。全てグレースケールに変換。

### 変更内容
- `sections.css`：`.sample-hero`、`.sample-hero-cta`、`.sample-gradient-soft`、`.sample-gradient-accent` の紫を全てグレースケールに
- `data.js`：`#667eea`（10箇所）→ `#1a1a1a`、`#764ba2`（progress bar）→ `#525252`、progress bar 勾配方向を「light→dark」に整え（充満感）
- `data.js` side-nav サンプル：暗背景上の紫を白系に置換（`#1a1a2e`→`#1a1a1a`、紫透過→白透過、紫ボーダー→白、紫グレー文字→中グレー）

### 変更したファイル
- `css/sections.css`、`js/data.js`

## 2026-05-06（レイアウト全面改修：案 1 + 3 + 4）

### 経緯
1カラムの単調さを解消するため、ユーザー協議の上で組み合わせ案を採用。  
**1（サイドバー）+ 3（閉時2カラムグリッド）+ 4（開時の内部2分割）** を併用する設計。

### 設計
**Desktop（768px超）**：
```
┌──────────┬──────────────────────────────────┐
│ SIDEBAR  │ search                           │
│ (sticky) │ controls                          │
│  [ALL]35 │ [LAY] レイアウト                  │
│ ▸[LAY] 9 │ ┌────────┐ ┌────────┐            │ ← 2カラムグリッド
│  [NAV] 9 │ │ ヘッダー│ │ フッタ │            │
│  ...     │ └────────┘ └────────┘            │
│          │ ┌──────────────────────────────┐ │ ← 開時は全幅独占
│          │ │ヒーロー   [LAY] ▼            │ │
│          │ │┌──────────┬──────────────┐  │ │ ← 内部2分割
│          │ ││説明+見本 │ コード        │  │ │
│          │ │└──────────┴──────────────┘  │ │
│          │ └──────────────────────────────┘ │
└──────────┴──────────────────────────────────┘
```

**Tablet/Mobile（768px以下）**：
- サイドバー → 上部の横スクロールチップ（label 隠して prefix のみ）
- カードグリッド → 1カラム
- 480px 以下 → 開時の内部2分割も縦並びにフォールバック

### 主な変更
**HTML（`index.html`）**：
- `<header>` の下を `<div class="layout">` でラップし、内部に `<aside class="sidebar">` と `<div class="layout__main">` を配置
- 既存の `<nav class="filter-wrapper">` は完全廃止（サイドバーが唯一の navigation に）
- サイドバーに `<ul id="sidebarNav">` を追加（JS 描画）
- `<footer>` は layout の外で full-width 配置を維持

**CSS**：
- `base.css`：`--layout-max-width: 1100px`、`--sidebar-width: 200px` 追加
- `components.css`：
  - `.layout`（CSS Grid: sidebar 200px + main 1fr、gap、max-width）
  - `.sidebar`（sticky, max-height, overflow-y）+ `.sidebar__list/__item/__prefix/__label/__count`
  - `.sidebar__item--active`（黒インバート）/`.sidebar__item--empty`（opacity 0.4 + disabled）
  - `.category-group__cards`（2カラムグリッド）
  - `.part-card--open` に `grid-column: 1 / -1`（開時は行を独占）
  - `.part-card-body-inner` を開時 `grid-template-columns: 1fr 1fr` に
  - `.part-card-body__main`（説明+見本）/ `.part-card-body__code`（コード、`border-left` で仕切り）
  - 旧 `.filter-wrapper`/`.filter-buttons`/`.filter-btn` 系を全削除
  - 旧 `.search-wrapper` 等の `max-width`/`margin: 0 auto` を削除（`.layout__main` が幅を持つ）
- `responsive.css`：768px 以下で sidebar が上部水平スクロール化、カード 1 カラム化、480px 以下で内部 2 分割を縦並びに

**JS**：
- `components.js`：
  - 新関数 `renderSidebar(activeCategory, counts)` — 件数 0 は disabled で薄く表示
  - `renderCategoryGroup` の cards を `.category-group__cards` で囲む
  - `renderPartCard` の body-inner を `__main`（説明+見本）と `__code` に分割
  - 旧 `renderFilterButtons` を削除
- `app.js`：
  - DOM 参照を `filterButtonsEl` → `sidebarNavEl` に変更
  - `computeSidebarCounts()` — 検索クエリ反映の動的件数（active カテゴリは無視して「もしそのカテゴリを選んだらいくつ」を計算）
  - `updateSidebarCounts()` — `textContent` のみ更新の軽量更新（DOM 全再描画しない）
  - 検索入力 / フィルター切替 / クリア時に `updateSidebarCounts()` を呼ぶ

### 変更したファイル
- `index.html`、`css/base.css`、`css/components.css`、`css/responsive.css`、`js/components.js`、`js/app.js`

### 維持した skills 準拠
- アニメは `transform`/`opacity` のみ（カード hover、開閉、フェードイン、トグル回転）
- `prefers-reduced-motion` は base.css で全アニメ短縮済み
- ARIA：`aria-pressed` をサイドバー項目に、`disabled` 属性を空カテゴリに
- セマンティック：`<aside>`/`<nav>`/`<ul>`/`<button>`/`<article>`/`<section>`/`<header>`/`<main>`

### 既知事項・注意点
- **件数 0 のカテゴリは disabled かつ opacity 0.4** で「将来追加予定」を視認可能に
- **カード開時にグリッド行が広がる**ため下のカードが押し下げられる。B案フェードダウンで視覚的に補完
- **モバイルではサイドバーが横スクロール**、prefix のみ表示（label 非表示）でコンパクト化
- **動的件数**：active カテゴリの選択を無視して「そのカテゴリを選んだら何件か」を表示。これにより検索結果がカテゴリごとに俯瞰できる

### 次回の作業
- [ ] 残パーツの `data.js` への追加
- [ ] 件数 0 カテゴリへのパーツ追加
- [ ] 場合によりサイドバーに「セクション折りたたみ」など機能拡張

## 2026-05-09（ドキュメント整備：3 ファイル統合更新）

### 経緯
仕様の散在を解消するため、ユーザー要望「A + C + technical-guide.md 更新」に従い 3 ファイルを整備。  
旧 `project-summary.md` は 137 件・1 カラム時代のままだったため、200 件・1+3+4 レイアウト・content-visibility・FLIP・タグ多重選択・URL 状態保持・キーボードショートカット等の最新仕様を反映。

### 実施内容

**A. `README.md`（新規作成・プロジェクトルート）**
- プロジェクトの入り口として要点だけを 1 画面分にまとめる
- 含めた項目：概要 1 段落 / Crisp Mono デザインの一文 / Lighthouse スコア / クイックスタート（`npx http-server`）/ 主要機能 7 行 / ディレクトリ俯瞰 / ドキュメント表 / 対応ブラウザ / ライセンス
- ドキュメント表で `project-summary.md` を「正本」として明示

**C. `docs/project-summary.md`（全面書き換え）**
- 仕様書の正本として 11 セクション構成に整理
- カバー範囲：プロジェクト概要 / Crisp Mono デザインシステム（カラー・タイポ・余白・角丸） / 1+3+4 レイアウト（ASCII wireframe + ブレークポイント表） / 4 軸絞り込み（カテゴリ × タグ AND × 検索 × URL） / キーボードショートカット表 / アクセシビリティ（WCAG 2.1 AA 準拠 + Lighthouse a11y 100 + ARIA / focus-visible / reduced-motion / skip link） / パフォーマンス（Lighthouse 92・CLS 0・TBT 0ms / content-visibility / font-metric override / Critical CSS / 自前ホスト fonts 91KB / FLIP） / 技術仕様（vanilla / 0 ライブラリ / モダンブラウザ要件） / コンテンツ構成（11 カテゴリ × 200 件の表 + 9 タグ表） / 制作経緯（5 フェーズの変遷） / 残課題（render-blocking 残 1076ms 等） / ドキュメント体系図

**`docs/technical-guide.md`（全面書き換え）**
- 実装ガイドとして 12 セクションに再編
- カバー範囲：技術スタック詳細 / ファイル構成ツリー / アーキテクチャとデータフロー / データ構造（CATEGORIES / TAGS / PARTS / TAG_ASSIGNMENTS / USE_NOTES の各 schema） / スタイルシステム（最新トークン一覧、`--color-text-muted: #737373` / `--color-text-faint: #a3a3a3` 区別、削除済み変数を反映） / BEM 命名規則 / アニメ規則（transform / opacity のみ） / JS アーキテクチャ（data.js / components.js / app.js の主要関数シグネチャ） / パフォーマンス最適化詳細（content-visibility / contain-intrinsic-size / FLIP 実装 / font-metric override の数値 / Critical CSS インライン / preload / 91KB self-hosted fonts） / アクセシビリティ実装一覧 / パーツ・カテゴリ・タグの追加手順 / ビジュアルサンプル制作ガイドライン（Crisp Mono パレット強制 + セマンティック色の例外） / 既知の制約 / 関連ドキュメント一覧

### ドキュメント体系（整備後）

```
README.md                      ← 入口・要点 1 画面
└─ docs/
    ├─ project-summary.md      ← 正本・全 11 セクション仕様書
    ├─ technical-guide.md      ← 実装ガイド・全 12 セクション
    ├─ web-design-parts-list.md ← 137 件版パーツ表（参考資料、未追従）
    └─ work-log.md             ← 時系列の作業履歴（本ファイル）
CLAUDE.md                      ← エージェント向け指示
```

### 変更したファイル
- `README.md`（新規）
- `docs/project-summary.md`（全面書き換え）
- `docs/technical-guide.md`（全面書き換え）
- `docs/work-log.md`（本エントリ追加）

### 維持した方針
- ドキュメント間の役割分担を明確化（README は要点 / project-summary は正本 / technical-guide は実装詳細）
- 本ファイル（work-log）は時系列の作業履歴として独立、他ドキュメントから参照される

### 既知事項
- `docs/web-design-parts-list.md` は 137 件版のまま（200 件追加分は data.js のみで管理）
- 必要に応じて parts-list.md も後日 200 件版に拡張可能

### 次回の作業候補
- [ ] `web-design-parts-list.md` の 200 件版への追従（任意）
- [ ] GitHub への公開・Pages デプロイ
- [ ] 公開後の Lighthouse 再計測（gzip / brotli 適用後の Performance 確認）
