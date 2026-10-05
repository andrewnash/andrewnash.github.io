---
title: 'Gatekeeping a Frontier LLM with a 66M-Parameter Model'
image: '/sage-distilbert-gate/cascade.png'
alt: 'Sage firing cascade'
cover: '/sage-distilbert-gate/offline-vs-live.png'
coverAlt: 'Precision/recall: offline distilled cascade at P1.0/R0.90 vs the live shipped operating point at P0.84/R0.69'
summary: 'How Sage decides when to speak: three weeks of moving the FIRE/SILENT decision from an LLM to a distilled DistilBERT. The labels were wrong before the model was, a silence timer was hiding 91% of the transcript, and distilling the arbiter made precision free. Includes a CPU microbenchmark, the cost math, and the honest gap between offline 90/90 and live P0.84/R0.69.'
created: 2026-06-21
tags:
  - 'NLP'
  - 'Distillation'
  - 'DistilBERT'
  - 'LLM'
  - 'Evaluation'
  - 'PyTorch'
---

# Gatekeeping a frontier LLM with a 66M-parameter model

[Sage](/sage-realtime-voice) listens to my D&D table and puts rules cards on the DM's screen. The hard part is not *what* to say. It's *when*. A card that shows up for "I attack the goblin" is noise, and a missed "wait, does Shield work against Magic Missile?" is the product failing at its one job.

For its first ten weeks Sage made that call with an LLM (Gemini 3.1 Flash Lite since mid-April) after every 1.5-second pause. As of June 7 it's made by a **DistilBERT student distilled from that same LLM**, which runs on CPU in ~70 ms and costs nothing when it says SILENT. This post covers the five weeks of experiments that got it there. Most of the wins came from fixing **measurement**, not from adding model capacity.

![The firing cascade](./cascade.png)

## v0: an LLM behind a silence timer

The first gate waited until every player had been quiet for 1,500 ms (500 ms if a keyword spotter heard a spell name), then asked Gemini 3.1 Flash Lite "should Sage speak?". I built a 215-case benchmark from real sessions: 90 SHOULD_FIRE, 83 SHOULD_NOT_FIRE, 41 SHOULD_NOT_DUPE. Nine parallel Opus reviewers did the labelling, and I pinned 18 cases by hand.

| Date | Version | Overall | FIRE | NOT_FIRE | NOT_DUPE |
|---|---|---|---|---|---|
| 05-02 | v0 baseline | 38.1% | 38% | 52% | 10% |
| 05-02 | + pre-LLM token-overlap dedup | 53.5% | 41% | 53% | 80% |
| 05-02 | + routing/silence prompt nudges | 58.6–61.4% | 40% | 67–76% | 78% |
| 05-02 | same prompt on **Gemini 3 Pro** | 57.2% | **0%** | 98.8% | 100% |
| 05-02 | two-stage silence classifier | 63.3% (70.6 weighted) | 30.8% | 87.1% | — |

The Pro row is my favourite result of the project. The bigger model fired **0 of 90 times**: "a clean `should_speak: false` decision every time". Capability and calibration are different axes. A stronger model is more confident that it shouldn't interrupt, which is the wrong prior for an assistant whose failure mode is silence.

## The tempting idea: a small classifier

The obvious move was to put a cheap encoder in front of the LLM. My first attempt (ADR-0012) looked like it hit a ceiling:

| Model (mega_gold_v4 test, n=1,769) | P | R | F1 | AUC-PR | AUC-ROC |
|---|---|---|---|---|---|
| Flash Lite alone | 0.517 | 0.662 | 0.581 | 0.489 | 0.774 |
| DistilBERT alone | 0.583 | 0.637 | 0.609 | 0.664 | 0.817 |
| Cascade C v2 (val-locked) | 0.596 | 0.679 | 0.635 | 0.704 | 0.846 |
| + domain MLM / bigger MLM / 3-seed ensemble | | | +0–1 pp | | |
| + game-state suffix (text or learned embedding) | | | −2 to −5 pp | | |

