#!/usr/bin/env python3
"""Generate 30 canonical PBL MDX projects from scripts/pbl-projects-data.json."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "src/content/projects"
DATA = ROOT / "scripts/pbl-projects-data.json"
DATE = "2026-09-15"

EVIDENCE = {
    "code": [
        "GitHub repository with clear README",
        "Architecture diagram",
        "Screenshots or short demo recording",
        "Automated tests and CI status",
        "Technical decisions / ADR notes",
        "Live demo or reproducible local run instructions",
    ],
    "devops": [
        "IaC repository (Terraform/Compose/manifests)",
        "CI/CD pipeline definition and green run evidence",
        "Monitoring/alerting screenshots",
        "Runbook for deploy/rollback",
        "Architecture diagram",
        "Postmortem or incident drill notes",
    ],
    "database": [
        "ERD / schema diagram",
        "Migration files",
        "Representative queries",
        "EXPLAIN (ANALYZE) results before/after",
        "Benchmark notes",
        "Backup/restore drill evidence",
    ],
    "qa": [
        "Test strategy document",
        "Test cases / traceability matrix",
        "Automation suite + CI gates",
        "Bug reports and severity rationale",
        "Performance and accessibility findings",
        "Release quality report",
    ],
    "uiux": [
        "Research plan and synthesis (learner-supplied interviews only)",
        "User flows and wireframes",
        "Design iterations with rationale",
        "Interactive prototype link",
        "Usability test script + findings (learner-run)",
        "Case study write-up and developer handoff",
    ],
    "pm": [
        "Project charter",
        "Roadmap and milestone plan",
        "Backlog with acceptance criteria",
        "Risk register",
        "Status reports / RAID log",
        "Change decisions and retrospective",
    ],
}

banks = {
    p.stem: json.loads(p.read_text())
    for p in (ROOT / "src/data/interviews/bank").glob("*.json")
}
dives = [
    json.loads(p.read_text())["id"]
    for p in (ROOT / "src/content/interviews").glob("*.json")
]
source_ids = {
    s["id"] for s in json.loads((ROOT / "src/data/source-registry/sources.json").read_text())
}

topics_by_track: dict[str, list[str]] = {}
all_topics: set[str] = set()
for p in (ROOT / "src/content/topics").rglob("*.mdx"):
    text = p.read_text()
    m = re.search(r"^---([\s\S]*?)---", text)
    if not m:
        continue
    fm = m.group(1)
    idm = re.search(r'^id:\s*["\']?([^"\'\n]+)', fm, re.M)
    tr = re.search(r'^track:\s*["\']?([^"\'\n]+)', fm, re.M)
    if idm and tr:
        tid = idm.group(1).strip()
        track = tr.group(1).strip().strip('"')
        topics_by_track.setdefault(track, []).append(tid)
        all_topics.add(tid)


def pick_topics(track: str, preferred: list[str], n: int = 5) -> list[str]:
    out = [t for t in preferred if t in all_topics]
    for t in topics_by_track.get(track, []):
        if t not in out:
            out.append(t)
        if len(out) >= n:
            break
    if len(out) < 2:
        out = list(all_topics)[:n]
    return out[:n]


def pick_interviews(track: str, level: str, n: int = 12) -> list[str]:
    qs = banks.get(track, [])
    prefer = {
        "beginner": {"Fundamentals", "Definition", "Mechanics"},
        "intermediate": {"Compare", "Architecture", "Troubleshooting", "Scenario"},
        "advanced": {"Architecture", "Troubleshooting", "Scenario", "Compare"},
    }[level]
    ranked = sorted(qs, key=lambda q: (0 if q.get("questionType") in prefer else 1, q["id"]))
    ids = [q["id"] for q in ranked[:n]]
    keys = {
        "foundations": ["foundations", "dns", "tls"],
        "mobile-flutter": ["flutter"],
        "frontend": ["react", "nextjs", "tanstack", "fetch"],
        "backend": ["nestjs", "jwt", "oauth", "orm", "queues"],
        "fullstack": ["fullstack", "cors"],
        "devops": ["devops", "docker", "compose", "iam", "systemd", "slo"],
        "database": ["db-", "postgres", "redis", "mongo", "window", "isolation"],
        "qa": ["qa-"],
        "uiux": ["uiux"],
        "project-management": ["pm-"],
    }.get(track, [])
    for did in dives:
        if any(k in did for k in keys) and did not in ids:
            ids.append(did)
        if len(ids) >= n + 3:
            break
    return ids[:14]


def milestones(pid: str, topics: list[str], specs: list[list[str]]) -> list[dict]:
    ms = []
    for i, (title, objective, why) in enumerate(specs, 1):
        prereq = topics[:2] if i <= 2 else (topics[2:4] or topics[:2])
        ms.append(
            {
                "id": f"{pid}-M{i}",
                "title": title,
                "objective": objective,
                "whyItMatters": why,
                "prerequisiteTopicIds": prereq,
                "tasks": [
                    f"Capture scope for '{title}' in PROJECT_PLAN.md",
                    f"Implement the smallest complete slice that achieves: {objective}",
                    "Document trade-offs and open questions",
                    "Run this milestone validation checklist",
                ],
                "expectedArtifacts": [
                    f"Deliverable proving: {title}",
                    "Updated README or case notes for this milestone",
                    "Portfolio evidence (screenshot, log, test output, or diagram)",
                ],
                "validationChecklist": [
                    "Milestone acceptance criteria are demonstrably met",
                    "At least one failure path was exercised",
                    "Expected artifacts exist and are reviewable",
                ],
                "commonProblems": [
                    "Skipping validation and stacking unfinished work",
                    "Over-engineering before an end-to-end slice runs",
                    "No saved evidence that the milestone works",
                ],
                "completionCriteria": [
                    f"{objective} is demonstrable",
                    "Validation checklist is complete",
                    "Evidence for this milestone is saved",
                ],
            }
        )
    return ms


def dump_list(key: str, items: list[str], indent: int = 0) -> str:
    pad = " " * indent
    if not items:
        return f"{pad}{key}: []"
    lines = [f"{pad}{key}:"]
    for i in items:
        safe = str(i).replace('"', '\\"')
        lines.append(f'{pad}  - "{safe}"')
    return "\n".join(lines)


def dump_milestones(ms: list[dict]) -> str:
    lines = ["milestones:"]
    for m in ms:
        lines.append(f'  - id: "{m["id"]}"')
        lines.append(f'    title: "{m["title"]}"')
        lines.append(f'    objective: "{m["objective"]}"')
        lines.append(f'    whyItMatters: "{m["whyItMatters"]}"')
        lines.append(dump_list("prerequisiteTopicIds", m["prerequisiteTopicIds"], 4))
        for key in [
            "tasks",
            "expectedArtifacts",
            "validationChecklist",
            "commonProblems",
            "completionCriteria",
        ]:
            lines.append(dump_list(key, m[key], 4))
    return "\n".join(lines)


def body(kind: str, pitch: str, tools: list[str], level: str) -> str:
    tools_s = ", ".join(tools)
    if kind == "uiux":
        return f"""import Callout from '../../components/content/Callout.astro';

