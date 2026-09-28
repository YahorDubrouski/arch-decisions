---
name: clean-code-naming
description: >
  Applies Clean Code naming in arch-decisions. Use when naming or renaming
  methods, classes, types, booleans, HTTP controllers, or public APIs.
  Methods are verbs, types are nouns, and one word is used per concept.
---

# Clean Code naming

Names answer what and why, not how, unless the implementation is the point.

## Rules

- Methods are verbs. Classes and types are nouns.
- HTTP controllers use short verb names (`post`, `get`) when the controller class and route already disambiguate. Avoid `handle` prefixes and long HTTP-verb echoes like `handlePostArchitectureDecisionGeneration`.
- Drop redundant `data`, `info`, and `object` unless they disambiguate. Prefer `projectContext` over `contextData`.
- One word per concept across the codebase. Pick one of `fetch`, `get`, or `retrieve` for the same operation and keep it.
- Booleans are predicates: `isValid`, `hasPermission`, `shouldRetry`.

## Before finishing

Would a new teammate understand each public name without opening the body?
