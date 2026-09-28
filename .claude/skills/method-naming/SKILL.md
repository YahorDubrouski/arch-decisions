---
name: method-naming
description: >
  Names methods in arch-decisions by action, side effect, and single
  responsibility. Use when creating or refactoring functions in TypeScript
  or JavaScript. Reject vague names such as process, handle, and resolve
  unless a framework requires them.
---

# Method naming

When creating or refactoring methods, follow these rules.

## 1. Start with an action verb

Prefer action-based names:

```js
function findUserById(id) {}
function createInvoice(order) {}
function sendVerificationEmail(email) {}
function calculateCustomerDiscount(customer) {}
function validateOrder(order) {}
```

Avoid noun-only names:

```js
function user(id) {}
function invoice(order) {}
function discount(customer) {}
```

## 2. Avoid vague words

Do not use vague method names unless a framework requires them.

Avoid `process`, `handle`, `resolve`, `manage`, `execute`, and `run`.

Prefer an explicit business action: `createInvoice`, `sendVerificationEmail`, `calculateCustomerDiscount`.

`handle` is allowed only where the framework requires that method name (Jobs, Commands, Listeners, middleware, handlers).

## 3. Reveal side effects

If a method changes data, saves data, sends something, logs something, dispatches a job, or calls an external service, the name must say so.

```js
// Hides a write
function getUser(id) {
  const user = findUserOrFail(id);
  user.lastSeenAt = new Date();
  saveUser(user);
  return user;
}

// Name matches the write
function findUserAndUpdateLastSeen(id) {}
```

Prefer a split when the read and the write are separate actions:

```js
const user = findUser(id);
markUserAsSeen(user);
```

## 4. If the method is hard to name, split it

A method that validates, charges, invoices, notifies, and syncs is several methods. Give each action its own name.

## Before finishing

- Does the name start with a clear action verb?
- Does it avoid vague words?
- Does it reveal side effects?
- Does the method do only one clear thing?
- Would a developer understand the method without reading its body?
