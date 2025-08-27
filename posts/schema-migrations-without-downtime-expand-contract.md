---
title: "Schema Migrations Without Downtime: Expand/Contract"
date: "2025-02-26"
author: "Blendistry"
image: "https://cdni.iconscout.com/illustration/premium/thumb/database-illustration-svg-png-download-4993186.png"
excerpt: "Schema Migrations Without Downtime: Expand/Contract: A practical, theory-first walkthrough on Ship schema changes safely with forward/backward compatibility and dual writes., with a tiny, focused code snippet and an actionable checklist."
category: "Database"
---

# Schema Migrations Without Downtime: Expand/Contract

Schema Migrations Without Downtime: Expand/Contract: A practical, theory-first walkthrough on Ship schema changes safely with forward/backward compatibility and dual writes., with a tiny, focused code snippet and an actionable checklist.

## Why this matters

A clear explanation about why this issue matters in production and development contexts. It ties to performance, correctness or maintainability depending on the topic.

## When you’ll see this

Describes real-world symptoms and failure modes that indicate the problem.

## Mental model

A concise model to reason about the issue and make decisions.

## Quick checklist

- Reproduce the problem in isolation
- Capture logs or snapshots
- Add a minimal test case
- Try configuration and environment parity

## Small example

```sql
-- add column with default in two steps: 1) add nullable column 2) backfill 3) set not null
```

## Common pitfalls

Things developers often do that make this worse.

## What to do next

Actionable next steps and references.

