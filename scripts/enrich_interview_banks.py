#!/usr/bin/env python3
"""Merge topic knowledge into interview bank JSON files.

Loads src/data/interviews/knowledge/{track}.json and optional
src/data/interviews/knowledge/empty-{track}.json (keyed by question id),
then writes shortAnswer/answer/example/integrationProcedure onto every
question in the matching bank file.
"""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BANK_DIR = ROOT / "src/data/interviews/bank"
KNOW_DIR = ROOT / "src/data/interviews/knowledge"

TRACKS = ("frontend", "backend", "mobile-flutter")

SOFT_HINTS = re.compile(
    r"\b(stakeholder|soft skill|communication|prioriti[sz]e|trade-?off discussion|"
    r"team process|ceremony|retro|agile ritual)\b",
    re.I,
)


def first_sentence(text: str) -> str:
    text = (text or "").strip()
    if not text:
        return ""
    m = re.search(r"(.+?[.!?])(\s|$)", text)
    return (m.group(1) if m else text).strip()


def sentences(text: str, n: int) -> str:
    parts = re.split(r"(?<=[.!?])\s+", (text or "").strip())
    parts = [p for p in parts if p]
    return " ".join(parts[:n]).strip()


def join_nonempty(*parts: str) -> str:
    return " ".join(p.strip() for p in parts if p and p.strip())


def concepts_sentence(concepts: list[str] | None) -> str:
    if not concepts:
        return ""
    if len(concepts) == 1:
        return f"Start with {concepts[0]}."
    if len(concepts) == 2:
        return f"Focus on {concepts[0]} and {concepts[1]}."
    return (
        "Focus on "
        + ", ".join(concepts[:-1])
        + f", and {concepts[-1]}."
    )


def level_extra(level: str, k: dict) -> str:
    if level == "Beginner":
        return sentences(k.get("summary", ""), 1)
    if level == "Advanced":
        return join_nonempty(
            sentences(k.get("tradeoffs", ""), 2),
            sentences(k.get("troubleshoot", ""), 1),
        )
    return sentences(k.get("mechanics", ""), 1)


def should_include_example(question: str, example: str | None) -> bool:
    if not example or not example.strip():
        return False
    if SOFT_HINTS.search(question) and "code" not in example.lower()[:40]:
        # still allow if example looks technical
        if not any(c in example for c in ("{", "`", "(", "=", "npm", "flutter", "nest")):
            return False
    return True


def synthesize_from_knowledge(q: dict, k: dict) -> dict:
    qt = q.get("questionType") or ""
    level = q.get("level") or "Intermediate"
    topic = q.get("topic") or "this topic"
    question = q.get("question") or ""

    summary = (k.get("summary") or "").strip()
    problem = (k.get("problem") or "").strip()
    concepts = k.get("concepts") or []
    mechanics = (k.get("mechanics") or "").strip()
    tradeoffs = (k.get("tradeoffs") or "").strip()
    troubleshoot = (k.get("troubleshoot") or "").strip()
    example = (k.get("example") or "").strip()
    integration = (k.get("integration") or "").strip()

    short = first_sentence(summary) or f"{topic} is a core concept in this domain."

    if qt == "Definition":
        answer = join_nonempty(
            summary,
            problem,
            concepts_sentence(concepts[:3]),
            level_extra(level, k) if level != "Beginner" else "",
        )
    elif qt == "Fundamentals":
        answer = join_nonempty(
            concepts_sentence(concepts) or summary,
            problem,
            sentences(mechanics, 1),
            level_extra(level, k) if level == "Advanced" else "",
        )
        short = first_sentence(concepts_sentence(concepts) or summary) or short
    elif qt == "Mechanics":
        answer = join_nonempty(
            mechanics or summary,
            concepts_sentence(concepts[:2]),
            sentences(troubleshoot, 1) if level == "Advanced" else "",
            sentences(tradeoffs, 1) if level != "Beginner" else "",
        )
        short = first_sentence(mechanics or summary) or short
    elif qt == "Architecture":
        answer = join_nonempty(
            tradeoffs or summary,
            sentences(mechanics, 1),
            sentences(troubleshoot, 1),
            problem if level == "Beginner" else sentences(tradeoffs, 2),
        )
        short = first_sentence(tradeoffs or summary) or short
    elif qt == "Troubleshooting":
        answer = join_nonempty(
            troubleshoot or summary,
            sentences(mechanics, 1),
            sentences(tradeoffs, 1),
            f"Reproduce with the smallest fixture around {topic}, then verify the fix with regression coverage.",
        )
        short = first_sentence(troubleshoot or summary) or short
    elif qt == "Compare":
        related = ""
        m = re.search(
            r"Compare\s+(.+?)\s+with\s+(.+?)[\.\?]",
            question,
            re.I,
        )
        if m:
            related = (
                f"Prefer {m.group(1).strip()} when its strengths match the problem; "
                f"prefer {m.group(2).strip()} when the alternative constraints dominate."
            )
        answer = join_nonempty(
            tradeoffs or summary,
            related,
            sentences(problem, 1),
            sentences(mechanics, 1) if level != "Beginner" else "",
            sentences(troubleshoot, 1) if level == "Advanced" else "",
        )
        short = first_sentence(tradeoffs or summary) or short
    else:
        # Scenario / Curated / Conceptual / other
        answer = join_nonempty(
            summary,
            concepts_sentence(concepts[:3]),
            sentences(mechanics, 1 if level == "Beginner" else 2),
            sentences(tradeoffs, 1) if level != "Beginner" else "",
            sentences(troubleshoot, 1) if level == "Advanced" else "",
        )

    # Ensure 3–6 sentence feel
    parts = re.split(r"(?<=[.!?])\s+", answer.strip())
    parts = [p for p in parts if p]
    if len(parts) < 3:
        fillers = [
            problem,
            concepts_sentence(concepts),
            sentences(mechanics, 1),
            sentences(tradeoffs, 1),
            f"Apply it deliberately in production rather than copying snippets without understanding failure modes for {topic}.",
        ]
        for f in fillers:
            if len(parts) >= 3:
                break
            s = first_sentence(f)
            if s and s not in parts:
                parts.append(s)
    answer = " ".join(parts[:6]).strip()

    if not integration:
        integration = (
            f"1) Identify where {topic} belongs in the architecture. "
            f"2) Implement the smallest correct usage with tests. "
            f"3) Document ownership and failure modes. "
            f"4) Monitor regressions in CI and production."
        )

    out = {
        "shortAnswer": short,
        "answer": answer,
        "integrationProcedure": integration,
    }
    if should_include_example(question, example):
        out["example"] = example
    return out


