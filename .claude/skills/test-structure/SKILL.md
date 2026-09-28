---
name: test-structure
description: >
  Structures arch-decisions tests with Arrange/Act/Assert and business-facing
  names. Use when writing or editing Jest, Vitest, or pytest tests, test
  docblocks, or assertion messages. Test names state the business rule.
---

# Test structure and documentation

## Arrange / Act / Assert

Every test has Arrange, Act, and Assert comments, in that order. Setup for `expect(...).toThrow`, `pytest.raises`, or `rejects` goes before Act when it is part of the arrangement.

- TypeScript / Jest: `// Arrange`, `// Act`, `// Assert`
- Python / pytest: `# Arrange`, `# Act`, `# Assert`

```ts
it('returns EC2 for small cost-optimized teams', async () => {
  // Arrange
  const context = buildProjectContext({
    teamSize: '1-5',
    budgetSensitivity: 'cost-optimized',
  });

  // Act
  const result = await provider.evaluateAll(context);

  // Assert
  expect(result.compute.recommended).toBe('EC2');
});
```

```python
def test_when_team_is_small_and_cost_optimized_then_recommend_ec2() -> None:
    # Arrange
    context = make_project_context(teamSize="1-5", budgetSensitivity="cost-optimized")

    # Act
    result = await provider.evaluate_all(context)

    # Assert
    assert result.compute.recommended == "EC2"
```

## Business logic as documentation

- File or describe docblock, when useful: list the business rules under test.
- Test docblock: short Given / When / Then blocks.
- Test name: the business rule, not the implementation.
- Assertion messages, when the expectation is non-obvious: the business outcome, not only the technical check.
- Given: input data and preconditions only. No actions.
- When: one business action.
- Then: the expected business outcome in plain language.

```ts
/**
 * Given
 * - Team size is 1-5 and budget is cost-optimized.
 * When
 * - Recommendations are evaluated.
 * Then
 * - Compute recommendation is EC2.
 */
it('when team is small and cost-optimized then recommend EC2', async () => {
  // Arrange
  // Act
  // Assert
});
```

Bad name: `it('calls evaluateAll and checks compute.recommended')`.

## Names from the docblock

- Derive the test name from When + Then when both exist.
- Pattern: `when_<condition>_then_<business_outcome>` (Jest/Vitest `it(...)` string, or pytest `test_when_…_then_…`).
- Keep names concise and readable by a non-technical reader.
