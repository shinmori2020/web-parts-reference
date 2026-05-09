# WEB Design Parts Reference

WEBデザインパーツの名称・用途・コード例リファレンス  
**全 200 パーツ / 11 カテゴリ / 9 タグ**

---

## 概要

WEB 制作に携わる人が、デザインパーツの **正式名称・用途・見た目・コード** をすぐに確認できる辞典・カタログ型サイト。  
カテゴリ（構造別）× タグ（用途別）× キーワード検索の **3 軸絞り込み**で目的のパーツを素早く発見できる。

## デザイン

**Crisp Mono** — 完全モノクロ・モダンフラット  
WCAG 2.1 Level AA 準拠 / Lighthouse Performance 92・Accessibility 100・SEO 100

## クイックスタート

```bash
npx http-server
# → http://127.0.0.1:8080
```

外部ライブラリ依存なし。HTML/CSS/JavaScript のみ、ビルド工程不要。

## 主要機能

- **4 軸絞り込み**：カテゴリ + タグ（複数選択 AND）+ キーワード検索 + URL 状態保持
- **キーボードショートカット**：`/`（検索）/ `Esc`（クリア）/ `Shift+E/C`（全開閉）/ `?`（ヘルプ）
- **シンタックスハイライト**：HTML を grayscale で読みやすく
- **検索ハイライト**：マッチ部分を `<mark>` で強調
- **アクセシビリティ完備**：Skip link / ARIA / `:focus-visible` / `prefers-reduced-motion`
- **オフライン対応**：IBM Plex フォントをセルフホスト

## ディレクトリ

```
.
├── index.html              ← Critical CSS + OGP インライン
├── favicon.svg / images/og.svg
├── fonts/                  ← セルフホスト IBM Plex (91KB)
├── css/                    ← components / sections / responsive
├── js/                     ← data / components / app
├── docs/                   ← 仕様書群
└── .claude/skills/         ← デザイン・a11y・perf ガイドライン
```

## ドキュメント

| ファイル | 用途 |
|---|---|
| [docs/project-summary.md](docs/project-summary.md) | **プロジェクト仕様書（正本）** |
| [docs/technical-guide.md](docs/technical-guide.md) | 技術仕様書（実装ガイド） |
| [docs/web-design-parts-list.md](docs/web-design-parts-list.md) | パーツ一覧表 |
| [docs/work-log.md](docs/work-log.md) | 作業履歴（時系列） |
| [CLAUDE.md](CLAUDE.md) | エージェント向け指示・スキル参照 |

## 対応ブラウザ

Chrome 111+ / Firefox 113+ / Safari 16.2+

## ライセンス

（未定）