On the dogfood benchmark the cascade lost to the production stack by 11 points (0.658 vs 0.771 F1). The ADR concluded that I should "accept the encoder ceiling at AUC-ROC ≈ 0.82" and that the "production stack stays". **Both conclusions were wrong, and both were overturned within a day:**

1. **The 11-point gap was the prompt, not the architecture.** Swapping the production silence prompt into the cascade's stage 2 gave 0.7748 F1, against 0.7692 for LLM-alone. The encoder added ~0.6 pp of F1. Its real value was cost and latency.
2. **The "ceiling" was the labels.** Re-anchoring the gold with an LLM pass showed that on the expanded dogfood benchmark only **1% (6/620)** of FIRE labels sat on the line that actually warranted a card. On average they sat **3.62 lines late**, on a filler or connector line after the question rather than the question itself. The encoder was "being graded on a target it couldn't structurally hit".

| Fair re-anchored benchmark | P | R | F1 | LLM cost |
|---|---|---|---|---|
| **Encoder only, t=0.20** | 0.961 | 0.795 | **0.870** | $0 |
| Encoder + LLM, t=0.40 | 0.954 | 0.795 | 0.867 | per fire |
| LLM only, production prompt | 0.682 | 0.840 | 0.753 | every call |

On the re-anchored mega_gold set, AUC-ROC went from 0.82 to **0.943**. A $3 Opus diagnosis pass answered what a $337 labelling plan had been aimed at the wrong way. To validate the re-anchor I hand-labelled 100 cases myself, then scaled that to thousands of examples labelled by Opus, seeded from my labels. On the validation set the re-anchor agreed 87% exactly and 91% within ±1 line.

Embedding the classifier's inputs makes the point visually. Held-out filler lines ("ok", "nice", "lol") sit inside the dense NO_FIRE end of the head's input manifold, 3–6× closer to training NO_FIRE than non-filler lines are:

![DistilBERT head-input embeddings, PCA](./filler-pca.png)

## The timer was the real gate

With a working encoder I instrumented the live funnel and found the actual bottleneck:

![The funnel](./funnel.png)

| Same 95-min session, 1× replay | Lines | Triggers | Model calls | Cards | Bench recall | Utterance → card p50 |
|---|---|---|---|---|---|---|
| 1,500 ms timer, then encoder + LLM | 1,295 | 116 | 4 agent calls | **5** | 9.5% | 5.2 s |
| No timer, encoder as gate | 1,340 | 921 | 81 encoder FIRE (840 SILENT at $0) | **27** | 26.2% | 4.1 s |

(Both runs used the pre-distillation encoder from late May, not the one that shipped.)

**The silence timer filtered 91% of the transcript before any model saw it.** At a lively table someone is always talking, so the "everyone quiet for 1.5 s" condition almost never held. I deleted `silence_gate.py` and replaced it with an `UtteranceBatcher` that kept the four behaviours that mattered: all players silent, a 300 ms debounce, skipping pure damage math, and monologue suppression.

Dedup got the same treatment. A 180-second "don't repeat a topic" window collapsed fire recall from 73% to 20%. The sweep makes the trade obvious, with production in the circled cell:

![Dedup sweep](./dedup-heatmap.png)

Cutting the window from 180 seconds to 20 was worth **+28.6 pp** F1 on its own. Combined with a 12-line-context encoder it took end-to-end micro F1 from 0.278 to 0.589 (true positives 33 → 96). Short windows leaked cascades ("Remove Curse" fired 47 times in one session), so ADR-0014 replaced fixed windows with **novelty memory**:

```text
novelty = max over shown cards of  0.5^(Δordinal / 12) · similarity · tier_confidence
tiers: fingerprint 1.0 · token 0.55 · embedding 0.85     fatigue: base / (1 + k·(n−1))
```

That's a half-life measured in *conversation lines* rather than seconds, and it re-opens a topic if someone asks a question. Cards per session went from 324 to 126 (−61%), "appropriate" rose from 20% to 29%, recall dropped from 97.6% to 88.1%, and Remove Curse went from 47 cards to 16. The first version shipped at threshold 0.40 and regressed. The replay loop caught it.

