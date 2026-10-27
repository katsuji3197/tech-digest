---
title: OpenAI「指数時間仮説は偽」と発表――3-SAT を劣指数時間で解くと主張、提唱者自らが検証へ
date: 2026-10-26
order: 1
teaser: OpenAI の社内モデルが、何百本もの論文の前提になってきた指数時間仮説（ETH）の反証を生成したと発表しました。数学では局所平滑化予想の全次元での証明も公開。ただし ETH の提唱者らは「関与は正しさの認定ではない」としています。
cover: /images/2026-10-27-extra-openai-eth/openai-eth-hero.jpg
cover_caption: OpenAI の発表「Working with academic communities to build scientific understanding」の告知画像（画像: [OpenAI](https://openai.com/index/building-scientific-understanding-with-academic-communities)）
---

OpenAI は米国時間10月26日、社内の AI モデルが数学・計算機科学・物理学で3つの成果を出したと発表しました。目玉は計算機科学で、**「指数時間仮説（ETH）は偽である」**と題した論文と、定理証明支援系 Lean による形式化を GitHub で公開しています。ETH を提唱した研究者自身が検証グループを率いますが、現時点では**専門家の検証待ちの主張**です。

## 背景

**ETH** は、代表的な NP 完全問題「3-SAT」（論理式を真にする変数の割り当てがあるかを判定する問題）について、変数の数 n に対して指数時間（2 の定数倍 n 乗程度）がどうしても必要だ、とする予想です。Impagliazzo 氏、Paturi 氏、Zane 氏が提唱し、OpenAI によればグラフ理論、計算生物学、データベース、計算幾何学などの数百本の論文で「ETH が正しければこの問題は速く解けない」という形の前提に使われてきました。

数学の**局所平滑化予想**は Sogge 氏が1991年に提唱したもので、OpenAI の説明では「波が極端に集中する状態は長続きしない」という内容です。これが成り立つと、カケヤ予想とスタインの制限予想も導かれます。2次元では2019年に Guth・Wang・Zhang 各氏が、カケヤ予想の3次元は2025年に Wang・Zahl 両氏が証明していました。

## 何が起きたか

- **ETH の反証（主張）**: k を固定した k-CNF 論理式の充足割り当ての数を、**劣指数時間・多項式領域で厳密に数える決定的アルゴリズム**を示したとしています。論文の要旨では計算時間は 2^(n/(log n)^(1/2+o(1))) 程度で、k=3 の場合が ETH の反証になります。
- **日付**: OpenAI によると、AI が自然言語の反証を見つけたのは**10月16日**、Lean での形式化は**10月17日**です。論文の日付は10月25日付です。
- **Lean と論文の差**: 公開された形式化範囲の説明（lean/docs/378.md）では、Lean が証明した上界は論文が主張する上界よりやや弱いものです。
- **検証体制**: UC サンディエゴの Russell Impagliazzo、Ramamohan Paturi 両氏と MIT の Ryan Williams 氏が率いるグループが検証・解説します。参加は任意・無報酬で、NDA もありません。グループの求めで、OpenAI は生データの公開と会議の資金提供に同意しました。
- **数学**: 局所平滑化予想を2次元以上の全次元で証明し、カケヤ予想とスタインの制限予想も全次元で解決したと主張しています。AI の出力は10月18日、Lean 形式化は翌日です。
- **物理**: 4次元の量子色力学（QCD）などの数学的に厳密な存在証明です。David Gross 氏らのグループの判断で、AI が生成した資料は公開されていません。

## なぜ重要か

本当に正しければ、ETH を前提にしてきた多くの「この問題はこれ以上速くならない」という下限の根拠がなくなります。OpenAI 自身も、理論上の進歩を実用的な改善につなげるには大きな研究が必要だとしています。

（編集部の視点）示された計算時間は「辛うじて指数より小さい」程度で、多項式時間ではありません。P≠NP 問題が解けたわけではなく、xenospectrum の解説が指摘するとおり、RSA などの暗号がすぐ破れるという話でもありません。実務の SAT ソルバーや型チェッカー、依存解決ツールの速さが明日から変わることもないでしょう。それよりも、AI が研究の一線で使える結果を出し、それを Lean で機械検証し、人間が精査するという流れが定着しつつある点に注目すべきです。コードレビューで AI の出力をテストと人の目で確かめるのと同じ構図です。

## 反応・論点

- Ryan Williams 氏は X で、OpenAI の社内モデルが ETH の反証とされるものを出し、公開の独立した検証を手伝うよう依頼されたと投稿しました（日本時間27日6時35分）。別の投稿では、全探索の 2^n より驚くほど速いことになると説明しています。
- The Next Web によると、3氏は公開書簡で「私たちの関与を主張の認定と受け取らないでほしい。これほど重要な結果には慎重で独立した精査が必要だ」という趣旨を述べています。
- The Verge は、OpenAI が集めた数学の助言パネル AGMAI が前日、特定の人に先に結果を渡すやり方を AI 企業は採るべきでないと勧告していたと伝えています。
- Computational Complexity ブログでは10月18日の記事で、Lean で検証されても、定理を Lean に書き写す段階で意図と違う命題になっている可能性があると指摘されていました。

なお、X で「Exponential Time Hypothesis」または「Kakeya」を含む投稿は、それまで1日30件前後でしたが、26日（UTC）は700件を超え、27日は日本時間18時の時点で2,000件を超えています。

## 参考リンク

- [OpenAI: Working with academic communities to build scientific understanding](https://openai.com/index/building-scientific-understanding-with-academic-communities)
- [GitHub openai/math: The Exponential Time Hypothesis is False（論文）](https://github.com/openai/math/blob/main/preprints/The-Exponential-Time-Hypothesis-is-False-October-25-2026/README.md)
- [GitHub openai/math: Lean 形式化の範囲（lean/docs/378.md）](https://github.com/openai/math/blob/main/lean/docs/378.md)
- [The Verge: OpenAI announces three big science discoveries and a new way to work with academics](https://www.theverge.com/ai-artificial-intelligence/1019143/openai-eth-kaseya-science-math-physics)
- [The Next Web: OpenAI says its AI model has disproved the Exponential Time Hypothesis](https://thenextweb.com/news/openai-exponential-time-hypothesis-false-kakeya-yang-mills)
- [CNET Japan: OpenAI、「計算の難しさ」に関する長年の予想を覆す成果を得られたと発表](https://japan.cnet.com/article/35254012/)
- [xenospectrum: OpenAIのAIが計算機科学の「常識」を覆した？ 25年間信じられてきた指数時間仮説に反証を提示](https://xenospectrum.com/openai-exponential-time-hypothesis-false-claim/)
- [X: Ryan Williams 氏の投稿](https://x.com/rrwilliams/status/2114833319431209352)
- [Computational Complexity: 2026年10月のアーカイブ（10月18日「AI, Math, the document-drop. Non-Tech Thoughts」を含む）](https://blog.computationalcomplexity.org/2026/10/)

## 関連動画

**動画:** 確認できた関連動画はありません（動画なし）。
