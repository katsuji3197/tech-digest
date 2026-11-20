---
title: 「Claude とリーマン予想を証明した」――Anthropic の数学者が Lean の形式証明を公開、独立検証は「怪しい可能性はほぼゼロ」
date: 2026-11-20
order: 1
teaser: 167年未解決のリーマン予想（と、ディリクレ L 関数についての一般化リーマン予想）を Claude と証明したと、Anthropic の Levent Alpöge 氏が発表。証明は Lean で書かれ、17万5187モジュールがエラーなくコンパイルされ、独立した複数のカーネルも受理しました。ただ、最終確認の comparator はまだ途中です。
cover: /images/2026-11-21-extra-riemann-claude/riemann-hero.jpg
cover_caption: Scientific American の記事に使われたイメージ画像（画像: [Scientific American「Anthropic mathematician claims to prove Riemann hypothesis」](https://www.scientificamerican.com/article/anthropic-mathematician-claims-to-prove-riemann-hypothesis-most-famous-problem-in-all-of-math/)、vectorfusionart via Shutterstock）
---

Anthropic に所属する数学者の Levent Alpöge 氏が米国時間11月20日、**Claude と組んでリーマン予想の証明を見つけた**と自身のサイトで発表しました。「私は Claude と共に、リーマン予想の証明を発見したと考えている」という趣旨の声明です（The Verge、Scientific American）。証明は論文ではなく、定理証明支援系 **Lean** のコードとして公開されました。外部の研究者による検証は日本時間21日朝の時点でほとんどの項目をパスしていますが、まだ確定ではありません。

## 背景

リーマン予想は1859年に Bernhard Riemann が出した予想で、素数の分布に隠れた規則があるという内容です。クレイ数学研究所が100万ドルの賞金をかけた7つのミレニアム懸賞問題のひとつで、Scientific American は「数学で最も有名な未解決問題」と書いています。

2026年は AI による数学の成果が相次いだ年でした。Alpöge 氏は7月に Claude が生成したヤコビアン予想の解をツイートして注目を集めています。9月には OpenAI が別のミレニアム問題であるナビエ–ストークス方程式の問題を解いたと主張しましたが、未公開の研究を使ったという疑惑も出ました（The Verge）。なお Anthropic は8月の時点で「Claude が使った手法がリーマン予想の証明につながるとは考えていない」と書いていました（The Verge）。

## 何が起きたか

- **主張の範囲**: Alpöge 氏はリーマン予想に加え、**一般化リーマン予想（GRH）**も解けたとしています。検証ページによると、ここでの GRH はディリクレ L 関数についてのものです。証明には Mathlib にある `RiemannHypothesis` の定義そのものが使われています（MIT の検証ページ）
- **独立検証**: MIT の Andrew Sutherland 氏が Claude Code を使って検証を進め、結果を公開しています。日本時間21日7時5分（22:05 UTC）の更新では、**17万5187モジュールすべてがエラーなくコンパイル**され、使っている公理は Lean 標準の3つだけでした。Rust 製の nanoda や con-leche など、独立して書かれたカーネルも証明全体を受理しています。証明の書き出しは圧縮で7.7GB、展開すると約61.6GBあります
- **残っている確認**: 定理の記述が本当にリーマン予想を指しているか、記号の意味を書き換えていないかを確かめる `lake comparator` の全工程と、Lean 標準カーネルでの再検査はまだ実行中です（同ページ）
- **発表の時期**: Alpöge 氏は日曜の深夜に Dario Amodei CEO へメッセージを送り、木曜（11月19日）の Anthropic 上場を待って公表したようです。Anthropic 自身はコメントしていません（The Verge）

## なぜ重要か

数学への影響はもちろん大きいですが、開発者として注目したいのは **「AI の出力を、機械が検査できる形で出した」** という点です（編集部の視点）。長い論文なら専門家が何か月もかけて読みますが、Lean の証明は発表から半日で第三者がコンパイルし直し、別実装のカーネルにもかけられました。AI が書いたコードを型チェックやテスト、CI で確かめる考え方を、極端な規模でやってみせた例と言えます。一方で、最後まで問題になるのは「**正しい問いを証明したか**」という定理の記述のほうです。AI に仕事を任せたとき、出力よりも仕様が正しいかを人間が確かめる必要がある点は、ソフトウェアでも同じです（編集部の視点）。

## 反応・論点

- MIT の Sutherland 氏は「Lean の証明はコンパイルされ、Lean カーネルが標準の3つの公理だけで独立に再検査した。正直、何か怪しい点がある可能性はほぼゼロだ」という趣旨のコメントをしています（Scientific American）
- Imperial College London の Kevin Buzzard 氏は、まず「Lean コードの定理の記述が実際の定理と一致しているか」を問うべきだとし、記号の再定義がないかを確かめる comparator の結果を待っていると書いています（Scientific American）
- チリ・カトリック大学の Hector Pasten 氏は、正しければ数学の異なる分野をつなぐ「ロゼッタストーンのようなもの」になると話しています（Scientific American）
- クレイ数学研究所の規定では、懸賞の対象になるには出版後2年の検証期間を経て、数学界に広く受け入れられる必要があります（The Verge）

## 参考リンク

- Scientific American: [Anthropic mathematician claims to prove Riemann hypothesis, most famous problem in all of math](https://www.scientificamerican.com/article/anthropic-mathematician-claims-to-prove-riemann-hypothesis-most-famous-problem-in-all-of-math/)
- Scientific American: [The AI Riemann hypothesis proof is almost certainly true, independent mathematicians attest](https://www.scientificamerican.com/article/the-ai-riemann-hypothesis-proof-is-almost-certainly-true-independent-mathematicians-attest/)
- The Verge: [Anthropic mathematician claims to have solved prestigious Millennium Prize problem with Claude](https://www.theverge.com/ai-artificial-intelligence/1010051/anthropic-riemann-hypothesis-millennium-prize-problem)
- MIT（Andrew Sutherland）: [Verification files for the Lean proof of the Riemann Hypothesis](https://math.mit.edu/~drew/grh/)
- Levent Alpöge: [Remark（声明）](https://alpo.ge/remark.pdf)

**動画:** 確認できた関連動画はありません（動画なし）。