<Callout type="warning" title="Research integrity">
Do not invent interview quotes or usability findings. Cursor may structure plans; you supply real research.
</Callout>

## Why this project matters

{pitch}

## What job skills it proves

Research synthesis, interaction design, accessibility judgment, and developer-ready handoff.

## Prerequisites

Complete linked topics first. Start Anyway only after reading the warning about missing skills.

## Architecture / approach

Problem framing → research plan → flows → mid-fi → hi-fi → prototype → usability test → handoff.

Tools: {tools_s}.

## Estimated effort

Prefer depth on the critical path over polishing every screen.

## Milestones

Complete frontmatter milestones in order with evidence at each step.

## Step-by-step guidance

1. Write problem statement and constraints.
2. Draft research plan, then run real sessions yourself.
3. Synthesize insights into opportunity areas.
4. Design flows and wireframes for the critical path.
5. Build prototype + accessibility checklist.
6. Run usability tests; iterate with documented changes.
7. Produce developer handoff and case study.

## Validation checkpoints

Critical path covers empty/error states; contrast/focus notes exist; prototype navigable; handoff lists components/states.

## Common errors

Fabricating research; jumping to hi-fi early; ignoring edge states; case study that only shows finals.

## Debugging guidance

Map each design decision back to a finding or constraint.

