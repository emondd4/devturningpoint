#!/usr/bin/env python3
"""Dump quality knowledge cards to JSON and re-merge into interview banks."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from knowledge_data.frontend import FRONTEND  # noqa: E402
from knowledge_data.backend import BACKEND  # noqa: E402
from knowledge_data.flutter import FLUTTER  # noqa: E402
from enrich_interview_banks import enrich_track  # noqa: E402

KNOW_DIR = ROOT / "src/data/interviews/knowledge"
BANK_DIR = ROOT / "src/data/interviews/bank"

TRACK_MAP = {
    "frontend": FRONTEND,
    "backend": BACKEND,
    "mobile-flutter": FLUTTER,
}

GENERIC_RE = re.compile(
    r"matters in|core idea|practical concept you should|Teams misuse|"
    r"official mental model|Locate call sites|Without a clear grasp of|"
    r"Definition and non-goals of|Happy path vs failure path|"
    r"reproduce → isolate → verify|Agree on the definition of",
    re.I,
)


def dump_knowledge() -> None:
    KNOW_DIR.mkdir(parents=True, exist_ok=True)
    for track, cards in TRACK_MAP.items():
        path = KNOW_DIR / f"{track}.json"
        # preserve stable key order: _general first, then alpha
        keys = sorted(cards.keys(), key=lambda k: (k != "_general", k.lower()))
        ordered = {k: cards[k] for k in keys}
        path.write_text(json.dumps(ordered, indent=2, ensure_ascii=False) + "\n")
        print(f"wrote {path.relative_to(ROOT)} ({len(ordered)} cards)")


def coverage_check() -> list[str]:
    issues = []
    for track, cards in TRACK_MAP.items():
        bank = json.loads((BANK_DIR / f"{track}.json").read_text())
        topics = {q.get("topic") or "" for q in bank}
        topics.discard("")
        missing = sorted(t for t in topics if t not in cards)
        extra = sorted(k for k in cards if k != "_general" and k not in topics)
        if missing:
            issues.append(f"{track} missing knowledge for: {missing}")
        if extra:
            print(f"note: {track} has extra cards not in bank topics: {extra[:10]}")
    return issues


def count_generic() -> None:
    print("\n=== Remaining generic knowledge cards ===")
    for track in TRACK_MAP:
        data = json.loads((KNOW_DIR / f"{track}.json").read_text())
        generic = []
        for topic, k in data.items():
            blob = " ".join(
                [
                    k.get("summary", ""),
                    k.get("problem", ""),
                    " ".join(k.get("concepts") or []),
                    k.get("mechanics", ""),
                    k.get("tradeoffs", ""),
                    k.get("troubleshoot", ""),
                    k.get("example", ""),
                    k.get("integration", ""),
                ]
            )
            if GENERIC_RE.search(blob):
                generic.append(topic)
        print(f"{track}: {len(generic)}/{len(data)} generic → {generic[:5] if generic else 'none'}")


def main() -> None:
    dump_knowledge()
    issues = coverage_check()
    if issues:
        for i in issues:
            print("ERROR:", i)
        sys.exit(1)

    print("\n=== Merging into banks ===")
    for track in TRACK_MAP:
        r = enrich_track(track)
        print(
            f"{r['track']}: shortAnswer={r['shortAnswer']}/{r['total']} "
            f"example={r['example']} missing_topics={len(r['missing_topics'])}"
        )

    count_generic()

    # also count generic-ish bank answers
    print("\n=== Bank answers still matching generic phrases ===")
    for track in TRACK_MAP:
        bank = json.loads((BANK_DIR / f"{track}.json").read_text())
        bad = sum(
            1
            for q in bank
            if GENERIC_RE.search((q.get("shortAnswer") or "") + " " + (q.get("answer") or ""))
        )
        print(f"{track}: {bad}/{len(bank)} answers still generic-ish")


if __name__ == "__main__":
    main()
