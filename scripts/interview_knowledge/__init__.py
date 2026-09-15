"""Helpers for interview knowledge authoring."""

from __future__ import annotations


def entry(
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
    example: str = "",
) -> dict:
    d = {
        "summary": short.strip(),
        "problem": "",
        "concepts": [],
        "mechanics": "",
        "tradeoffs": "",
        "troubleshoot": "",
        "example": example.strip(),
        "integration": integration.strip(),
        "shortAnswer": short.strip(),
        "answer": answer.strip(),
    }
    return d
