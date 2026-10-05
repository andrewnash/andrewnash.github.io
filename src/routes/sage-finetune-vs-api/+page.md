---
title: 'I Fine-Tuned Small LLMs All Summer. Then I Shipped the API.'
image: '/sage-finetune-vs-api/dm-screen-card.png'
alt: 'Sage DM screen with a live rules card'
cover: '/sage-finetune-vs-api/bench-vs-live.png'
coverAlt: 'Fine-tuned 27B LoRAs tie gpt-6-luna on the offline bench but capture half as many live rules moments'
summary: 'Dozens of LoRA runs from Qwen 1.7B to 27B, a 3,416-card gold corpus, and an eval stack that kept moving under me. The fine-tunes matched a cheap frontier API on quality, but serving them only pays off at roughly ten tables running 24/7, and a new Luna generation at half the price made the API the right thing to design around.'
created: 2026-10-04
tags:
  - 'LLM'
  - 'Fine-tuning'
  - 'LoRA'
  - 'Evaluation'
  - 'MLOps'
  - 'Economics'
---

# I fine-tuned small LLMs all summer. Then I shipped the API.

Sage's core output is a **card**: a short, correct, cited answer to a rules question someone just asked at my D&D table, on the DM's screen within a few seconds. From June to August I tried to make a small, self-hosted model write those cards. I trained dozens of adapters from Qwen3 1.7B up to a 27B dense model, built a 3,416-card gold corpus with ~100 Opus sub-agents, and rebuilt my evaluation stack again and again.

The conclusion, up front:

> **The fine-tuned small model reached the same quality as a cheap frontier API model. But self-hosting it only pays off at volume I don't have, and when OpenAI's new Luna generation came in at roughly half the price of the one I'd been pricing against, designing around the API became the clear answer.**

The other lesson took me longer, and it's about evals: **my fine-tunes kept winning the benchmark I'd built while losing on the one I hadn't built yet.**

![The DM screen with a rules card, from a mock-campaign demo](./dm-screen-card.png)

## What a card is

Before any training, the most important decision was the card's *shape*. The model never retypes a rule. It looks up what it needs, writes ~36 words of commentary that answer the live question, and returns `{decision, commentary, cited_ids}`. The system splices the SRD text **verbatim** from the database, and `decision=SILENT` lets the model suppress itself.

![The card path](./card-path.png)

This isn't stylistic. In my grounding study, a model writing from prefetched context invented content for 3 of 4 fabricated spell names, against 1 of 14 with tool-call lookups (8.6% vs 4.5% hallucination over the whole set; ADR-0016). Paraphrased rule text is where hallucinations hide. If the model can only *point*, it can't misquote. One `sage_lookup` retriever serves training-data generation, evaluation, and production, so train = eval = serve.

## Act I: small models are shockingly good routers (June)

| Model | Method | Hardware / cost | Result |
|---|---|---|---|
| Qwen3-1.7B | QLoRA, prefix-baked SFT, assistant-masked | local RTX 3070 8 GB, **17.6 min, $0** | FIRE/SILENT accuracy **0.854 vs prod Gemini 0.510**, precision 0.659 vs 0.352, recall tie 0.957 (n=343) |
| Qwen3-4B v5.3 | QLoRA r16/α32 | local 3070 | **blind Opus pairwise 52% vs Gemini Flash Lite 45%**; composite 3.48 vs 3.35 |
| Qwen3-4B v9c | hard-negative enrichment (50% FIRE) | RunPod A4000 overnight, ~$1.5 | precision wall broken: P 0.42 → 0.62; +1.0 logit bias gives R 0.875 / P 0.70 / acc 0.95 (against corrected labels) |
| Qwen3-8B | same sweep | | precision cap ~0.49: **capacity didn't break the wall** |
| Qwen3-14B | synthesis path | RunPod | cards 3.10 vs 4B 2.85, neither near 4.5 |
| Qwen3-4B select | pick a prefetched SRD card, then guarded edit | | gated E2E **4.74 vs Gemini 4.76** (tie) |

A 1.7B model trained on a gaming GPU in 17 minutes made better FIRE/SILENT decisions than the production LLM. The first lesson came straight after: the labels were wrong before the models were. On the pairwise bench, **20 of the 4B's "33 recall misses" were mislabelled**, so the recall gap was inflated ~2.5×. On the 343-row decision set, 14% of the gold was wrong and it was about 2× too eager to fire.

