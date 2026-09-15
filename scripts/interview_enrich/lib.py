#!/usr/bin/env python3
"""Helpers for concrete interview knowledge + merge."""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
BANK = ROOT / "src/data/interviews/bank"
KNOW = ROOT / "src/data/interviews/knowledge"

KEEP = ("id", "level", "category", "topic", "questionType", "question")

GENERIC_RE = re.compile(
    r"matters in .+?: you should define it precisely|"
    r"Without a clear grasp of .+?, teams mis-design APIs|"
    r"Walk .+ start to finish: inputs → processing|"
    r"Agree on the definition of .+ with the team|"
    r"smallest vertical slice|"
    r"Lead with impact, then mechanism|"
    r"Know the definition, boundaries, failure modes|"
    r"Key fundamentals: Definition and non-goals|"
    r"Reproduce, isolate, compare signals|"
    r"Approach: .+ Impact first, then mechanisms|"
    r"// QA note for |"
    r"Design note for |"
    r"Delivery note for |"
    r"// Full-stack note for |"
    r"browser → API → DB with one request id|"
    r"outcome 2\) owner 3\) date 4\) risk|"
    r"user job\n- empty/error/loading|"
    r"test\('smoke', async \(\{ page \}\)|"
    r"core idea in|"
    r"reduce ambiguity, prevent recurring failures",
    re.I,
)


def K(
    summary: str,
    problem: str,
    concepts: list[str],
    mechanics: str,
    tradeoffs: str,
    troubleshoot: str,
    example: str,
    integration: str,
) -> dict:
    return {
        "summary": summary.strip(),
        "problem": problem.strip(),
        "concepts": concepts,
        "mechanics": mechanics.strip(),
        "tradeoffs": tradeoffs.strip(),
        "troubleshoot": troubleshoot.strip(),
        "example": example.strip(),
        "integration": integration.strip(),
    }


def curated(
    short: str,
    answer: str,
    integration: str,
    example: str | None = None,
) -> dict:
    out = {
        "summary": short.strip(),
        "problem": "",
        "concepts": [],
        "mechanics": answer.strip(),
        "tradeoffs": "",
        "troubleshoot": "",
        "example": (example or "").strip(),
        "integration": integration.strip(),
        "shortAnswer": short.strip(),
        "answer": answer.strip(),
    }
    return out


def first_sentence(text: str) -> str:
    text = (text or "").strip()
    if not text:
        return ""
    m = re.search(r"(.+?[.!?])(\s|$)", text)
    return (m.group(1) if m else text).strip()


def compare_peer(question: str) -> str | None:
    m = re.search(
        r"Compare\s+.+?\s+with\s+(.+?)\.\s*When would you choose",
        question,
        re.I,
    )
    return m.group(1).strip() if m else None


