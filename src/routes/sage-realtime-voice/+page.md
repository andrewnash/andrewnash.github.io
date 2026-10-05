---
title: 'Sage: Real-Time Voice AI for the Dungeon Master'
image: '/sage-realtime-voice/dashboard.png'
alt: 'Sage DM dashboard'
cover: '/sage-realtime-voice/architecture.png'
coverAlt: 'Sage realtime architecture: browser and Discord audio into per-player Deepgram streams, a silence gate, a two-call LLM agent with MCP tools and hybrid RAG, and a unified DM timeline'
summary: 'Sixty days into building a live AI co-pilot for my D&D table: per-player streaming STT, a silence-gated two-call agent over MCP tools and hybrid RAG, an honest latency budget, the benchmarks that lied to me, and the production incident that made me collapse five code paths into one.'
created: 2026-05-14
tags:
  - 'LLM'
  - 'Speech'
  - 'Real-time'
  - 'MCP'
  - 'FastAPI'
  - 'Distributed Systems'
---

# Sage: real-time voice AI for the dungeon master

I run a weekly *Curse of Strahd* campaign. The hardest part of being a DM is not the story. It is the forty small lookups a night: what does *Sacred Flame* do against cover, how much falling damage is 60 feet, what was the name of the NPC the party met three sessions ago. **Sage** listens to the table, transcribes everyone with per-player attribution, and puts the answer on my screen before I would have found the page in the book.

As of today the project is 60 days old, and I have dogfooded it at my own table every week since the alpha tag on April 23. This post covers how it works, where the latency actually goes, and the production incident that changed how I structure the backend.