The 8 GB 3070 couldn't reliably train the 4B (four VRAM thrashes in one day), so training moved to RunPod community GPUs (a 4090 at $0.34/hr, about $0.48 a run). Serving moved to W&B Serverless LoRA: $0 idle, billed per token at the base model's rate.

## Act II: the writer ceiling, and what actually moved it (June–July)

A zero-shot probe of **Qwen3-235B-A22B-Thinking** on 20 hard cases scored **4.96** with blind Opus judges and 0 fabrications, for $0.03. So the target was possible, just not in a deployable size. Distilling toward it on a 14B is where the data work happened.

**Fabrication was partly the grounding tool's fault.** When I audited the corpus, "Concentration" was retrieving *Draconic Presence*. After fixing `golden_lookup` and re-grounding, the clean rate of 1,758 FIRE cards (graded against a 100%-grounded bar) went **38% → 56% → 76%**, and then to ~96% after 366 verified rewrites. Most of the *corpus* fabrication was the retrieval tool.

**Most of the *model's* fabrication was not.** On real dogfood questions only 3% of ≤2-scored cards were retrieval gaps, and 48% were context-faithfulness errors. The clearest case: the model quoted *"casting time: 1 reaction"* and still concluded Shield is a bonus action, because the DM had asked "can I bonus action that?". That's sycophancy to the premise.

![Data levers on the 14B](./data-levers.png)

| 14B lever (168-seed real-question slice) | Real-Q score |
|---|---|
| fire-only baseline | 3.21 |
| + retrieval fix | flat (3.06 → 3.13 overall) |
| **+ 208 premise-correction rows** | **3.82** |
| + on-distribution spells (3,772 rows) | 3.96 (4.07 when judged with the verbatim splice) |
| + off-distribution volume (9,072 rows) | **3.17, a regression** |
| QC-clean 4,900 | 3.77 |

The right 208 rows beat 5,000 more rows. Data scale helped only for on-distribution, high-quality data.

| 14B on testset_v6 (254: 159 FIRE / 95 SILENT) | Quality | R / P / Acc |
|---|---|---|
| massive-r16 baseline | 3.32 | 99.4 / 68.1 / 70.5 |
| **v6** (react_corpus_v6, 3,912 cards) | 3.76 | **90.6 / 98.0 / 92.9** |
| v7 (+141 quote-compare) | 3.66 | 92.5 / 96.7 / 93.3 |
| v8 (digit-weighted CE, w=3) | 3.56 | 89.9 / 96.0 / 91.3 |
| v6-DPO (527 on-policy pairs, β=0.1) | 3.60 | 90.6 / 98.6 / 93.3 |
| v6 + Flash-Lite verify pass at serve time | 4.15 (fabrication 29 → 3) | |
| **v9** (+666 verify-task co-training rows) | **4.30** (paired +0.51 vs v6) | 91 / 97 / 93 |
| v9 + verify (strict Sonnet, n=146) | 4.47 | |

DPO never paid off. v6-DPO came in at −0.16, v11's spell-math DPO was a dead heat, v16-DPO lost 0.1, and v22b's DPO collapsed the output format. What worked was **co-training a verification task**: teach the writer to check a draft against the spliced text. The same 14B checking *its own* output caught only 41.5% of errors. Flash Lite as a separate verifier caught 93% with 0% false positives, at 1.6 s and ~$0.0005.

## Act III: 27B and the benchmark arms race (July)

A 30B arithmetic probe beat the 14B at spell math (72% vs 43%), so the base moved to **Qwen3.6-27B dense**. LoRA r=16/α=32, grad-accum 8, micro-batch 1. v17–v19 used lr 1e-4 with early stopping; v20 onward used a constant 2e-4, max-seq 3,584, unsloth 4-bit, ~2 epochs.

Meanwhile the eval kept breaking under me. v14 scored **4.71 on a 24-case gate and 3.98** on the next eval (110 cases × 3 draws). The small eval had inflated by 0.7. So I hardened it: 210 cases (35 × 6 categories), 14 golden held-outs plus 86 adversarially verified cases, 6-word-shingle decontamination, 3 draws, blind Sonnet judges, and **paired bootstrap only**.