## Tests / verification

Heuristic evaluation plus at least one learner-run usability pass.

## Security

Anonymize research notes; do not publish identifiable participant data without consent.

## Performance

Document heavy motion/image choices for implementation risk.

## Accessibility

Keyboard path, labels, contrast, reduced-motion notes in handoff.

## Deployment / handoff

Share Figma (or equivalent) with tokens/components and link the case study.

## Portfolio evidence checklist

Save every `portfolioEvidence` item.

## Interview questions

Use the linked **Be ready to explain** set after completion.

## Stretch goals

Motion specs, localization, or a second persona path.

## Retrospective

Hardest? Failed? Validated how? Trade-off? Change next time? Deliberately not designed? Evidence?

## Sources

See frontmatter `sources`.
"""
    if kind == "pm":
        return f"""import Callout from '../../components/content/Callout.astro';

<Callout type="warning" title="Simulated vs real evidence">
Label invented stakeholders/metrics/approvals as **SIMULATED DATA**. Never claim approvals you did not receive.
</Callout>

## Why this project matters

{pitch}

## What job skills it proves

Scope control, estimation humility, risk management, communication cadence, decision logging.

## Prerequisites

Study linked PM topics (SDLC, agile, risk, stakeholders).

## Architecture / approach

Charter → roadmap → backlog → risk → communication → delivery simulation → retrospective.

Tools: {tools_s}.

## Estimated effort

Timebox artifacts; clarity over volume.

## Milestones

Each milestone must leave reviewable binder artifacts.

## Step-by-step guidance

1. Write charter with goals, non-goals, success metrics.
2. Build milestone roadmap and capacity assumptions (mark simulated capacity).
3. Create backlog with acceptance criteria.
4. Maintain risk register with owners.
5. Produce weekly status with a consistent template.
6. Run a change-control scenario and document the decision.
7. Close with retrospective and evidence pack.

## Validation checkpoints

Scope in/out explicit; risks have owners; status separates facts vs asks; simulated items labeled.

## Common errors

Vague metrics; hidden scope; status theater; fabricating approvals.

## Debugging guidance

Re-check assumptions, dependencies, and the single next decision needed.

## Tests / verification

Peer-review: can another PM continue without basic questions?

## Security

Use placeholders for credentials and customer data in plans.

## Performance

Predictability: WIP limits, lead-time assumptions, bottleneck notes.

## Accessibility

Include a11y acceptance criteria in stories when UI exists.

## Deployment / handoff

Hand off binder with RACI, open risks, clean backlog.

## Portfolio evidence checklist

Use `portfolioEvidence`; mark SIMULATED DATA clearly.

## Interview questions

Practice linked questions—especially trade-offs and recovery.

## Stretch goals

Jira import CSV structure or release readiness checklist.

## Retrospective

Hardest? Failed? Validated? Trade-off? Change? Not committed? Evidence of readiness?

## Sources

See frontmatter `sources`.
"""
    return f"""import Callout from '../../components/content/Callout.astro';

<Callout type="info" title="Build, do not copy a finished solution">
Guide implementation yourself. Use the Cursor mentor prompt one milestone at a time.
</Callout>

## Why this project matters

{pitch}

## What job skills it proves

Learning-outcome skills under realistic constraints—not toy tutorials.

## Prerequisites

Complete linked prerequisite skills/topics before or alongside early milestones.

## Architecture / approach

Sketch architecture first. Prefer locally runnable tooling. Record trade-offs in PROJECT_PLAN.md.

Tools: {tools_s}.

## Estimated effort

Estimates assume focused work; deepen production concerns as level increases.

## Milestones

For each milestone: WHAT, WHY, required knowledge, what you implement, how you verify, common failures, evidence to save.

## Step-by-step guidance

1. Write PROJECT_PLAN.md and inspect the repo.
2. Ship milestone 1 as a thin vertical slice.
3. Add appropriate tests/validation.
4. Advance only after checklist pass; keep README current.
5. Finish with full validation and portfolio pack.

