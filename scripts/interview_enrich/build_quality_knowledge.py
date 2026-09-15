#!/usr/bin/env python3
"""Build concrete interview knowledge for QA, UI/UX, PM, and full-stack banks."""

from __future__ import annotations

import json
import re
from pathlib import Path

from scripts.interview_enrich.curated_answers import curated_by_id
from scripts.interview_enrich.fullstack_topics import FULLSTACK_TOPICS
from scripts.interview_enrich.knowledge_qa import QA_TOPICS
from scripts.interview_enrich.lib import is_generic_blob, merge_track
from scripts.interview_enrich.pm_topics import PM_TOPICS
from scripts.interview_enrich.uiux_topics import UIUX_TOPICS

ROOT = Path(__file__).resolve().parents[2]
BANK = ROOT / "src/data/interviews/bank"
OUT = ROOT / "src/data/interviews/knowledge"
TRACKS = ("qa", "uiux", "project-management", "fullstack")
TOPICS = {
    "qa": QA_TOPICS,
    "uiux": UIUX_TOPICS,
    "project-management": PM_TOPICS,
    "fullstack": FULLSTACK_TOPICS,
}
BANNED_RE = re.compile(
    r"turns a specific user need|"
    r"visible enough for stakeholders|"
    r"must be designed across UI, API|"
    r"is a design .* practice that|"
    r"Answer with risk, observable behavior|"
    r"through user goals, constraints|"
    r"Design checklist for .+?: user job, primary action|"
    r"Delivery ritual for .+?: update baseline, owner|"
    r"FE\+BE sketch for .+?: browser action -> typed request|"
    r"Without solid .+, users may misread the interface",
    re.I,
)


def load_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def slug(topic: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", topic.lower()).strip("-")


def build_track(track: str) -> dict:
    questions = load_json(BANK / f"{track}.json")
    data = dict(TOPICS[track])
    data["_by_id"] = curated_by_id(track, questions)
    validate_knowledge(track, data)
    return data


def validate_knowledge(track: str, knowledge: dict) -> None:
    problems: list[str] = []
    topics = {k: v for k, v in knowledge.items() if not k.startswith("_")}
    for topic, entry in topics.items():
        blob = " ".join(str(entry.get(k, "")) for k in ("summary", "problem", "mechanics", "tradeoffs", "troubleshoot", "example", "integration"))
        if BANNED_RE.search(blob):
            problems.append(f"{track}:{topic}: banned phrase")
        fake_endpoint = f"/api/{slug(topic)}"
        if fake_endpoint in blob:
            problems.append(f"{track}:{topic}: fake endpoint {fake_endpoint}")
        if len(entry.get("concepts") or []) != 4:
            problems.append(f"{track}:{topic}: concepts must have 4 items")
        for concept in entry.get("concepts") or []:
            if re.search(r"definition and scope$", concept, re.I):
                problems.append(f"{track}:{topic}: templated concept {concept!r}")
    for qid, entry in (knowledge.get("_by_id") or {}).items():
        blob = " ".join(str(entry.get(k, "")) for k in ("shortAnswer", "answer", "example", "integration"))
        if BANNED_RE.search(blob):
            problems.append(f"{track}:{qid}: banned phrase")
    if problems:
        raise ValueError("\n".join(problems[:40]))


def count_bank(track: str) -> tuple[int, int, int]:
    bank = load_json(BANK / f"{track}.json")
    answered = 0
    generic = 0
    for item in bank:
        if item.get("shortAnswer") and item.get("answer") and item.get("integrationProcedure"):
            answered += 1
        blob = " ".join(str(item.get(k, "")) for k in ("shortAnswer", "answer", "example", "integrationProcedure"))
        if is_generic_blob(blob):
            generic += 1
    return answered, len(bank), generic


def banned_count(track: str) -> int:
    knowledge = load_json(OUT / f"{track}.json")
    count = 0
    for key, entry in knowledge.items():
        values = entry.values() if isinstance(entry, dict) else []
        if key == "_by_id":
            for by_id_entry in entry.values():
                blob = " ".join(str(v) for v in by_id_entry.values())
                count += int(bool(BANNED_RE.search(blob)))
            continue
        blob = " ".join(str(v) for v in values)
        count += int(bool(BANNED_RE.search(blob)))
    return count


def diversity_metrics(track: str) -> dict:
    knowledge = load_json(OUT / f"{track}.json")
    topics = {k: v for k, v in knowledge.items() if not k.startswith("_")}
    by_id = knowledge.get("_by_id", {})
    stripped_examples = {
        re.sub(re.escape(topic), "", v.get("example", ""), flags=re.I).strip()
        for topic, v in topics.items()
    }
    lowercase_curated = sum(
        1 for v in by_id.values() if (v.get("shortAnswer") or "")[:1].islower()
    )
    return {
        "concept_sets": len({tuple(v.get("concepts") or []) for v in topics.values()}),
        "topic_count": len(topics),
        "curated_prefixes": len({(v.get("shortAnswer") or "")[:40] for v in by_id.values()}),
        "curated_count": len(by_id),
        "stripped_examples": len(stripped_examples),
        "lowercase_curated": lowercase_curated,
    }


def sample_summary(track: str, topic: str) -> str:
    return load_json(OUT / f"{track}.json")[topic]["summary"]


def sample_example(track: str, topic: str) -> str:
    return load_json(OUT / f"{track}.json")[topic]["example"]


def sample_short(track: str, qid: str) -> str:
    return load_json(OUT / f"{track}.json")["_by_id"][qid]["shortAnswer"]


def main() -> int:
    OUT.mkdir(parents=True, exist_ok=True)
    for track in TRACKS:
        knowledge = build_track(track)
        merge_track(track, knowledge)
        answered, total, generic = count_bank(track)
        banned = banned_count(track)
        metrics = diversity_metrics(track)
        print(f"{track}.json: answered {answered}/{total}; remaining generic {generic}; banned {banned}")
        print(f"  unique concept sets: {metrics['concept_sets']}/{metrics['topic_count']}; unique curated short prefixes: {metrics['curated_prefixes']}/{metrics['curated_count']}")
        print(f"  unique stripped examples: {metrics['stripped_examples']}/{metrics['topic_count']}; lowercase curated starts: {metrics['lowercase_curated']}")
    print("samples:")
    print(f"  design token example: {sample_example('uiux', 'design token')}")
    print(f"  story points example: {sample_example('project-management', 'story points')}")
    print(f"  CORS example: {sample_example('fullstack', 'CORS')}")
    print(f"  BFF example: {sample_example('fullstack', 'BFF pattern')}")
    print(f"  QA-B-0034: {sample_short('qa', 'QA-B-0034')}")
    print(f"  QA-A-0050: {sample_short('qa', 'QA-A-0050')}")
    print(f"  PM-B-0019: {sample_short('project-management', 'PM-B-0019')}")
    print(f"  FS-B-0026: {sample_short('fullstack', 'FS-B-0026')}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
