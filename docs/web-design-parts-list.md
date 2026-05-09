# WEB Design Parts Reference

WEBデザインパーツの名称・用途・コード例リファレンス  
全 **137パーツ** ／ **11カテゴリ** 収録

---

## 目次

1. [レイアウト（Layout）](#1-レイアウトlayout) — 13件
2. [ナビゲーション（Navigation）](#2-ナビゲーションnavigation) — 13件
3. [フォーム（Form）](#3-フォームform) — 19件
4. [コンテンツ（Content）](#4-コンテンツcontent) — 20件
5. [フィードバック（Feedback）](#5-フィードバックfeedback) — 11件
6. [装飾（Decoration）](#6-装飾decoration) — 14件
7. [メディア（Media）](#7-メディアmedia) — 8件
8. [Eコマース（E-commerce）](#8-eコマースe-commerce) — 10件
9. [ソーシャル（Social）](#9-ソーシャルsocial) — 9件
10. [データ表示（Data Display）](#10-データ表示data-display) — 10件
11. [タイポグラフィ（Typography）](#11-タイポグラフィtypography) — 10件

---

## 1. レイアウト（Layout）

ページ全体の構造や領域の配置に関わるパーツ。

| No. | パーツ名（日本語） | パーツ名（英語） | 説明・用途 | HTMLタグ例 |
|-----|---------------------|-------------------|------------|------------|
| 1 | ヘッダー | Header | ページ最上部の領域。ロゴ・ナビ・検索バーを含む | `<header>` |
| 2 | フッター | Footer | ページ最下部の領域。著作権・リンク集・SNSアイコン | `<footer>` |
| 3 | ヒーロー / メインビジュアル | Hero Section | ページ冒頭の大きなビジュアル領域。キャッチコピー+CTA | `<section class="hero">` |
| 4 | サイドバー | Sidebar | メインコンテンツ横の縦長領域。ナビやウィジェット | `<aside>` |
| 5 | グリッド / カラムレイアウト | Grid / Column Layout | コンテンツを格子状に配置するレイアウトパターン | `<div class="grid">` |
| 6 | コンテナ / ラッパー | Container / Wrapper | コンテンツの最大幅を制限し中央揃えにする外枠 | `<div class="container">` |
| 7 | セクション | Section | ページ内の論理的まとまりを区切る領域 | `<section>` |
| 8 | 固定ヘッダー / スティッキーヘッダー | Sticky Header | スクロールしても画面上部に固定表示されるヘッダー | `<header style="position:sticky">` |
| 9 | スプリットレイアウト | Split Layout | 画面を左右に二分割するレイアウト | `<div class="split">` |
| 10 | メイソンリーレイアウト | Masonry Layout | 高さの異なる要素をレンガ状に配置するレイアウト（Pinterest風） | `<div class="masonry">` |
| 11 | フローティングアクションボタン | FAB (Floating Action Button) | 画面右下に浮遊する丸型のアクションボタン（Material Design由来） | `<button class="fab">` |
| 12 | オーバーレイ / バックドロップ | Overlay / Backdrop | 画面全体を覆う半透明のレイヤー。モーダルの背景 | `<div class="overlay">` |
| 13 | スティッキーフッター | Sticky Footer | コンテンツが少なくてもページ最下部に固定されるフッター | `<footer class="sticky">` |

---

## 2. ナビゲーション（Navigation）

ページ間やページ内の移動を支援するパーツ。

| No. | パーツ名（日本語） | パーツ名（英語） | 説明・用途 | HTMLタグ例 |
|-----|---------------------|-------------------|------------|------------|
| 14 | ナビゲーションバー / グローバルナビ | Navigation Bar | サイト全体のページ間移動を提供する水平メニュー | `<nav>` |
| 15 | パンくずリスト | Breadcrumb | 現在のページ位置を階層的に表示するナビゲーション | `<nav class="breadcrumb">` |
| 16 | ページネーション | Pagination | コンテンツを複数ページに分割しページ間を移動するUI | `<nav class="pagination">` |
| 17 | タブ | Tab | 同一エリア内でコンテンツを切り替えるUI | `<div class="tabs">` |
| 18 | ドロップダウンメニュー | Dropdown Menu | クリックやホバーで展開するサブメニュー | `<div class="dropdown">` |
| 19 | ハンバーガーメニュー | Hamburger Menu | 三本線アイコンのメニューボタン。モバイル向け | `<button class="hamburger">` |
| 20 | メガメニュー | Mega Menu | 画面幅いっぱいに展開する大型ドロップダウンメニュー | `<nav class="mega-menu">` |
| 21 | サイドナビゲーション | Side Navigation | 画面左側に縦配置されるナビ。管理画面向け | `<nav class="side-nav">` |
| 22 | 目次 / テーブルオブコンテンツ | Table of Contents (TOC) | ページ内見出しをリスト化しジャンプできるナビ | `<nav class="toc">` |
| 23 | スクロールトップボタン | Scroll to Top | ページ上部へ一気にスクロールするボタン | `<button class="scroll-top">` |
| 24 | ボトムナビゲーション | Bottom Navigation | 画面下部に固定されるモバイル向けメインナビ（iOS/Android標準） | `<nav class="bottom-nav">` |
| 25 | アンカーナビ / スクロールスパイ | Anchor Nav / Scroll Spy | スクロール位置に応じてアクティブ項目が切り替わるナビ | `<nav class="anchor-nav">` |
| 26 | 戻るボタン | Back Button | 前のページや上位階層に戻るためのボタン | `<button class="back">` |

---

## 3. フォーム（Form）

ユーザーからの入力・操作を受け付けるパーツ。

| No. | パーツ名（日本語） | パーツ名（英語） | 説明・用途 | HTMLタグ例 |
|-----|---------------------|-------------------|------------|------------|
| 27 | ボタン | Button | アクションを実行するインタラクティブ要素（Primary/Outline/Text） | `<button>` |
| 28 | テキストフィールド / 入力欄 | Input / Text Field | ユーザーがテキストを入力する領域 | `<input type="text">` |
| 29 | テキストエリア | Textarea | 複数行テキスト入力のフォーム要素 | `<textarea>` |
| 30 | セレクトボックス / プルダウン | Select / Dropdown | 選択肢から1つを選ぶフォーム要素 | `<select>` |
| 31 | チェックボックス | Checkbox | 複数選択可能なフォーム要素 | `<input type="checkbox">` |
| 32 | ラジオボタン | Radio Button | 排他的選択のフォーム要素 | `<input type="radio">` |
| 33 | トグルスイッチ | Toggle Switch | ON/OFFを切り替えるスイッチ型UI | `<input type="checkbox">` + CSS |
| 34 | 検索バー / サーチボックス | Search Bar | キーワード入力でコンテンツを検索するUI | `<input type="search">` |
| 35 | ファイルアップロード | File Upload | ファイル選択・アップロード用UI（D&D対応） | `<input type="file">` |
| 36 | レンジスライダー | Range Slider | 数値範囲を視覚的に選択するスライダーUI | `<input type="range">` |
| 37 | 日付ピッカー | Date Picker | カレンダーUIから日付を選択するフォーム要素 | `<input type="date">` |
| 38 | オートコンプリート / サジェスト | Autocomplete | 入力中にリアルタイムで候補を表示するUI | `<input>` + `<ul>` |
| 39 | 星評価入力 | Star Rating Input | 星の数で評価を入力するフォーム要素 | `<div class="star-rating">` |
| 40 | パスワード入力 | Password Input | 表示/非表示トグル付きパスワード入力欄 | `<input type="password">` |
| 41 | 数値ステッパー | Number Stepper | +/−ボタンで数値を増減する入力UI | `<input type="number">` |
| 42 | カラーピッカー | Color Picker | 色を視覚的に選択するUI | `<input type="color">` |
| 43 | OTP入力 | OTP Input | ワンタイムパスワード用の分割入力フィールド（認証画面） | `<input maxlength="1">` ×6 |
| 44 | タグ入力 / マルチセレクト | Tag Input / Multi-Select | 複数の値をタグ形式で追加・削除できる入力UI | `<div class="tag-input">` |
| 45 | インライン編集 | Inline Edit | テキストをクリックするとその場で編集可能になるUI | `<span contenteditable>` |

---

## 4. コンテンツ（Content）

情報やデータを表示・整理するためのパーツ。

| No. | パーツ名（日本語） | パーツ名（英語） | 説明・用途 | HTMLタグ例 |
|-----|---------------------|-------------------|------------|------------|
| 46 | カード | Card | 画像・テキスト・ボタンをまとめた箱型UI | `<div class="card">` |
| 47 | モーダル / ダイアログ | Modal / Dialog | オーバーレイで表示されるポップアップ | `<dialog>` |
| 48 | アコーディオン | Accordion | クリックで開閉するコンテンツパネル | `<details>` + `<summary>` |
| 49 | ツールチップ | Tooltip | ホバー時に表示される小さな説明ボックス | `<div class="tooltip">` |
| 50 | テーブル / 表 | Table | データを行と列で整理して表示する要素 | `<table>` |
| 51 | カルーセル / スライダー | Carousel / Slider | 複数コンテンツを横スライドで切り替えるUI | `<div class="carousel">` |
| 52 | リスト | List | 項目を縦に並べて表示するUI | `<ul>` / `<ol>` |
| 53 | 引用ブロック | Blockquote | 引用を視覚的に区別して表示する要素 | `<blockquote>` |
| 54 | コードブロック | Code Block | プログラムコードを等幅フォントで表示する領域 | `<pre><code>` |
| 55 | タイムライン | Timeline | 時系列の出来事を縦線に沿って表示するUI | `<div class="timeline">` |
| 56 | ギャラリー | Gallery | 画像をグリッド状に一覧表示するUI | `<div class="gallery">` |
| 57 | 空状態 / エンプティステート | Empty State | データが無い場合のプレースホルダー | `<div class="empty-state">` |
| 58 | ドロワー | Drawer / Side Panel | 画面の端からスライドインするパネル | `<div class="drawer">` |
| 59 | ポップオーバー | Popover | 要素付近に表示される情報パネル。ツールチップより大きい | `<div class="popover">` |
| 60 | テスティモニアル（お客様の声） | Testimonial | 顧客の声や推薦文をカード形式で表示するUI | `<div class="testimonial">` |
| 61 | プロフィールカード | Profile Card | ユーザー情報をまとめて表示するカード | `<div class="profile-card">` |
| 62 | Read More テキスト | Expandable Text | 一定行数で切り詰め「続きを読む」で展開するUI | `<div class="read-more">` |
| 63 | ライトボックス | Lightbox | 画像をクリックで拡大表示するオーバーレイUI | `<div class="lightbox">` |
| 64 | 画像比較スライダー | Image Comparison Slider | 2枚の画像をスライダーで比較するUI（Before/After） | `<div class="compare">` |
| 65 | 通知パネル | Notification Panel | 通知一覧を表示するドロップダウン型パネル | `<div class="notifications">` |

---

## 5. フィードバック（Feedback）

ユーザーへの状態通知・応答に関わるパーツ。

| No. | パーツ名（日本語） | パーツ名（英語） | 説明・用途 | HTMLタグ例 |
|-----|---------------------|-------------------|------------|------------|
| 66 | アラート / 通知バー | Alert / Banner | 成功・警告・エラーのフィードバックメッセージ | `<div class="alert">` |
| 67 | トースト通知 | Toast Notification | 自動的に消えるポップアップ通知 | `<div class="toast">` |
| 68 | プログレスバー | Progress Bar | 処理の進捗を示す横棒グラフ型UI | `<div class="progress">` |
| 69 | スピナー / ローディング | Spinner / Loading | 読み込み中を示すアニメーション要素 | `<div class="spinner">` |
| 70 | スケルトンスクリーン | Skeleton Screen | 読み込み中にレイアウト輪郭を仮表示するUI | `<div class="skeleton">` |
| 71 | バリデーションメッセージ | Validation Message | フォーム入力の正誤をリアルタイムで表示 | `<span class="error-msg">` |
| 72 | 確認ダイアログ | Confirmation Dialog | 重要な操作前に確認を求めるダイアログ（削除確認等） | `<dialog>` |
| 73 | エラーページ (404) | Error Page (404) | ページが見つからない時に表示する専用画面 | HTML page |
| 74 | ローディングオーバーレイ | Loading Overlay | 画面全体を覆うローディング表示 | `<div class="loading-overlay">` |
| 75 | カウントダウンタイマー | Countdown Timer | 残り時間を表示するタイマーUI（セール等） | `<div class="countdown">` |
| 76 | 成功ページ | Success Page | 操作完了を伝える専用画面（送信完了等） | HTML page |

---

## 6. 装飾（Decoration）

見た目の演出や補助的な表現に使われるパーツ。

| No. | パーツ名（日本語） | パーツ名（英語） | 説明・用途 | HTMLタグ例 |
|-----|---------------------|-------------------|------------|------------|
| 77 | バッジ | Badge | ステータスやカテゴリーを示す小さなラベル | `<span class="badge">` |
| 78 | タグ / チップ | Tag / Chip | カテゴリー分類やフィルター選択のラベル要素 | `<span class="tag">` |
| 79 | アバター | Avatar | プロフィール画像やイニシャルの丸形表示 | `<div class="avatar">` |
| 80 | ディバイダー / 区切り線 | Divider / Separator | コンテンツ間を視覚的に区切る水平線 | `<hr>` |
| 81 | アイコン | Icon | 意味や機能を伝えるシンボル（Font Awesome等） | `<i>` / `<svg>` |
| 82 | リボン / ラベル | Ribbon | カードの角に配置される帯状の装飾 | `<div class="ribbon">` |
| 83 | ステップインジケーター | Step Indicator | 複数ステップの進捗を可視化するUI | `<div class="stepper">` |
| 84 | シェイプディバイダー / 波形区切り | Shape Divider | セクション間を波形や斜線で区切る装飾要素 | `<svg>` |
| 85 | 通知ドット / インジケーター | Notification Dot | 未読や新着を示す小さなドット | `<span class="dot">` |
| 86 | グラスモーフィズム | Glassmorphism | すりガラス風の半透明エフェクト（CSS効果） | `backdrop-filter` |
| 87 | グラデーションテキスト | Gradient Text | テキストにグラデーションを適用する装飾（CSS効果） | `background-clip: text` |
| 88 | ホバーカードエフェクト | Hover Card Effect | マウスオーバーで浮き上がる等のカード演出 | `transform` + `box-shadow` |
| 89 | フローティングラベル | Floating Label | 入力時にプレースホルダーが上に移動するラベル | `<label class="floating">` |
| 90 | スクロールアニメーション | Scroll Animation | スクロールに連動して要素がフェードイン等する演出（AOS等） | `IntersectionObserver` |

---

## 7. メディア（Media）

画像・動画・音声などのメディアに関わるパーツ。

| No. | パーツ名（日本語） | パーツ名（英語） | 説明・用途 | HTMLタグ例 |
|-----|---------------------|-------------------|------------|------------|
| 91 | レスポンシブ画像 | Responsive Image | 画面サイズに応じた最適サイズで表示される画像 | `<picture>` / `<img>` |
| 92 | 動画埋め込み | Video Embed | YouTube等の動画をページ内に埋め込む要素 | `<iframe>` / `<video>` |
| 93 | オーディオプレイヤー | Audio Player | 音声ファイル再生UI | `<audio controls>` |
| 94 | 画像オーバーレイ | Image Overlay | 画像上に半透明レイヤーを重ねる演出 | `<div class="overlay">` |
| 95 | Before/Afterスライダー | Before/After Slider | 2枚の画像をスライダーで比較するメディアUI | `<div class="compare">` |
| 96 | 埋め込みマップ | Embedded Map | Google Maps等をページ内に表示する要素 | `<iframe>` |
| 97 | 遅延読み込みプレースホルダー | Lazy Load Placeholder | 画像の遅延読み込み中に表示するプレースホルダー | `loading="lazy"` |
| 98 | 画像ズーム | Image Zoom | 画像をホバーやクリックで拡大表示する機能（EC商品画像） | `<div class="zoom">` |

---

## 8. Eコマース（E-commerce）

ECサイトや商品販売に特化したパーツ。

| No. | パーツ名（日本語） | パーツ名（英語） | 説明・用途 | HTMLタグ例 |
|-----|---------------------|-------------------|------------|------------|
| 99 | 料金テーブル | Pricing Table | 料金プランを並べて比較表示するUI | `<div class="pricing">` |
| 100 | 商品カード | Product Card | EC商品情報をまとめて表示するカード | `<div class="product-card">` |
| 101 | 星評価表示 | Star Rating Display | レビュー平均評価を星で表示するUI | `<div class="rating">` |
| 102 | クーポン / バナー | Coupon Banner | 割引コードやキャンペーン情報のバナー | `<div class="coupon">` |
| 103 | カートアイコン | Cart Icon | ショッピングカートの状態を示すアイコン | `<div class="cart-icon">` |
| 104 | 数量セレクター | Quantity Selector | +/−ボタンで商品数を選択するUI | `<div class="qty">` |
| 105 | サイズセレクター | Size Selector | 商品サイズを選択するボタングループ（アパレル） | `<div class="size-select">` |
| 106 | カラースウォッチ | Color Swatch | 商品カラーを色丸で選択するUI | `<div class="swatch">` |
| 107 | 注文サマリー | Order Summary | 注文内容・合計金額をまとめる確認パネル | `<div class="order-summary">` |
| 108 | 配送ステータス | Shipping Progress | 配送状況をステップ表示するUI | `<div class="shipping">` |

---

## 9. ソーシャル（Social）

SNS連携やコミュニケーションに関わるパーツ。

| No. | パーツ名（日本語） | パーツ名（英語） | 説明・用途 | HTMLタグ例 |
|-----|---------------------|-------------------|------------|------------|
| 109 | SNSシェアボタン | Social Share Buttons | コンテンツをSNSで共有するボタン群 | `<div class="share">` |
| 110 | コメント欄 | Comment Section | コメント投稿・閲覧用UI | `<div class="comments">` |
| 111 | いいねボタン | Like Button | 好意的リアクションを示すボタン | `<button class="like">` |
| 112 | フォローボタン | Follow Button | ユーザーやチャンネルをフォローするボタン | `<button class="follow">` |
| 113 | チャットUI | Chat UI | メッセージのやり取りを表示するUI | `<div class="chat">` |
| 114 | ユーザープロフィールカード | User Profile Card | ユーザー情報・統計をまとめたカード | `<div class="profile">` |
| 115 | アクティビティフィード | Activity Feed | 操作履歴やアクティビティの時系列表示 | `<div class="feed">` |
| 116 | 通知リスト | Notification List | 通知をリスト形式で一覧表示するUI | `<div class="notif-list">` |
| 117 | リアクションピッカー | Reaction Picker | 絵文字でリアクションを選択するUI（Slack/Facebook風） | `<div class="reactions">` |

---

## 10. データ表示（Data Display）

数値やデータを可視化するパーツ。

| No. | パーツ名（日本語） | パーツ名（英語） | 説明・用途 | HTMLタグ例 |
|-----|---------------------|-------------------|------------|------------|
| 118 | 統計カウンター | Stat Counter | 数値実績を大きく表示するパーツ | `<div class="stat">` |
| 119 | KPIカード | KPI Card | 重要指標をカード形式で表示するUI | `<div class="kpi">` |
| 120 | ランキング | Ranking List | 順位付きリスト | `<ol class="ranking">` |
| 121 | 棒グラフ | Bar Chart | 棒の長さでデータを比較するチャート | `<div class="chart">` |
| 122 | ドーナツチャート / 円グラフ | Donut Chart | 割合を円形で表示するチャート | `<svg>` |
| 123 | 折れ線グラフ | Line Chart | 時系列データの推移を線で表示するチャート | `<svg>` / `<canvas>` |
| 124 | スパークライン | Sparkline | テキスト内やテーブル内に埋め込む極小チャート | `<svg class="sparkline">` |
| 125 | プログレスサークル | Progress Circle | 円形の進捗インジケーター | `<svg>` |
| 126 | ゲージ / メーター | Gauge / Meter | 速度計のような半円形のデータ表示 | `<svg>` / `<meter>` |
| 127 | ヒートマップ | Heatmap | データの密度や強度を色の濃淡で表現する図 | `<div class="heatmap">` |

---

## 11. タイポグラフィ（Typography）

テキストの表現・装飾に関わるパーツ。

| No. | パーツ名（日本語） | パーツ名（英語） | 説明・用途 | HTMLタグ例 |
|-----|---------------------|-------------------|------------|------------|
| 128 | 見出し階層 | Heading Hierarchy | h1〜h6の見出し要素。文書構造・SEOに重要 | `<h1>`〜`<h6>` |
| 129 | リード文 / イントロテキスト | Lead Text | 本文冒頭のやや大きめの導入テキスト | `<p class="lead">` |
| 130 | キャプション / 注釈 | Caption | 画像・図表の下に添える小さな説明テキスト | `<figcaption>` |
| 131 | ハイライト / マーカー | Highlight / Marker | テキストに蛍光マーカー風の背景を付ける装飾 | `<mark>` |
| 132 | ドロップキャップ | Drop Cap | 段落先頭文字を大きく表示する装飾手法 | `::first-letter` |
| 133 | テキストリンク | Text Link / Anchor | テキスト内のハイパーリンク | `<a href>` |
| 134 | リストスタイル | List Styles | 番号付き/箇条書きリストの装飾パターン（カスタムマーカー） | `<ul>` / `<ol>` |
| 135 | 省略テキスト (ellipsis) | Text Truncation | 長いテキストを…で省略する表示パターン | `text-overflow: ellipsis` |
| 136 | インラインコード | Inline Code | 本文中にコードを等幅フォントで表示する要素 | `<code>` |
| 137 | 定義リスト | Definition List | 用語と定義のペアで構成されるリスト | `<dl>` + `<dt>` + `<dd>` |

---

## カテゴリ別 集計

| カテゴリ | 英語名 | 件数 |
|----------|--------|------|
| レイアウト | Layout | 13 |
| ナビゲーション | Navigation | 13 |
| フォーム | Form | 19 |
| コンテンツ | Content | 20 |
| フィードバック | Feedback | 11 |
| 装飾 | Decoration | 14 |
| メディア | Media | 8 |
| Eコマース | E-commerce | 10 |
| ソーシャル | Social | 9 |
| データ表示 | Data Display | 10 |
| タイポグラフィ | Typography | 10 |
| **合計** | | **137** |

---

*WEB Design Parts Reference — 137パーツ・11カテゴリ収録*