![The v3 DM dashboard: a player's line, and the card that bloomed under it](./dashboard.png)

## By the numbers (2026-05-14)

| Metric | Value |
|---|---|
| Age | 60 days, 1,461 commits |
| Test functions | 15,693 across ~880 files |
| HTTP + WebSocket routes | 554 across 135 API modules |
| MCP tools | 61, consolidated to 53; the realtime menu then swapped 32 specific tools for 6 dispatchers |
| Backend + bot | ~156K lines of Python |
| Frontend | ~40K lines of Svelte 5 / TypeScript |
| Deploy | Docker Compose, 4 containers (app, discord-bot, Postgres, Redis), no GPU |
| Bot log for one session day | 295 MB of structured JSON |

## Architecture: ear to card

This is the alpha pipeline as it shipped in April. I'll cover what changed in May at the end of this section.

![Ear to card](./architecture.png)

**Two capture paths, one pipeline.** In-person, each player opens a PWA on their phone. An `AudioWorklet` converts Float32 to Int16 PCM at 16 kHz mono and ships 20 ms frames (640 bytes) over a dedicated WebSocket, with a 4-byte `player_id` header instead of per-frame JSON. Online, a Discord bot receives each speaker's Opus stream by SSRC, decodes it, and resamples 48 kHz stereo to 16 kHz mono. Both feed the same pipeline.

**Per-player STT is free diarization.** Every player gets their own Deepgram Nova-3 streaming socket. Speaker attribution comes from the socket rather than a diarization model. That makes it exactly right, and it cost me nothing to build. (Keyword-boosting ~800 SRD terms is designed but not wired up yet, so "Eldritch Blast" still occasionally becomes "elder blast".)

**Speculative prefetch.** A regex keyword spotter runs on *partial* transcripts every ~200 ms. When it sees a spell, condition, or monster name, it fires a RAG lookup into a Redis cache before the sentence is finished. It also shortens the silence gate from 1,500 ms to 500 ms, because a keyword is strong evidence that a lookup is coming.

**A two-call agent.** When everyone has been quiet for 1.5 s, the agent runs. LLM-1 (Gemini 3.1 Flash Lite) picks tools. The tools run. LLM-2 writes the card and streams it to the dashboard.

**MCP-native tools.** Every tool is an async function with a Pydantic input model that returns a cited string. A `ToolRegistry` exports both MCP schemas and OpenAI function-calling schemas from the same definitions. The agent loop and external clients (Claude Desktop, Cursor) call identical code, and contract tests make sure the two schema exports can never drift.

```python
class LookupSpellInput(ToolInput):
    """Look up a D&D 5e spell by name from the SRD."""
    spell_name: str

@tool_registry.register
async def lookup_spell(params: LookupSpellInput) -> str:
    # 1. prefetch cache (Redis)  2. hybrid search  3. format with [SRD 5.2 ...] citation
    ...
```

One footgun: `from __future__ import annotations` breaks the registry. The decorator inspects annotations at runtime with `isinstance(ann, type)`, and postponed annotations are strings. There is a lint rule for it now.

**Hybrid RAG.** Postgres 16 with pgvector (cosine, 1536-d Gemini embeddings) and `pg_trgm`/`tsvector` for BM25-style matching. Each retriever returns its top 50, and the two lists are merged with Reciprocal Rank Fusion (k=60). Rules lookups weight lexical matching 0.7 / vector 0.3, because for spell names exact strings matter more than semantics.

**One timeline.** The DM dashboard merges transcript lines and AI cards into one feed sorted by a backend-assigned arrival ordinal. A card "blooms" directly under the line that triggered it, so you read the cause and the answer together.

**What changed in May.** Two LLM calls in series was the biggest structural cost, so on May 2 the default path changed. A cheap two-stage silence classifier (Flash Lite) now decides fire or stay silent first. Then a **zero-tool prefetch synthesis** step removes the tool-routing call entirely: entity recognition pulls pre-rendered SRD cards, and a single model call picks one and writes the card. The tool-picking agent above is now the fallback for open-ended questions. The latency numbers below were measured on the April path.

## Latency, honestly

The goal is "on screen before you find the page". The measured budget looks like this:

![Latency waterfall](./latency-waterfall.png)

| Stage | p50 | p95 | Source |
|---|---|---|---|
| AudioWorklet capture (20 ms frame) | ~3 ms | | design |
| Silence-gate wait | 1,500 ms (500 ms on a keyword) | | config |
| Prefetch cache hit | under 1 ms | | |
| LLM-1 tool selection (Flash Lite) | 934–940 ms | | perf bench (22 scenarios) |
| Tool execution | 0–400 ms (`search_campaign_notes` is the slow one) | | issue #55 |
| LLM-2 synthesis, full | 1,118–1,146 ms | 1,740–1,923 ms | perf bench |
| LLM-2 first token, streaming off → on | 1,183 → **819 ms** | 1,968 → **1,563 ms** | perf bench, 16 action scenarios |
| Whole agent run (both LLM calls + tools) | 2,018–2,088 ms | 3,343–3,540 ms | 22 scenarios |
| Agent call on a 120 s real-audio fixture (pre-streaming) | 3.2 / 3.9 / 4.3 s | | n=3 |

So the honest answer is **~3.4 s from the end of speech to the first words of the card at p50, and ~4.5–5 s p95** once the 1.5 s wait is included. My alpha target is p95 under 3 s. Turning on streaming synthesis cut the synthesis call's time-to-first-token by 31% for zero cost, though the full card still takes as long. The largest remaining item is the 1.5 s wait itself, and the agent cannot start until the table goes quiet. Replacing that timer is the next big project.

Two LLM calls in series is the other structural cost, which is what the May prefetch path removes.

## Picking models with benchmarks that lie

I benchmarked every reasonable realtime model on 22 labelled tool-use scenarios:

![Realtime model bench](./realtime-model-bench.png)

| Model | Tool-use F1 | p95 latency | $ / bench run | Verdict |
|---|---|---|---|---|
| gemini-2.5-flash | **91%** | 6,932 ms | $0.06 | best F1, triples the latency budget |
| **gemini-3.1-flash-lite** | 87% | **2,278 ms** | **$0.03** | the latency/cost knee, **shipped** |
| gpt-5.4-nano | 85% (74% on re-run) | 2,527 ms | $0.05 | single-trial high |
| claude-sonnet-4-6 | 75% | 5,222 ms | $1.11 | 35× the cost |
| gpt-5.4-mini | 69% | 2,220 ms | $0.17 | |
| claude-haiku-4-5 | 41% | 2,608 ms | $0.36 | likely scenario-set bias |
| best Grok variant (May) | 81% | ~32 s | | 14× the SLO |

The more useful lesson came from the **post-session summary** bench. Each one of these "findings" was a bug in my own harness or pipeline:

| Pass | What the bench said | What was actually true |
|---|---|---|
| Apr 28 | Flash Lite scores **1.0/10** on summaries | My 7-call specialist merge threw away the model's work over one field-type mismatch. After the fix it scored 7.7/10 at $0.034 and 52 s |
| Apr 29 | Summaries look fine | Six structured fields were **silently dropped on every session** |
| Pass 8 | "Grok dominates 10W/2T/0L" | Wiki `[edit]` markers leaked into claims and the judge only saw the first 300 turns. Properly measured: +3.72 pp, p=0.014 |
| Pass 10 | Bench reports $1.50 of spend | The Google Cloud bill said **$8.86**. Stale per-token prices plus uncounted thinking tokens (one probe: 16 prompt + 186 completion + **677 thinking**) |
| Pass 13 | Grok is the summary default | xAI announced the model's retirement. Its replacement was 6.4× the cost for no quality gain, so I rolled back |
| Pass 14/15 | Grok cache rate 0.1% vs Gemini 96.9% | A per-specialist `response_format` schema sits in the cache prefix and kills reuse. The parallel fan-out tops out at 25–35% |
| Pass 18 | DeepSeek "cheaper and better (−54%)" | Better, yes: +8.84 pp, vibe 6.43 vs 4.65, 17W/4T/2L over 23 sessions, p below 0.001. Cheaper was cross-arm cache reuse; cold cost is **+12%** |

My rule now is to **instrument the instrument**. Reconcile every cost number against the real invoice, check that a `seed` parameter actually reaches the provider (one adapter silently dropped it, so my "σ=0 across seeds" was replication rather than perturbation), and treat a dramatic result as a bug until proven otherwise.

### Fewer, fatter tools

The full registry of ~59 tools costs ~12,800 schema tokens per call, and the model "gets distracted by the larger menu and stays silent when it shouldn't". On a 30-scenario stress set:

![Tool consolidation](./tool-consolidation.png)

| Tool menu | F1 mean (σ) | Silence accuracy | p95 | $/call | Schema tokens |
|---|---|---|---|---|---|
| 1 merged tool | 82.0 (0) | 100% | 1.24–1.39 s | $0.017 | ~250 |
| **3 merged tools** | **92.0 (0)** | 87% | 1.23–1.54 s | $0.024 | ~750 |
| Full registry | 81.3 (~2.4) | 94% | 1.19–1.38 s | $0.052 | ~12,800 |

I first wrote this up as "+10.7 pp universally". Then the review pass found that 21 of 24 action scenarios were ties, so the real win is three specific failure modes avoided at 54% lower cost per call. I kept the retraction in the doc.

## Discord voice under end-to-end encryption

Discord's DAVE protocol (MLS-based end-to-end encryption for voice) broke voice receive in the Python library I use. I run an unmerged upstream Pycord branch that supports DAVE. The night before alpha, my automated audio harness (a playback bot replaying a recorded session into a voice channel) showed the bot connecting, receiving frames, and sending **0 bytes** to Deepgram:

```text
23:22:45  start_recording_ok
23:22:49  sage_sink_first_frame bytes=3840 · deepgram_connected · "Upgrading to DAVE connection"
23:22:49  discord.opus: 7 packets were lost being flushed in decoder
23:22:49 → 23:23:21  deepgram_keepalive_sent ... (30 s, no audio)
23:23:21  deepgram_closing bytes_sent=0 finals=0
```

The jitter buffer (`max_size=10`, strict ordering) was tuned for plaintext voice. MLS re-keys and reordering overflowed it, and it dropped **~73% of Opus packets**. The fix was a runtime monkey-patch that cherry-picks the one uncontroversial piece of an upstream PR. It was filed and closed in 8 hours, the morning of alpha day. Two more surprises in the same chain: the test fixture audio sat at −55 dB, so nothing cleared the 200-RMS VAD until I added `loudnorm`, and ffmpeg exited in under a second unless I waited ~3 s for DAVE to settle.

Then, during the alpha session itself: around the two-hour mark Discord rotates the voice key. If the bot misses that opcode, every RTP packet raises `CryptoError`, at about 50 log lines per second *per speaker*. That got a throttling log filter, a storm flag, and a watchdog that reconnects only when the storm is active **and** audio has been silent for more than 2 minutes.

Discord is the secondary path. Because it depends on an unmerged library branch, the browser PWA stays the strategic primary.

## The incident: P5RZP5TF

On May 8 I ran a 2 h 16 m session with six players. Afterwards I had **two recap threads posted 19 seconds apart with different titles**, and the transcript store was empty.

| Time (UTC) | Event |
|---|---|
| start | `INSERT 'P5RZP5TF'` into a `VARCHAR(6)` column fails. Session codes had grown to 8 characters; the migration existed but was never applied to the production DB. The bot carried on in memory. |
| throughout | **1,793** `transcript_store_error` (foreign key: no parent row) |
| throughout | Deepgram reconnect storm, **723 reconnects/hour** across 6 players |
| 01:00–01:25 | Orphan `silence_gate_triggered` rose from 5–9 to 12–18 per 5 min; `agent_prefetch_fire` went to **0**; **0 error events** |
| 02:03:48 | PWA "End session" → summary generation #1 |
| 02:04:06 | `/sage stop` → summary generation #2 (with critic pass) |
| 02:04:26 | thread #1 posted: "The Altar of Echoes…" |
| 02:04:45 | thread #2 posted: "The Altar's Last Verse…" |

Five bugs were fixed that day: the column width, the duplicate post, a summary path that bypassed the configured model, a capability check, and raw timestamps in the recap. Two problems deserve their own sections, and one of them took two more days to find.

### The invisible cliff

Card output collapsed over a ~25-minute window, and there was **not one error event for the dropped agent runs**. Grepping for errors found only the unrelated transcript-store failures. What found it was bucketing a "canary" event, one whose *absence* means broken, into 5-minute windows over the 295 MB log with `awk`. The cliff showed up immediately, and correlating it with reconnect counts gave the mechanism:

1. The silence gate's timer task fires and `await`s the agent callback (an LLM call in flight).
2. A Deepgram reconnect re-emits `on_speech_start`, and the gate cancels its timer task.
3. `asyncio.CancelledError` is a `BaseException` since Python 3.8, so the agent's `except Exception` doesn't catch it.
4. `safe_create_task`'s done-callback deliberately drops `CancelledError` from logging, because cancellation is "normal".

Real work was cancelled, and nothing recorded it: no log line, no metric, no Sentry event. The fix:

```python
# simplified from backend/agent/silence_gate.py
try:
    await asyncio.shield(self._callback())   # the agent finishes even if the timer dies
except asyncio.CancelledError:
    logger.info("silence_gate_callback_cancelled", reason="speech_start_or_external_cancel")
    raise
except Exception:
    logger.exception("silence_gate_callback_error")
```

I then wrote an AST audit for every `try` that wraps an `await` inside a long-running or fire-and-forget task. It found **568** sites: 0 high-severity (bare `except:` or `except BaseException`) and 42 background-task handlers that I baselined. It now runs in CI as a ratchet, so the count can only go down. I also fixed the upstream cause: Deepgram liveness now requires a >30 s *inbound* gap **and** outbound audio in the last 30 s, so quiet players stop looking dead. One player was reconnecting 205 times an hour just for being quiet.

### Five code paths to end a session

The duplicate recap had a structural cause. Four triggers fed five summary code paths, and each had grown its own logic:

![End of session, before and after](./end-of-session.png)

Three paths generated a summary and posted it. One generated without posting. The voice-drop path produced no recap at all. The bot's paths also used the realtime LLM client, so when I switched the summary default to DeepSeek, Discord never saw the change.

The same-day fix was a compare-and-set `summary_posted` guard on every bot path. The real fix was deleting the parallel paths. **Pass 19** routes every trigger through one REST endpoint (the bot calls it over HTTP with a service token, with an in-process fallback for single-container deploys). Exactly one function makes the LLM call, and it publishes `summary_ready` on Redis. The bot only consumes: it renders and posts, with no LLM call of its own. Duplicate posts are now impossible by construction, because nothing else generates a summary to post.

I ran a fresh-context, harsh staff-engineer review pass over the PR, and it found **six real bugs**:
- `/sage stop` removed the session before `summary_ready` arrived 30–130 s later, so the post had nowhere to go. The fix is a `_pending_summary_sessions` map.
- The voice-drop path never queued a summary.
- Five keyword arguments had drifted between the bot and REST call sites, and a comment cited a regression test that did not exist. Fixed with a single `build_summary_task_kwargs` builder and a 21-key parity test.
- The legacy regenerate endpoint still built its kwargs inline.
- The bot never closed its HTTP client on shutdown.
- A docstring claimed Redis would re-deliver `summary_ready`. Redis pub/sub is at-most-once. I've since made the consumer replay-safe.

**Pass 20** made the pending map survive crashes. It is mirrored to Redis as `session:{code}:pending_summary` (TTL 600 s) and rehydrated in `on_ready`. Bot-status frames now carry a `heartbeat_ts`, and the dashboard chip goes offline after 10 s of silence. Before that, a Pycord crash left the chip saying "live" forever.

| Incident | Bugs | Silent in prod? |
|---|---|---|
| DAVE receive | 4 (jitter buffer, −55 dB fixture, missing status frame, UX) | yes: 0 bytes, no error |
| Key rotation at ~2 h | log storm, audio dies | partly |
| P5RZP5TF | 5 same-day + the cancellation cliff + the reconnect storm | 3 of 5 would have stayed silent without a user report |
| Pass 19 review | 6 | yes: dropped posts |
| Bot crash | stale "live" chip, lost post target | yes |

## What I'd tell myself on day one

1. **Delete parallel paths; a guard is only a stopgap.** One producer, one kwarg builder, one parity test.
2. **Every silent failure becomes a typed log event.** `silence_gate_callback_cancelled` exists so a postmortem can grep for it. I promoted `summary_ready_no_matching_session` from debug to info because it *is* the bug-detection signal.
3. **Measure the absence of things.** Canary events in 5-minute buckets found what grep could not.
4. **Instrument the benchmark.** Reconcile against the invoice and verify parameters reach the provider.
5. **Review with fresh eyes and a harsh brief.** A reviewer with none of the author's context found six bugs the author missed.

Next up: the 1.5 s silence timer. It costs latency on every card, and I suspect it is also hiding cards. More on that soon.