## Validation checkpoints

Do not skip milestone checklists. Exercise failure paths before claiming done.

## Common errors

Skipping persistence/auth boundaries; ignoring error states; inventing packages; leaking secrets; claiming green CI without running commands.

## Debugging guidance

Reproduce → isolate → hypothesize → verify. Keep a short debug log for interviews.

## Tests / verification

Automated tests where natural; otherwise scripted manual verification with expected outputs.

## Security

No secrets in git; least privilege; validate input; careful auth storage.

## Performance

Measure before optimizing; capture before/after notes for advanced work.

## Accessibility

For UI surfaces, cover keyboard/semantics basics and document gaps.

## Deployment / handoff

Reproducible run/deploy steps; document cloud assumptions.

## Portfolio evidence checklist

Capture every `portfolioEvidence` item.

## Interview questions

On completion, practice linked **Be ready to explain** questions (why/trade-off/debugging for {level}).

## Stretch goals

Only after core acceptance criteria pass.

## Retrospective

Hardest? Failed? Debug/validate? Trade-off? Change? Scale? Deliberately not built? Evidence?

## Sources

See frontmatter `sources`.
"""


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for p in OUT.glob("*.json"):
        p.unlink()
    for p in OUT.glob("*.mdx"):
        p.unlink()

    raw = json.loads(DATA.read_text())
    assert len(raw) == 30

    # Wire previous/next within each track by level order
    level_order = {"beginner": 0, "intermediate": 1, "advanced": 2}
    by_track: dict[str, list[dict]] = {}
    for item in raw:
        by_track.setdefault(item["track"], []).append(item)
    for track, items in by_track.items():
        items.sort(key=lambda x: level_order[x["level"]])
        for i, item in enumerate(items):
            item["previousProjectId"] = items[i - 1]["id"] if i > 0 else None
            item["nextProjectId"] = items[i + 1]["id"] if i < len(items) - 1 else None

    written = []
    for item in raw:
        topics = pick_topics(item["track"], item["topicPrefs"])
        interviews = pick_interviews(item["track"], item["level"])
        sources = [s for s in item["sources"] if s in source_ids]
        if not sources:
            sources = ["RFC-9110-HTTP"]
        ms = milestones(item["id"], topics, item["milestoneSpecs"])
        evidence = EVIDENCE[item["evidence"]]

        fm_parts = [
            "---",
            f'id: "{item["id"]}"',
            f'title: "{item["title"]}"',
            f'slug: "{item["slug"]}"',
            f'track: "{item["track"]}"',
            f'level: "{item["level"]}"',
            f'difficulty: "{item["level"]}"',
            f'summary: "{item["summary"]}"',
            f'portfolioPitch: "{item["portfolioPitch"]}"',
            f"estimatedHours: {item['estimatedHours']}",
            dump_list("prerequisiteSkillIds", item["prerequisiteSkillIds"]),
            dump_list("learningOutcomeSkillIds", item["learningOutcomeSkillIds"]),
            dump_list("recommendedTools", item["recommendedTools"]),
            dump_list("portfolioEvidence", evidence),
            dump_list("relatedTopicIds", topics),
            dump_list("relatedInterviewQuestionIds", interviews),
            dump_list("sources", sources),
            f'createdAt: "{DATE}"',
            f'updatedAt: "{DATE}"',
            f'lastVerified: "{DATE}"',
        ]
        if item.get("previousProjectId"):
            fm_parts.append(f'previousProjectId: "{item["previousProjectId"]}"')
        if item.get("nextProjectId"):
            fm_parts.append(f'nextProjectId: "{item["nextProjectId"]}"')
        fm_parts.extend(
            [
                'status: "published"',
                'translationStatus: "partial"',
                dump_milestones(ms),
                "---",
                "",
                body(item["kind"], item["portfolioPitch"], item["recommendedTools"], item["level"]),
            ]
        )
        path = OUT / f"{item['slug']}.mdx"
        path.write_text("\n".join(fm_parts) + "\n")
        written.append(item["id"])

    print(f"Wrote {len(written)} projects to {OUT}")
    for wid in written:
        print(f" - {wid}")


if __name__ == "__main__":
    main()