def is_generic_blob(text: str) -> bool:
    return bool(GENERIC_RE.search(text or ""))


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

    # Prefer explicit curated fields when present
    if k.get("shortAnswer") and k.get("answer"):
        out = {
            "shortAnswer": k["shortAnswer"].strip(),
            "answer": k["answer"].strip(),
            "integrationProcedure": (k.get("integration") or integration).strip(),
        }
        if example:
            out["example"] = example
        return out

    short = ""
    answer = ""
    out_example = None

    if qt == "Definition":
        short = summary
        answer = f"{summary} {problem}".strip()
        if concepts:
            answer += " Key pieces: " + "; ".join(concepts[:4]) + "."
        if level == "Advanced" and tradeoffs:
            answer += " " + first_sentence(tradeoffs)
    elif qt == "Fundamentals":
        short = (
            f"Know: {'; '.join(concepts[:3])}."
            if concepts
            else summary
        )
        answer = (
            f"Before using {topic or 'this'} correctly: {'; '.join(concepts)}. "
            f"{summary} {problem}"
        ).strip()
        if level != "Beginner" and mechanics:
            answer += " " + first_sentence(mechanics)
    elif qt == "Mechanics":
        short = first_sentence(mechanics) or summary
        answer = mechanics
        if level == "Advanced" and troubleshoot:
            answer += " " + first_sentence(troubleshoot)
        if example:
            out_example = example
    elif qt == "Architecture":
        short = first_sentence(tradeoffs) or summary
        answer = f"{tradeoffs} {problem}".strip()
        if level == "Advanced" and troubleshoot:
            answer += " " + first_sentence(troubleshoot)
        if example:
            out_example = example
    elif qt == "Troubleshooting":
        short = first_sentence(troubleshoot) or summary
        answer = troubleshoot
        if mechanics:
            answer += " Mental model: " + first_sentence(mechanics)
        if example:
            out_example = example
    elif qt == "Compare":
        peer = compare_peer(question) or "the related alternative"
        short = (
            f"Choose {topic} vs {peer} by constraint fit—not fashion."
            if topic
            else first_sentence(tradeoffs) or summary
        )
        answer = (
            f"Comparing {topic or 'this'} with {peer}: {tradeoffs} "
            f"{problem}"
        ).strip()
        if example and level != "Beginner":
            out_example = example
    else:
        # Scenario / Curated / Conceptual without explicit answer
        short = summary or first_sentence(mechanics) or question[:180]
        answer = " ".join(
            p
            for p in [summary, problem, mechanics, tradeoffs if level != "Beginner" else "", troubleshoot if level == "Advanced" else ""]
            if p
        ).strip()
        if example:
            out_example = example

    if not short:
        short = summary or "See full answer."
    if not answer:
        answer = short
    if not integration:
        integration = (
            f"1) Document when {topic or 'this'} applies. "
            f"2) Pilot on one flow with a measurable check. "
            f"3) Codify owner, rollback, and CI/process gate."
        )

    # Level polish
    if level == "Beginner" and len(answer) > 900:
        # keep beginner readable
        parts = re.split(r"(?<=[.!?])\s+", answer)
        answer = " ".join(parts[:5]).strip()
    elif level == "Advanced" and tradeoffs and tradeoffs not in answer:
        answer = (answer + " " + first_sentence(tradeoffs)).strip()

    result = {
        "shortAnswer": short[:340],
        "answer": answer,
        "integrationProcedure": integration,
    }
    # Prefer examples when they clarify (almost always for these tracks)
    if out_example:
        result["example"] = out_example
    elif example and qt in (
        "Mechanics",
        "Architecture",
        "Troubleshooting",
        "Scenario",
        "Curated",
        "Conceptual",
        "Compare",
        "Fundamentals",
        "Definition",
    ):
        result["example"] = example
    return result


def merge_track(track: str, knowledge: dict) -> tuple[int, int, int]:
    """Write knowledge JSON and merge into bank. Returns (answered, total, generic)."""
    KNOW.mkdir(parents=True, exist_ok=True)
    know_path = KNOW / f"{track}.json"
    with know_path.open("w", encoding="utf-8") as f:
        json.dump(knowledge, f, ensure_ascii=False, indent=2)
        f.write("\n")

    bank_path = BANK / f"{track}.json"
    questions = json.loads(bank_path.read_text(encoding="utf-8"))
    by_id = knowledge.get("_by_id") or {}
    topics = {k: v for k, v in knowledge.items() if not k.startswith("_")}

    answered = 0
    generic = 0
    out = []
    for q in questions:
        topic = (q.get("topic") or "").strip()
        if q["id"] in by_id:
            k = by_id[q["id"]]
        elif topic and topic in topics:
            k = topics[topic]
        elif topic:
            raise KeyError(f"{track}: missing knowledge for topic {topic!r}")
        else:
            raise KeyError(f"{track}: missing _by_id for {q['id']}")

        fields = build_answer(q, k)
        enriched = {key: q[key] for key in KEEP if key in q}
        enriched.update(fields)
        blob = " ".join(
            [
                enriched.get("shortAnswer", ""),
                enriched.get("answer", ""),
                enriched.get("example", ""),
                enriched.get("integrationProcedure", ""),
            ]
        )
        if is_generic_blob(blob):
            generic += 1
        if (
            enriched.get("shortAnswer")
            and enriched.get("answer")
            and enriched.get("integrationProcedure")
        ):
            answered += 1
        out.append(enriched)

    with bank_path.open("w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)
        f.write("\n")
    return answered, len(out), generic