| 27B version | Quant | Corpus (train) | GPU · cost | **210 full** | legacy-110 | hard v2-100 | Live capture | Date |
|---|---|---|---|---|---|---|---|---|
| v17 | 4-bit | 4,595 | — | **4.559** | 4.815 | 4.277 | — | 07-08 |
| v18 | 8-bit | 4,594 | A6000-class | 4.417 | 4.618 | 4.197 | — | 07-08 |
| v19 | 8-bit | 4,689 | A6000, ~$8 | 4.463 | 4.582 | **4.333** | ~12%* | 07-08 |
| v20 | 4-bit | 5,167 | A40, $3.95 | 4.465 | 4.697 | 4.210 | — | 07-11 |
| v21 | 4-bit | 7,145 | A5000, ~$1.8 (est.) | 4.441 | 4.530 | 4.343 | — | 07-12 |
| v22a | 4-bit | 10,732 | A40, $3.2 | 4.519 | 4.621 | 4.407 | — | 07-13 |
| v23 | 4-bit | 12,836 (3,230 steps) | A5000, ~16 h, ~$4.35 (est.) | 4.443 | 4.661 | 4.203 | **38.3%** | 07-14 |
| v25 | 4-bit | 13,695 | A5000, 20.1 h, $6.25 | — | — | — | 31.9% | 07-26 |
| v30 (Qwen3.8-27B) | 4-bit | 12,836 | RTX 3090, 20.2 h, $10.85 | unservable | | | | 08-24 |
| **gpt-6-luna**, zero-shot | API | — | ~$1 for the whole study | **4.541** | 4.679 | 4.390 | **72.3%** | 10-01 |

\*v19's number is live recall from an earlier harness (5/41), not the 47-moment capture gate below.

The only valid rankings are paired deltas: v18 vs v17 −0.141 [−0.298, +0.016]; v19 vs v17 −0.095; v20 vs v17 −0.094 (38W/47L/125T); **Luna vs v17 −0.017**. Everything from v17 to v22a is a statistical tie, and so is Luna. The hard v2 slice *flipped* the legacy ranking to v19 > v17 > v18, so v19's fix batch was not a null: it led the hard slice, though only within noise and unpaired. The saturated easy eval couldn't see it at all.

| 210 by category | cantrip-save | condition | interaction | lookup | over-fire | spell-math |
|---|---|---|---|---|---|---|
| v17 | 4.467 | 4.514 | 4.295 | 4.533 | 4.886 | 4.657 |
| v19 | 4.343 | 4.248 | 3.933 | 4.619 | 4.962 | 4.676 |
| v22a | 4.410 | 4.533 | 4.095 | 4.600 | 4.886 | 4.590 |
| v23 | 4.181 | 4.181 | 4.429 | 4.352 | 4.810 | 4.705 |
| Luna | 4.657 | 4.238 | 4.324 | 4.324 | 4.924 | 4.781 |

![v30 loss](./v30-loss.png)

v30 is the model I'm most fond of and the one that taught me the most about hosting. Its loss curve is textbook, including the sharp drop at the epoch boundary when it starts seeing data a second time. It was a newer base, so W&B could not attach a LoRA to it. A local 3070 served it at **0.83 tokens/second**. By August 28, every LoRA artifact I had (v19, v23, v30) was returning 404 from the hosting endpoint.

## Act IV: the promotion gate was the bug

On July 18 I ran a real five-hour session with v19 as the card writer. The stack was healthy: 2,442 utterances transcribed and 87 card-model calls. **Zero cards reached the screen.** v19 had answered `SILENT` 87 times out of 87. Every call returned `ok=true`, so the fallback never triggered.

The 210 bench scores **quality given that a card exists**. A model that never fires scores fine. From v17 to v24 every model passed it, while v19 went 87/87 SILENT in a real session and measured ~12% live recall. The bench could see neither. I built a gate that can see silence: `live_recall_gate.py` replays 114 verbatim-ASR moments from real sessions (11 questions, 13 fragments, 23 "confirms", 67 over-fire traps) through the real encoder, the real prompt builder, the real lookups, and the candidate model.

![Bench vs live](./bench-vs-live.png)

![Capture by category](./capture-by-category.png)

| Moment type (n) | Encoder | v23 | v25 | Luna v1 | Luna prompt v3.1 |
|---|---|---|---|---|---|
| question (11) | 100% | 81.8% | 63.6% | **100%** | 81.8% |
| fragment (13) | 100% | 30.8% | 7.7% | 84.6% | **92.3%** |
| confirm (23) | 91.3% | 21.7% | 30.4% | 52.2% | **73.9%** |
| **Capture (47)** | | **38.3%** | 31.9% | **72.3%** | **80.9%** |
| Junk correctly silent (67) | | 94.0% | 95.5% | 76.1% | 53.7% |

