#!/usr/bin/env python3
"""Merge src/data/interviews/knowledge/{track}.json into bank/{track}.json answers."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BANK = ROOT / "src/data/interviews/bank"
KNOW = ROOT / "src/data/interviews/knowledge"

KEEP = ("id", "level", "category", "topic", "questionType", "question")


def load_json(path: Path):
    with path.open(encoding="utf-8") as f:
        return json.load(f)


def save_json(path: Path, data) -> None:
    with path.open("w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")


def compare_peer(question: str) -> str | None:
    m = re.search(
        r"Compare\s+.+?\s+with\s+(.+?)\.\s*When would you choose",
        question,
        re.I,
    )
    return m.group(1).strip() if m else None


def join_concepts(concepts: list[str]) -> str:
    return "; ".join(concepts)


def level_suffix(level: str, advanced_note: str) -> str:
    if level == "Advanced":
        return " " + advanced_note
    if level == "Beginner":
        return " Keep the explanation interview-friendly and concrete."
    return ""


def build_answer(q: dict, k: dict) -> dict:
    qt = q.get("questionType") or ""
    level = q.get("level") or "Intermediate"
    topic = (q.get("topic") or "").strip()
    question = q.get("question") or ""
    summary = (k.get("summary") or "").strip()
    problem = (k.get("problem") or "").strip()
    concepts = k.get("concepts") or []
    mechanics = (k.get("mechanics") or "").strip()
    tradeoffs = (k.get("tradeoffs") or "").strip()
    troubleshoot = (k.get("troubleshoot") or "").strip()
    example = (k.get("example") or "").strip()
    integration = (k.get("integration") or "").strip()

    short = ""
    answer = ""
    out_example = None
    integ = integration

    adv = (
        "At advanced level, also call out failure modes, operational cost, and "
        "how you would observe or roll back the choice in production."
    )

    if qt == "Definition":
        short = summary
        answer = f"{summary} {problem}".strip()
        answer += level_suffix(level, adv)
    elif qt == "Fundamentals":
        short = (
            f"Before using {topic or 'this'}, understand: {join_concepts(concepts[:3])}."
            if concepts
            else summary
        )
        answer = (
            f"The key ideas for {topic or 'this topic'} are: {join_concepts(concepts)}. "
            f"{summary} {problem}"
        ).strip()
        answer += level_suffix(level, adv)
    elif qt == "Mechanics":
        short = mechanics.split(".")[0].strip() + "." if mechanics else summary
        answer = mechanics or summary
        answer += level_suffix(level, adv)
        if example:
            out_example = example
    elif qt == "Architecture":
        short = tradeoffs.split(".")[0].strip() + "." if tradeoffs else summary
        answer = (
            f"At production scale for {topic or 'this'}, {tradeoffs} {problem}"
        ).strip()
        answer += level_suffix(level, adv)
        if example and ("config" in example.lower() or "yaml" in example.lower() or level == "Advanced"):
            out_example = example
    elif qt == "Troubleshooting":
        short = troubleshoot.split(".")[0].strip() + "." if troubleshoot else summary
        answer = f"{troubleshoot} Then harden with an adoption path so the failure class does not recur.".strip()
        answer += level_suffix(level, adv)
        integ = integration
        if example and ("log" in example.lower() or "sql" in example.lower() or "kubectl" in example.lower() or "psql" in example.lower()):
            out_example = example
    elif qt == "Compare":
        peer = compare_peer(question) or "the related alternative"
        short = (
            f"Choose {topic or 'this'} vs {peer} based on workload shape, consistency needs, and operational cost."
            if topic
            else tradeoffs.split(".")[0].strip() + "."
        )
        answer = (
            f"Comparing {topic or 'this approach'} with {peer}: {tradeoffs} "
            f"Pick the option that matches your constraints rather than a default fashion."
        ).strip()
        answer += level_suffix(level, adv)
    else:
        # Curated / Conceptual / Scenario — prefer id-specific fields if present
        short = (k.get("shortAnswer") or summary or mechanics or tradeoffs).strip()
        answer = (
            k.get("answer")
            or " ".join(
                p
                for p in [
                    summary,
                    problem,
                    mechanics if qt in ("Scenario", "Conceptual") else "",
                    troubleshoot if qt == "Scenario" else "",
                    tradeoffs if qt in ("Curated", "Conceptual") else "",
                ]
                if p
            )
        ).strip()
        if not answer:
            answer = short
        answer += level_suffix(level, adv)
        if example and qt in ("Scenario", "Conceptual", "Curated"):
            out_example = example
        if k.get("integration"):
            integ = k["integration"]

    if not short:
        short = summary or "See full answer."
    if not answer:
        answer = short
    if not integ:
        integ = (
            f"1) Document when {topic or 'this concept'} applies in your stack. "
            f"2) Add a small proof in staging with observability. "
            f"3) Codify the pattern in runbooks or CI checks."
        )

    result = {
        "shortAnswer": short[:320] if len(short) > 320 else short,
        "answer": answer,
        "integrationProcedure": integ,
    }
    if out_example:
        result["example"] = out_example
    elif example and qt in ("Mechanics", "Fundamentals", "Definition") and level != "Beginner":
        # Prefer examples on technical topics for Intermediate+
        if any(
            tip in (topic + question).lower()
            for tip in (
                "sql",
                "redis",
                "docker",
                "kubectl",
                "git",
                "http",
                "tcp",
                "postgres",
                "mongo",
                "bash",
                "shell",
                "yaml",
                "index",
                "query",
            )
        ):
            result["example"] = example
    elif example and qt == "Definition" and level == "Beginner" and len(example) < 280:
        result["example"] = example

    return result


def enrich_track(track: str) -> tuple[int, int]:
    bank_path = BANK / f"{track}.json"
    know_path = KNOW / f"{track}.json"
    questions = load_json(bank_path)
    knowledge = load_json(know_path)
    by_id = knowledge.get("_by_id") or {}
    topics = {k: v for k, v in knowledge.items() if not k.startswith("_")}

    answered = 0
    missing_topics = set()
    out = []
    for q in questions:
        topic = (q.get("topic") or "").strip()
        k = None
        if q["id"] in by_id:
            k = by_id[q["id"]]
        elif topic and topic in topics:
            k = topics[topic]
        elif topic:
            missing_topics.add(topic)
            k = {
                "summary": f"{topic} is a core concept in this domain.",
                "problem": f"It addresses practical problems related to {topic}.",
                "concepts": [topic],
                "mechanics": f"Apply {topic} according to its standard mental model.",
                "tradeoffs": f"Weigh {topic} against simpler alternatives and operational cost.",
                "troubleshoot": f"Reproduce the symptom, isolate whether {topic} is misconfigured, then verify with metrics/logs.",
                "example": "",
                "integration": f"1) Identify where {topic} matters. 2) Pilot in a non-critical path. 3) Add monitoring and docs.",
            }
        else:
            # empty topic without by_id — synthesize from question
            k = {
                "summary": question_fallback_summary(q["question"]),
                "problem": "Interviewers want a precise, practical explanation.",
                "concepts": [],
                "mechanics": question_fallback_summary(q["question"]),
                "tradeoffs": "Prefer the simplest correct model, then note real-world caveats.",
                "troubleshoot": "Clarify symptoms, isolate layers, verify with a minimal reproduction.",
                "example": "",
                "integration": "1) Write the answer as a team note. 2) Validate against your production stack. 3) Add a checklist item to onboarding.",
                "shortAnswer": question_fallback_summary(q["question"]),
                "answer": question_fallback_summary(q["question"]),
            }

        fields = build_answer(q, k)
        enriched = {key: q[key] for key in KEEP if key in q}
        enriched.update(fields)
        if enriched.get("shortAnswer") and enriched.get("answer") and enriched.get("integrationProcedure"):
            answered += 1
        out.append(enriched)

    save_json(bank_path, out)
    if missing_topics:
        print(f"WARNING {track}: missing topic knowledge for {sorted(missing_topics)[:20]}...")
    return answered, len(out)


def question_fallback_summary(question: str) -> str:
    q = question.strip()
    if len(q) > 220:
        return q[:217] + "..."
    return q


def main(argv: list[str]) -> int:
    tracks = argv[1:] or ["foundations", "devops", "database"]
    for track in tracks:
        answered, total = enrich_track(track)
        print(f"{track}.json: {answered}/{total} answered")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