**Then I made a mistake.** I flipped the encoder to be the hard gate, and recall on the benchmark dropped to **19%**. It was silencing four out of five moments that deserved a card. I demoted it to advisory the next day, so the LLM decided again. That raised a question I hadn't asked yet: *whose* decision was the encoder supposed to reproduce?

## Find the arbiter, then distill it

Every encoder so far had been trained on human or Opus labels and then served in front of an LLM gate that disagreed with those labels. Teacher ≠ gold. The fix ("Path A") was blunt:

> If an LLM makes the final call at runtime, that LLM defines truth. Distill *it*, and grade against *it*.

![Distilling the arbiter](./distillation.png)

The production gate (Flash Lite, selective prompt, temperature 0) labels the training sessions' candidate pool, re-windowed to the same 12 lines the server sees. A DistilBERT student learns those labels. At runtime the student runs with a recall-biased threshold, and anything it fires goes to the same LLM gate. **Every emitted card has therefore passed the teacher, which is the gold. Precision is 1.0 by construction, and the only open question is recall.**

| Offline, gate self-gold (s68 + s72_sage) | BERT alone P / R | BERT+LLM P / R | Burst P / R | Bursts recalled |
|---|---|---|---|---|
| thr 0.03 | 0.718 / 0.930 | 1.000 / 0.930 | 1.000 / 0.934 | 113 / 121 |
| thr 0.04 | 0.734 / 0.917 | 1.000 / 0.917 | 1.000 / 0.934 | 113 / 121 |
| thr 0.05 | 0.742 / 0.911 | 1.000 / 0.911 | 1.000 / 0.926 | 112 / 121 |
| **thr 0.06 (shipped)** | **0.750 / 0.902** | **1.000 / 0.902** | **1.000 / 0.909** | **110 / 121** |
| thr 0.08 | 0.759 / 0.888 | 1.000 / 0.888 | 1.000 / 0.893 | 108 / 121 |

What failed on the way, all of it teacher ≠ gold or window ≠ window:

| Attempt | Result |
|---|---|
| Strict-rubric DeepSeek relabel as teacher | fire-vs-declaration AUC 0.47, chance level |
| DeepSeek / permissive Gemini as teacher | permissive student, P 0.58–0.65 |
| Teacher relabelled on 4-line windows, evaluated on 12-line | fired 27% in training vs 65% at eval |
| Cross-encoder novelty discriminator | trained to chance (loss 0.71) |
| **RoBERTa-base (125M) as student** | recall 0.78 vs DistilBERT's 0.90, at ~2× the latency |

The smaller model won. RoBERTa-large did no better than base.

### The model

| Property | Value |
|---|---|
| Architecture | `DistilBertForSequenceClassification`: 6 layers, d=768, FFN 3072, 12 heads, uncased WordPiece (30,522) |
| Parameters | **66,955,010**, fp32, 268 MB safetensors |
| Head | Linear(768→768) → ReLU → Dropout(0.3) → Linear(768→2), softmax P(FIRE) |
| Pre-training | `distilbert-base-uncased` → 1 epoch domain MLM (15.6k table-talk chunks + FIREBALL + CRD3, mask 0.15, lr 5e-5, bs 16, because 32 thrashes an 8 GB RTX 3070) |
| Distillation | BCE(p_student, teacher label). The "soft" pipeline was built for probabilities, but the gate returns a decision, so in practice the targets are 0/1. Script defaults: 4 epochs, lr 3e-5, wd 0.01, seed 7 |
| Input | 12 lines (11 context + the anchor), `Speaker: text`, truncated to **256 tokens** (see the bug below) |
| Split | grouped by session: train s61–s66, s70–s72 + 7xew2hm7; val s67/s69; test s68/s72_sage/whcr2x |
| Threshold | 0.06 on raw softmax (recall-biased router) |
| Serving | plain PyTorch, `run_in_executor` off the event loop, no ONNX or quantization (see below) |

## Shipping it live

Offline 90/90 is not a live product. ADR-0015 activated the cascade with `ENCODER_GATE_MODE=hard` plus six live settings. I measured each configuration with 1× real-time replays of a 137-minute session through the real backend and WebSocket:

| Config | Burst P | Burst R | Cards | WRONG_TRIGGER | CASCADE_DUP |
|---|---|---|---|---|---|
| LLM gate + post-hoc text-overlap anchor | — | — | | **57–61%** | |
| Cascade + encoder-fired anchor | 0.759 | 0.714 | 146 | 9% | |
| + selective prompt + in-flight coalescing + anchor refine | 0.795 | 0.615 | 131 | 7% | |
| per-utterance firing, without refine | 0.786 | 0.648 | 129 | 41% | |
| **+ semantic-topic dedup (cos ≥ 0.78) + refine: SHIPPED** | **0.843** | **0.692** | **162** | **6%** | **0** |

![Wrong-trigger rate](./wrong-trigger.png)

The biggest user-visible win was **anchoring**. The old pipeline placed a card by searching backwards for text overlap with the card body, and 61% of cards landed under the wrong line. Now the encoder scores a pinned transcript snapshot, and its `anchor_ordinal` is threaded through `SagePipeline._run_synthesis` to the dashboard. The card lands under the line the model actually scored, by construction.

### The honest gap

![Offline vs live](./offline-vs-live.png)

Offline: P 1.000 / R 0.909. Live: P 0.843 / R 0.692. I deliberately did not chase "live 90/90", for two reasons:

- **Cardinality.** The per-line gate-gold operating point emits ~940 cards a session. That's the right yardstick for "does the student reproduce the teacher", and the wrong one for an anti-spam DM co-pilot that ships 162.
- **Train/serve window skew.** Offline windows are the clean 12 lines around a gold anchor. Live, the encoder fires on an *incremental* window while people are still talking. Closing that means rewriting the live window to match training, which is a multi-day job I've deferred and documented.

The design doc has a line I keep coming back to: *do not read the offline 90/90 as a live SLA.*

## Volume, not quality: the necessity gate

With timing fixed, the remaining problem was that too many cards were technically correct but unnecessary. Before tuning anything I fixed the judge. Gemini scoring its own cards gave **4.21**/5, while an independent blind Opus judge on the same 146 cards gave **3.73** (attribution 4.97 vs 4.47). Self-judging inflated scores by half a point, and a per-card judge is structurally blind to session-level over-firing.

The key insight is in the gate's docstring: *the pre-synthesis window does not carry the necessity signal.* By construction it is a moment the encoder already fired on, and even Gemini 3 Pro fires on 100% of those windows. So the necessity gate judges the **finished card** instead: "would a DM want this now?"

![Necessity gate](./necessity-gate.png)

| Run (s72_sage, Opus-judged) | Cards | Opus avg | ≥4 | ≤2 | DM-necessary | Over-fire | Human-label hits |
|---|---|---|---|---|---|---|---|
| Baseline cascade | 146 | 3.735 | 45.9% | 6.85% | 40.4% | 59.6% | 23 / 56 |
| Necessity v1 | 80 | 4.400 | 78.8% | 0% | 75.0% | 25.0% | 22 / 56 |
| **Necessity v2 (+ redundancy clause), shipped** | **62** | **4.565** | 83.9% | 0% | 72.6% | **27.4%** | 16 / 56 |

The trade is explicit: −58% volume and +0.83 quality, for some recall on human-labelled moments. Two more findings:

- **Stronger judges rationalize keeping cards.** Offline, with flash-lite as the necessity judge, 78% of the cards it kept were judged necessary. With DeepSeek as the judge that was 44%, and Gemini 3 Pro silenced nothing.
- A fine-tuned Qwen 4B as the judge rubber-stamped: DROP-recall 17% vs flash-lite's 50%.

One embarrassing bug: a `ResilientAgent` wrapper hid the `.llm` attribute, so the gate silently **failed open on all 138 decisions** of a full replay. A keep/drop counter in the run script is the only reason I noticed.

## Speed and cost

I microbenchmarked the shipped checkpoint on 200 real 12-line windows from three sessions (zb6m, whcr2x, s71), taking the best of 3 per window on a desktop i7-9700K, with exactly the gate's tokenization.

