---
title: "Validating Webhooks Securely: Signatures and Replays"
date: "2025-02-11"
author: "Blendistry"
image: "https://cyclr.com/nitropack_static/VuXxlbQNhqQgnktlfMtCedOWhlGohlKT/assets/images/optimized/rev-1d1934b/cyclr.com/wp-content/uploads/2024/05/Webhook-Examples-1024x548.png"
excerpt: "Validating Webhooks Securely: Signatures and Replays: A practical, theory-first walkthrough on Reject forged or replayed webhook calls with HMAC signatures, timestamps, and idempotency., with a tiny, focused code snippet and an actionable checklist."
category: "Backend"
---

# Validating Webhooks Securely: Signatures and Replays

Validating Webhooks Securely: Signatures and Replays: A practical, theory-first walkthrough on Reject forged or replayed webhook calls with HMAC signatures, timestamps, and idempotency., with a tiny, focused code snippet and an actionable checklist.

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

```js
// verify HMAC signature
const crypto = require('crypto');
function verify(req, secret) {
const sig = req.headers['x-hub-signature-256'];
const h = crypto.createHmac('sha256', secret)
.update(req.rawBody).digest('hex');
  return sig === `sha256=${h}`;
}
```

## Common pitfalls

Things developers often do that make this worse.

## What to do next

Actionable next steps and references.

