---
name: code-clarity
description: >
  Keeps arch-decisions code readable. Use when writing or editing functions,
  HTTP handlers, names, or comments in this repository. Rename before commenting,
  keep one abstraction level per function, and make HTTP status mapping obvious
  from the method name.
---

# Code clarity

Readers come first. If a name needs a comment to be understood, rename it.

## Rules

- Comments explain why (constraints, quirks, trade-offs). When the mechanics stay opaque, explain what and how in plain language. Follow the `human-comments` skill for regexes, backoff, and workarounds.
- Do not narrate obvious lines (`// set x to 1`).
- One level of abstraction per function. If a block can be named with a phrase, extract a well-named private method.
- HTTP layer: status codes and error shapes must be obvious from the method that sends them (for example `sendBadRequestForInvalidContext`).
- Avoid abbreviations except industry-standard ones (`id`, `url`, `http`).

## Before finishing

- Would a new teammate understand each public name without opening the body?
- Are comments only where clarity would otherwise be lost?