The fine-tunes had learned to be quiet. The sharpest diagnostic: I took the 27 windows v23 missed and changed only the *form* of the speech. As raw ASR it fired 14.8% of the time; as cleaned text, 22.2%; **rephrased as a question, 85.2%**. "Someone states a rule wrong" is the highest-value card in the product, and the model only knew how to answer questions. v25 tried to fix that by recasting question rows as assertions. Confirms rose +8.7 pp, but questions fell −18.2 and fragments −23.1. I had *swapped* one shape for another instead of adding one.

There was a quieter failure too. The v23 serving config (an ensemble gate plus a router hint) **had never been deployed**. The benchmark measured a configuration that production never ran.

![The eval stack](./eval-stack.png)

| Date | Benchmark | What it caught | What it missed |
|---|---|---|---|
| 06-10 | 343-row decision eval | router quality | gold 14% mislabelled, ~2× FIRE-happy |
| 06-13 | blind pairwise (80 items) | quality vs precision decomposition | judging bar too liberal |
| 06 | `card-judge-opus` | **self-judge inflation: 4.21 vs 3.73 (+0.48)** | |
| 06-28 | 30-seed gold | first ReAct verdict (2.6) | n≈30 means a ±0.4–0.5 CI |
| 06-29 | 168-seed expanded | under-firing | judged commentary alone, understated prod |
| 07-02 | testset_v6 (254) | precision / over-fire | 14 cases never named the entity |
| 07-04 | 24-case gate | | **inflated ~0.7** |
| 07-05 | 110 × 3 draws | 5 failure classes | saturated by v17 |
| 07-08 | **hardened 210** + paired bootstrap | v2 slice flipped the ranking | **blind to silence** |
| 07-10 | live_fire_eval | v19 live recall ~12% | burst fire-rate measured junk throughput |
| 07-14 | 12-scenario 1× E2E + Opus (suite built 05-23) | stream dupes, mis-anchors | inherited a `.env` that was never deployed; judge drift |
| 07-25 | **live_recall_gate (114)** | **capture vs junk-silent per moment type** | |

## Act V: the pivot

On October 1 I ran `gpt-6-luna` zero-shot through the *same* harness: the same `sage_lookup` retrieval, the same verify pass and verbatim splice. New provider, its own system prompt, native `lookup_<kind>` tools, and the old Gemini fallback switched off. The whole study cost about a dollar:

| Live E2E arm (12 scenarios, 1×, blind pooled Opus) | Cards | Card score | Relevance | Correctness | Timing | Attribution |
|---|---|---|---|---|---|---|
| v23 LoRA (production) | 78 | 3.349 | 2.846 | 3.885 | 2.821 | 3.846 |
| Luna, Gemini fallback on | 52 | 3.519 | 2.981 | 4.058 | 2.962 | 4.077 |
| Luna, fallback off, prompt v1 | 34 | **3.750** | 3.235 | **4.382** | 3.029 | 4.353 |
| Luna, no verify pass | 38 | 3.743 | 3.447 | 3.974 | 3.211 | 4.342 |
| Luna, reasoning=medium | 36 | 3.646 | 3.167 | 4.194 | 2.944 | 4.278 |
| **Luna, fallback off, prompt v2 (shipped)** | 40 | **3.706** | 3.250 | 4.225 | 3.025 | 4.325 |
| First real session (HEXG4GSJ, 1 h 41 m) | 31 | **3.92** | | 4.48 | | |

Three details here are worth more than the headline:

- **The fallback was the drag.** With the old Gemini fallback switched off, quality went up.
- **Verify buys correctness** (4.38 vs 3.97) at the cost of a little relevance.
- **Judges drift.** v23 scored 3.657 under the previous Opus judge and 3.349 under the current one, so always re-judge the baseline. (The v23 row was judged in a separate pool from the Luna arms; the fallback-on arm scored 3.476 vs 3.519 across the two pools, so the drift between pools is small.)
- I shipped prompt v2 (3.706, a tie with v1) because it answers rather than silently abstaining.

I shipped it the same day (ADR-0018). Months of LoRA rounds never beat v17; a zero-shot API model matched it on day one and doubled live capture.

## The economics

The fine-tune reached quality parity. What decided it was everything around the model.

