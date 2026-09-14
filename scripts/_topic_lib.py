#!/usr/bin/env python3
"""Helpers for one-shot MDX topic generation."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TOPICS = ROOT / "src/content/topics"
DATE = "2026-09-14"
CONTRIB = "  - name: Dev Turning Point"


def fm(
    *,
    id: str,
    title: str,
    title_bn: str,
    description: str,
    description_bn: str,
    track: str,
    category: str,
    difficulty: str,
    minutes: int,
    prerequisites: list[str],
    recommended_before: list[str],
    unlocks: list[str],
    related: list[str],
    careers: list[str],
    tags: list[str],
    sources: list[str],
    versions: dict[str, str] | None = None,
) -> str:
    def arr(xs: list[str]) -> str:
        if not xs:
            return "[]"
        return "[" + ", ".join(xs) + "]"

    lines = [
        "---",
        f"id: {id}",
        f"title: {title}",
        f"titleBn: {title_bn}",
        f"description: {description}",
        f"descriptionBn: {description_bn}",
        f"track: {track}",
        f"category: {category}",
        f"difficulty: {difficulty}",
        f"estimatedMinutes: {minutes}",
        f"prerequisites: {arr(prerequisites)}",
        f"recommendedBefore: {arr(recommended_before)}",
        f"unlocks: {arr(unlocks)}",
        f"related: {arr(related)}",
        f"careers: {arr(careers)}",
        f"tags: {arr(tags)}",
        "status: published",
        "translationStatus: partial",
    ]
    if versions:
        lines.append("applicableVersions:")
        for k, v in versions.items():
            lines.append(f'  {k}: "{v}"')
    lines += [
        f"createdAt: {DATE}",
        f"updatedAt: {DATE}",
        f"lastVerified: {DATE}",
        f"sources: {arr(sources)}",
        "contributors:",
        CONTRIB,
        "---",
        "",
    ]
    return "\n".join(lines)


def write(rel: str, content: str) -> None:
    path = TOPICS / rel
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.exists():
        raise SystemExit(f"Refusing to overwrite existing topic: {path}")
    path.write_text(content, encoding="utf-8")
    print(f"wrote {path.relative_to(ROOT)}")


def write_all(items: list[tuple[str, str]]) -> None:
    for rel, content in items:
        write(rel, content)
    print(f"done: {len(items)} topics")