![Gate latency](./gate-latency.png)

| Configuration | p50 | p95 | p99 | Fire rate @ 0.06 |
|---|---|---|---|---|
| fp32, CPU, 1 thread | 174 ms | 241 ms | 250 ms | 32.5% |
| fp32, CPU, 2 threads | 102 ms | 143 ms | 149 ms | 32.5% |
| **fp32, CPU, 4 threads** | **70 ms** | **89 ms** | **91 ms** | 32.5% |
| fp32, CPU, 8 threads | 56 ms | 70 ms | 73 ms | 32.5% |
| int8 dynamic quantization, CPU, 4 threads | 50 ms | 67 ms | 70 ms | **69.5%** |
| fp32, RTX 3070 | 9 ms | 12 ms | 12 ms | 32.5% |
| Flash Lite gate call (serial, offline throughput) | ~920 ms | | | |

Two engineering notes came out of the benchmark.

**Dynamic int8 quantization breaks a recall-biased gate.** `quantize_dynamic` on the Linear layers is ~28% faster, but at threshold 0.06 it **changed 39% of decisions** and more than doubled the fire rate (32.5% → 69.5%). A recall-biased threshold sits in the dense low tail of the score distribution, where quantization noise of a few hundredths moves a large share of windows across the line. If I quantize later, it will need quantization-aware training and a re-tuned threshold. A post-hoc conversion won't do.

**The anchor is the part that gets truncated.** Tokens per 12-line window: p50 178, p95 284. The tokenizer truncates on the right, and the line being scored is the *last* line, so on the **8.4%** of windows that exceed 256 tokens the model scores the context without the utterance it is supposed to judge. Training used the same truncation, so train and serve agree. The model simply never sees the anchor on long windows. The fix is left-truncation in both, plus a re-tuned threshold.

**Cost per decision.** At 4 threads one decision uses ~0.28 vCPU-seconds. At a typical on-demand rate of ~$0.04 per vCPU-hour that is **~$3 per million decisions**, and in practice $0 marginal, because the app container's CPU is already paid for. The Flash Lite gate prompt is ~600 input tokens (a ~340-token system prompt, the window, and a schema), with output capped at 120 tokens and minimal reasoning. At the billed rate ($0.25 in / $1.50 out per million tokens) that is **~$0.00015–0.0003 per call**, or **$150–300 per million**. Per decision, the encoder is about two orders of magnitude cheaper.

| Per 95-minute session (921 batcher triggers) | LLM gate calls | Gate spend |
|---|---|---|
| LLM decides every trigger | 921 | ~$0.14–0.28 |
| **DistilBERT decides; LLM only on its fires (32.5%)** | ~300 | **~$0.05–0.09** (+ ~$0.003 CPU) |

That is roughly a **two-thirds cut** in gate spend at the shipped recall-biased threshold, which is less than ADR-0013's projected 90%: the distilled gate deliberately over-fires and lets the LLM sort it out. The latency win compounds: a SILENT decision returns in ~70 ms instead of ~1 s, so the event loop and the card writer are free for the moments that matter.

## Lessons

1. **Find the arbiter first.** If an LLM makes the final call at runtime, distill that LLM. Every earlier failure here was teacher ≠ gold.
2. **Check where your labels point.** One percent of my FIRE labels were on the right line. The "model ceiling" was a labelling artefact.
3. **Window parity, three times over.** 6-line training vs 30-line serving (F1 0.33 → 0.77 once matched), 4-line relabel vs 12-line eval, and live-incremental vs offline-clean. The first two took a day each to find; the third is still open.
4. **Measure the funnel before the model.** A deterministic timer was discarding 91% of the input.
5. **Bigger models are not better gates.** Pro fired 0/90. Stronger necessity judges rationalized keeping.
6. **Never let the producer judge itself.** +0.48 points of inflation, and blind to over-fire.
7. **Replay at 1× real-time.** 5× replays warp time-based dedup. Real time is the only honest measure.
8. **Keep the refuted ADR.** ADR-0012 is still in the repo with both conclusions marked refuted. It's the most useful document I wrote this month.