**Serving.** Luna measures ~$0.0003 per card call at a 79% prompt-cache hit, and a live table generates ~85 card calls an hour (144 in that first 101-minute session). At my volume, one table weekly, that is **~$0.36 a month**. Luna is priced at $0.10 / $0.01 cached / $0.50 per million input / cached / output tokens. The previous Luna generation I'd been pricing against was $0.20 / $0.02 / $1.20, so the same calls would cost ~$0.00065, about 2.2× more.

![Break-even](./breakeven.png)

| Self-hosting option | $/month | Break-even card calls / month | ≈ 3.5 h sessions / month | ≈ concurrent tables, 24/7 |
|---|---|---|---|---|
| Always-on RunPod A5000 24 GB ($0.27/h) | $197 | 657K | ~2,100 | **~10** |
| Always-on RTX 3090 ($0.50/h) | $365 | 1.22M | ~3,900 | ~19 |
| Always-on Modal L4 ($0.80/h) | $584 | 1.95M | ~6,300 | ~30 |
| A5000 vs the *previous* Luna price | $197 | 303K | ~980 | ~5 |

| Scale-to-zero, one GPU per session (+0.5 h warm-up) | GPU / session | Luna / session | Ratio |
|---|---|---|---|
| A5000 | $1.08 | $0.093 | ~12× |
| L4 | $3.20 | $0.093 | ~34× |

Per-token LoRA hosting (W&B) charged base-model token rates in the same range as Luna, with no idle cost, so there was **no serving-cost argument either way**. Self-hosting starts to make sense around **ten tables running continuously**, and the price drop roughly doubled that bar. That assumes one 24 GB card can serve ten tables' worth of multi-round 4-bit 27B calls at acceptable latency, which I never measured, so it is if anything optimistic for the GPU.

**Iteration was the real cost.** The serving bill was never the expensive part. The expensive part was the loop:

| Item | Cost |
|---|---|
| GPU rental, 2026-06-10 → 08-24 (dozens of runs, reconstructed) | **≈ $80–110** |
| Typical 27B iteration | $3–11 of GPU + 16–20 h wall clock + a 630-card judge pass |
| Infra mistakes (a missing `val.jsonl` I blamed on the platform for days; a stray pod; a 5× slower torch pin) | ~$10 and a week |
| Hosting fragility | MoE-expert LoRAs unservable on vLLM; Qwen3.8 not LoRA-attachable; every artifact 404'd on 08-28 |
| Luna case study (every arm, 210s, live recall, E2E) | **≈ $1, one day** |

About 11 weeks of training never beat a zero-shot model I benchmarked in a day. That isn't a knock on small models. The 4B beat Gemini Flash Lite blind in June, and the 27B tied Luna offline. It's a statement about where a solo builder's time goes. Owning the train → eval → serve loop is a full-time job, and at one table a week nothing pays for it.

## What survived the pivot

The model was the replaceable part. Everything I built *around* it carried over unchanged, and that's why the switch took one day:

- the **verbatim splice** and `{decision, commentary, cited_ids}` contract
- **one retriever** for training, evaluation, and serving
- the **verify pass** and the DistilBERT gate in front of everything
- the **210 bench + live recall gate + 1× E2E** trio, plus blind non-self judging and paired deltas only
- the corpus methodology, which now generates eval cases instead of training data

Luna now writes the cards, the post-session summary (blind Opus preferred it 6/7, at $0.023 vs $0.076 a session), and the newest feature, a **digital DM screen**. It follows my prep notes beat by beat, moves "NOW" forward only when it is ≥0.85 confident and I haven't clicked in the last 3 minutes, and drafts NPC lines on request. Beat accuracy against blind Sonnet gold is **0.95** on one night and **0.96** during play on another (0.76 over that whole night, including off-prep stretches), versus 0.18–0.35 for name-matching alone, at **$0.013–0.014 a night** with 90% of input tokens cached.

![NPC co-pilot](./npc-copilot.png)

## When I'd fine-tune again

- **≥10 concurrent tables**, steadily, so a GPU stays busy.
- **A stable LoRA host** that supports the base I want, contractually.
- **A live recall gate in CI from day one.** Quality-given-a-card is half a metric.
- **A reason the API can't serve:** latency (the LoRA's p50 was 1.35 s vs Luna's 2.7 s), privacy, or a price that stops falling.

Until then, the most valuable things I built were the eval stack and the contract around the model.