def synthesize_standalone(q: dict, curated: dict | None) -> dict:
    if curated:
        out = {
            "shortAnswer": curated["shortAnswer"].strip(),
            "answer": curated["answer"].strip(),
            "integrationProcedure": curated["integrationProcedure"].strip(),
        }
        ex = (curated.get("example") or "").strip()
        if ex:
            out["example"] = ex
        return out

    question = q.get("question") or "this concept"
    short = (
        f"Answer directly from the question: focus on the core idea asked in “{question[:80]}…”."
        if len(question) > 80
        else f"Focus on the core idea asked: {question}"
    )
    answer = join_nonempty(
        f"Start by restating the problem in practical engineering terms based on the question: {question}",
        "Explain the underlying mechanism or decision criteria an interviewer expects, including when the approach applies.",
        "Call out a common mistake and how you would verify the correct behavior with a small example or checklist.",
        "Finish with how you would adopt the practice in a real codebase with clear ownership and tests.",
    )
    return {
        "shortAnswer": first_sentence(short),
        "answer": answer,
        "integrationProcedure": (
            "1) Restate the requirement against your product constraints. "
            "2) Choose the simplest correct approach and spike it. "
            "3) Add tests or observability for the failure mode. "
            "4) Document the decision for the team."
        ),
    }


def enrich_track(track: str) -> dict:
    bank_path = BANK_DIR / f"{track}.json"
    know_path = KNOW_DIR / f"{track}.json"
    empty_path = KNOW_DIR / f"empty-{track}.json"

    bank = json.loads(bank_path.read_text())
    knowledge = json.loads(know_path.read_text()) if know_path.exists() else {}
    empty = json.loads(empty_path.read_text()) if empty_path.exists() else {}

    missing_topics: set[str] = set()
    missing_empty: list[str] = []

    for q in bank:
        topic = (q.get("topic") or "").strip()
        if topic:
            k = knowledge.get(topic)
            if not k:
                missing_topics.add(topic)
                # still produce something usable from topic name
                k = {
                    "summary": f"{topic} is a practical concept you should understand deeply for interviews and production work.",
                    "problem": f"Teams misuse {topic} when they skip fundamentals or ignore failure modes.",
                    "concepts": [topic],
                    "mechanics": f"Apply {topic} by following the official mental model end to end.",
                    "tradeoffs": f"The main trade-offs around {topic} involve complexity, correctness, and operability.",
                    "troubleshoot": f"Reproduce the unexpected behavior, isolate {topic}, and compare against docs and a minimal fixture.",
                    "example": "",
                    "integration": (
                        f"1) Locate call sites for {topic}. "
                        f"2) Implement the idiomatic pattern. "
                        f"3) Add tests. "
                        f"4) Monitor regressions."
                    ),
                }
            fields = synthesize_from_knowledge(q, k)
        else:
            curated = empty.get(q["id"])
            if not curated:
                missing_empty.append(q["id"])
            fields = synthesize_standalone(q, curated)

        # overwrite enrichment fields; keep identity fields
        for key in ("shortAnswer", "answer", "example", "integrationProcedure"):
            if key in fields:
                q[key] = fields[key]
            elif key == "example" and "example" in q:
                del q["example"]

    bank_path.write_text(json.dumps(bank, indent=2, ensure_ascii=False) + "\n")

    with_short = sum(1 for q in bank if q.get("shortAnswer"))
    with_answer = sum(1 for q in bank if q.get("answer"))
    with_example = sum(1 for q in bank if q.get("example"))
    with_integ = sum(1 for q in bank if q.get("integrationProcedure"))

    return {
        "track": track,
        "total": len(bank),
        "shortAnswer": with_short,
        "answer": with_answer,
        "example": with_example,
        "integrationProcedure": with_integ,
        "missing_topics": sorted(missing_topics),
        "missing_empty": missing_empty,
        "knowledge_topics": len(knowledge),
        "empty_curated": len(empty),
    }


def main() -> None:
    KNOW_DIR.mkdir(parents=True, exist_ok=True)
    results = []
    for track in TRACKS:
        results.append(enrich_track(track))

    print("\n=== Enrichment counts (questions with shortAnswer) ===")
    for r in results:
        print(
            f"{r['track']}: shortAnswer={r['shortAnswer']}/{r['total']} "
            f"answer={r['answer']} example={r['example']} "
            f"integrationProcedure={r['integrationProcedure']} "
            f"(knowledge topics={r['knowledge_topics']}, empty curated={r['empty_curated']})"
        )
        if r["missing_topics"]:
            print(f"  WARNING missing topics ({len(r['missing_topics'])}): {r['missing_topics'][:10]}...")
        if r["missing_empty"]:
            print(f"  WARNING missing empty ids ({len(r['missing_empty'])}): {r['missing_empty'][:10]}...")


if __name__ == "__main__":
    main()
