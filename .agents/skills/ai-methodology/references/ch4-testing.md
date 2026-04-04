# Chapter 4: Testing — Prompts & Quality Gates

You are a senior QA engineer helping a development team build and maintain
comprehensive automated test coverage — whether starting from a manual test library
or from acceptance criteria and implementation code.

---

## Track Selection

**Use Track A if:** You have manual test cases in TestRail, Excel, Jira, Confluence,
or plain documents and want to convert them into automated tests.

**Use Track B if:** You are writing tests for a new feature starting from requirements,
acceptance criteria, the Phase 2 prototype spec, or existing implementation code.

**Use both:** Track A for the regression backlog, Track B for every new feature.

---

## TRACK A — Automating Existing Manual Test Cases

### Step 1: Triage (run first — always)

Not every manual case is worth automating immediately.

### Prompt A1 — Triage Manual Test Cases

```
You are a senior QA engineer.

Triage the following manual test cases for automation priority.

For each case, classify as:
  P1 — Automate immediately (high frequency + high impact)
  P2 — Automate next sprint (medium value)
  P3 — Automate later (low frequency or unstable flow)
  SKIP — Do not automate (exploratory, one-off, or requires human judgement)

For each P1 and P2 case, specify:
  - Recommended test type: [Unit | Component | API | E2E | Performance]
  - Reason for the recommendation
  - Estimated complexity: [Low | Medium | High]
  - Dependencies: [what needs to exist before this can be automated]

After the triage, produce an automation roadmap:
  Sprint 1: [P1 cases that are ready to automate now]
  Sprint 2: [remaining P1 + P2 cases]
  Backlog:  [P3 cases with brief rationale]

Our test stack: [describe: framework, component test library, API test library, E2E tool]

Manual test cases:
[paste — any format: table, bullet list, numbered steps, or prose]
```

**Priority guidance:**

| Criterion | Priority | Reason |
|---|---|---|
| Run on every release | P1 | High frequency makes ROI immediate |
| Regression for critical paths | P1 | Failures are high-impact and must be caught fast |
| Data-driven (many input variants) | P1 | Manual execution of 30+ rows is impractical |
| API contract tests | P1 | Fast, stable, highest ROI of all test types |
| Permission / role matrix | P1 | Tedious manually, straightforward to automate |
| Third-party integration (payment, email) | P2 | Mock at HTTP level; keep a manual smoke test |
| Flaky UI flows | P3 | Brittle automation adds noise, not confidence |
| Exploratory / session-based | SKIP | Requires human intuition — do not automate |

### Step 2: Convert Each Case

### Prompt A2 — Convert Manual Case to Automated Test

```
Read CLAUDE.md. Convert the following manual test case to automated test code.

Rules:
  - Follow our test patterns from CLAUDE.md
  - Reference this existing test file for structure: [path from CLAUDE.md]
  - Add a comment above the test linking it to the original manual case ID:
    // TC-[id]: [original test case title]
  - Use realistic test data — not "test@test.com" or "foo"
  - Mock at the correct level: API mocking tools for API calls, mock functions for callbacks
  - One test file per feature area — do not create one file per test case

For each manual step, translate to:
  a) A user-action call:  user action methods | page interaction methods
  b) An API call with the exact request body
  c) A database/fixture setup call

After the test code, provide:
  - Any test fixtures or factory functions needed
  - Any API mock handlers needed
  - Items that CANNOT be automated: [MANUAL ONLY]: reason

Our test stack: [framework] | Reference test: [path]

Manual test case to convert:
[paste single manual test case]
```

**Handling complex manual cases:**

| Manual Test Type | Automation Strategy |
|---|---|
| Multi-step workflow (3+ screens) | E2E test with E2E testing framework. Unique email per test run. |
| Data-driven (many input rows) | Parameterised tests. AI generates the data table. |
| Permission matrix (role × feature) | One test group per role, one test case per permission case. |
| Third-party integration | Mock at HTTP level with API mocking tools. Keep real flow as manual smoke test. |
| Visual / layout verification | Automate functional assertions. Add: `// [VISUAL]: requires screenshot comparison` |
| Timed or scheduled events | Fake timers for unit. Trigger directly via API for E2E. |

### Quality Gate — Track A
- [ ] All P1 manual cases automated and passing in CI
- [ ] Each automated test has a comment linking to original manual case ID
- [ ] Manual cases marked 'Automated' in test management tool
- [ ] All [MANUAL ONLY] annotations reviewed — each has a ticket
- [ ] P2 cases have tickets created and estimated

---

## TRACK B — Generating Tests from Scratch

### Starting Point 1: From Acceptance Criteria (best practice)

Tests written from acceptance criteria verify intended behaviour — not just what the
code happens to do. A failing test means the feature does not meet the spec.

**Step 1 — Derive the test plan (no code yet):**

### Prompt B1 — Derive Test Scenarios from Acceptance Criteria

```
You are a senior QA engineer.

Derive a complete set of test scenarios from the acceptance criteria below.
Do NOT write code yet — produce a structured test plan first.

For each scenario:
  Test ID:   TC-[n]
  Title:     [describes the behaviour — not the steps]
  Type:      [Unit | Component | API | E2E | Performance]
  Category:  [Positive | Negative | Edge Case | Security | Performance]
  Priority:  [Critical | High | Medium | Low]
  Source AC: [which acceptance criterion this covers]
  Preconditions: [system state required before the test]
  Input:     [what data or action triggers the scenario]
  Expected:  [the observable result if the system is working correctly]

After all scenarios, produce a COVERAGE MATRIX:
  For each acceptance criterion:
    - How many tests cover it
    - Which test types cover it
    - [UNDER-COVERED] if fewer than 2 tests cover it

Then list DERIVED SCENARIOS:
  Edge cases and negative tests not explicitly in the ACs but required by the behaviour.

Acceptance criteria: [paste from Phase 1]
Prototype spec (8 states): [paste from Phase 2]
```

**Example Output (excerpt — coverage matrix from a team invitation feature):**

```
COVERAGE MATRIX:
| AC | AC Text | TC Count | Types |
| AC-1 (US-1) | Admin enters email, clicks invite | 3 | Unit, Component, API |
| AC-2 (US-1) | Invalid email shows validation error | 2 | Component, API |
| AC-3 (US-2) | Invitee clicks link and joins team | 3 | API, Component, E2E |
| AC-4 (US-3) | Admin revokes pending invitation | 2 | API, Component |

DERIVED SCENARIOS (not in ACs):
  TC-12: Inviting an email that is already a team member → 409 ALREADY_MEMBER
  TC-13: Inviting when rate limit reached → 429, warning banner, button disabled
  TC-14: Expired invitation link → full-page "This invitation has expired"
  TC-15: Revoking an already-accepted invitation → 409 ALREADY_ACCEPTED
```

**Step 2 — Generate the test code:**

### Prompt B2 — Generate Test Code from Scenarios

```
Read CLAUDE.md and reference test file: [path from CLAUDE.md]

Generate test code for the following TC list.
Tests must match our test patterns exactly.

Test naming: describe behaviour, not implementation steps.
  GOOD: "shows error when email is already registered"
  BAD:  "tests handleSubmit with duplicate email"

For each test:
  - Comment with TC number and the AC it covers
  - Use realistic test data — real-looking emails, names, amounts
  - Each test is independent — no shared mutable state
  - Mock at the correct level

After the test code:
  1. Fixture file (if shared test data is needed)
  2. API mock handler file (if API mocking is needed)
  3. List of tests requiring additional setup not yet in the codebase

Test scenarios: [paste TC list from Step 1]
```

**Test Data Factory Pattern:**

Generate a test data factory file alongside the test code. This avoids hardcoded test data
scattered across test files and makes tests readable.

```
// Example: tests/factories/invitationFactory.[ext]
import { dataGenerator } from 'data-generation-library';

export function buildInvitation(overrides: Partial<Invitation> = {}): Invitation {
  return {
    id: dataGenerator.string.uuid(),
    email: dataGenerator.internet.email(),
    teamId: dataGenerator.string.uuid(),
    status: 'pending',
    invitedBy: dataGenerator.string.uuid(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    ...overrides, // caller overrides only the fields they care about
  };
}

// Usage in tests:
const expiredInvite = buildInvitation({ expiresAt: new Date('2020-01-01') });
const acceptedInvite = buildInvitation({ status: 'accepted' });
```

**Rules for factories:**
- One factory per domain entity (user, team, invitation, etc.)
- Use data generation or realistic defaults — never `"test"` or `"foo"`
- Accept `overrides` param so each test controls only the fields it cares about
- Place in `tests/factories/` (or match existing project convention from CLAUDE.md)

### Starting Point 2: The 8-State Component Test Template

Every state in the Phase 2 prototype spec maps to a test.

### Prompt B3 — 8-State Component Tests

```
Read CLAUDE.md and reference test file: [path]

Generate a component test file covering all 8 states for [component name].

STATE 1 — DEFAULT
  Test: "renders with correct initial content and all interactive elements enabled"
  Verify: initial field values, active buttons, visible text from spec

STATE 2 — LOADING
  Test: "shows loading indicator and disables interaction during async operation"
  Verify: spinner visible, form fields disabled, submit button disabled

STATE 3 — EMPTY
  Test: "renders empty state correctly when no data exists"
  Verify: empty state message (exact text from spec), CTA button, no data rows

STATE 4 — SUCCESS
  Test: "shows success feedback and side effects after successful operation"
  Verify: success message (exact text), modal close/redirect, cache invalidation

STATE 5 — ERROR
  Test: "shows error message without crashing when operation fails"
  Verify: error message (exact text), recovery action available, no crash

STATE 6 — VALIDATION (one test per rule)
  Test: "shows [exact error message] when [field] [condition]"
  Verify: exact message text from spec, correct field highlighted

STATE 7 — PERMISSION
  Test: "renders restricted view for users without required permission"
  Verify: permission message (exact text), disabled/hidden elements, no data leak

STATE 8 — OFFLINE
  Test: "shows offline message and disables submit when network unavailable"
  Verify: offline banner (exact text), submit disabled, form state preserved

INTERACTION TESTS:
  - User can complete the primary happy path
  - Form submits the correct data shape to the API
  - Cancel / dismiss works correctly
  - Keyboard navigation works (Tab, Enter, Escape)

ACCESSIBILITY TESTS (from Phase 2 accessibility section):
  - Focus order matches spec: Tab moves through elements in expected sequence
  - All interactive elements have visible focus indicator
  - Screen reader announces state changes (loading, success, error) via aria-live
  - Error messages linked to fields via aria-describedby
  - No information conveyed by colour alone (icons/text accompany colour signals)
  - Form can be completed entirely via keyboard (no mouse required)

Component: [name]
Prototype spec (8 states): [paste from Phase 2]
Component file: [path]
```

### Starting Point 3: From Implementation Code

Use when tests must be written for existing code with no prior spec.

**Warning:** Tests from code verify what the code does — not what it should do.
Always cross-reference generated tests against acceptance criteria.

### Prompt B4 — Tests from Implementation Code

```
Read CLAUDE.md. Analyse the following implementation file(s).

Analysis pass (do this before writing tests):
  1. List every function/method
  2. For each function, identify:
     - All code paths (if/else branches, switch cases, early returns)
     - All possible inputs (valid, invalid, null, empty, boundary)
     - All side effects (DB writes, API calls, events)
     - All error conditions (try/catch, thrown errors, rejected promises)
  3. Flag any code path with no test coverage as [UNTESTED PATH]

Then generate tests for:
  - Every [UNTESTED PATH]
  - Every error condition
  - Every boundary value
  - Permission enforcement (if auth checks present)

Comment each test: // COVERS: [function name] — [code path description]

After tests, list:
  - [UNTESTED PATH] items you could not automate (and why)
  - [VERIFY AGAINST SPEC]: anything where you assumed expected behaviour
    that the team should validate against the original requirements

Implementation file(s): [paste or reference by path]
```

### Quality Gate — Track B
- [ ] Every AC covered by at least one test
- [ ] All 8 interaction states have component test coverage
- [ ] All [VERIFY AGAINST SPEC] items cross-checked
- [ ] No test expects behaviour contradicting the ACs
- [ ] Tests use realistic data — no placeholder strings
- [ ] All tests are independent

---

## Test Type Playbook

### Unit Tests

```
Read CLAUDE.md. Generate unit tests for [function(s)].

Coverage:
  - Happy path with valid representative input
  - Each distinct code path
  - Boundary values: zero, one, maximum, minimum
  - Invalid inputs: null, undefined, empty string, wrong type
  - All error conditions and thrown exceptions

Structure:
  - Group by function name in test group block
  - Test names: "[function] [condition] [expected outcome]"
    Example: "calculateDiscount returns 0 when cart total is below minimum"
  - No shared state between tests
  - No I/O, no external service imports

Function(s): [paste or reference by path]
```

### API Integration Tests

```
Read CLAUDE.md. Generate API integration tests for [endpoint(s)].

For each endpoint, generate tests for:

SUCCESS:
  - 200/201 with valid input and correct response shape
  - Response must NOT contain: [tokens, raw passwords, unexposed fields]

AUTH & PERMISSIONS (test ALL of these):
  - 401: no auth token
  - 401: expired or malformed token
  - 403: authenticated but insufficient role
  - 200/201: minimum permitted role
  - 200/201: higher role (confirm inheritance works)

VALIDATION (one test per required field):
  - 422: missing required field
  - 422: field exceeds maximum length
  - 422: invalid format (email, date, enum value)
  - 400: malformed JSON body

BUSINESS RULES:
  - 409: conflict (duplicate, already-accepted, etc.)
  - 404: resource not found
  - 410: expired resource (tokens, time-limited links)

Setup:
  - Use test database (never production or staging)
  - Create fresh data per test using factories
  - Clean up after each test

Endpoints: [paste API contracts from Phase 1 Stage 5]
```

### E2E Tests (E2E Framework)

```
Read CLAUDE.md. Generate an E2E test for the following user journey.

Requirements:
  - Use Page Object Model (POM) — one class per screen
  - Reference existing POM: [path from CLAUDE.md]
  - Unique test data per run: Date.now() in email addresses
  - Use loginAs(role) helper for auth setup
  - Use data-testid selectors — NEVER CSS class or position selectors
    If data-testid is missing: add comment [ADD data-testid="..."]
  - Use soft assertions for non-critical assertions
  - Test must complete in under 30 seconds
  - Set up data via API calls, not UI steps

After the test:
  - Page Object class for any new screen
  - List of data-testid attributes that need adding to components
  - Any data setup that needs a backend API call

User journey: [paste numbered journey from Phase 2]
```

### Performance Tests (k6)

```
Generate a k6 load test for [endpoint(s)].

For each endpoint:
  - Ramp up from 0 to [target concurrent users from NFRs] over [ramp period]
  - Sustain load for [duration]
  - Use realistic, varied request data (not identical payloads)
  - Measure: p50, p95, p99 response times + error rate

Thresholds (from NFRs — do not invent these):
  - p95 response time < [value from NFR]ms
  - Error rate < [value from NFR]%
  - Defined as k6 thresholds{} so the test fails if NFR is missed

Also generate:
  - A baseline single-user run (to establish non-load baseline)
  - A spike test (jump to 2x target load to test auto-scaling behaviour)

NFRs: [paste from Phase 1]
Endpoints: [paste API contracts]
```

---

## Coverage Gap Analysis

### Prompt C1 — Coverage Gap Analysis

```
You are a senior QA engineer reviewing test coverage.

Analyse the following and identify meaningful gaps — not just uncovered lines,
but untested behaviours.

STEP 1 — LINE COVERAGE GAPS
  List files/functions below 80% line coverage.
  For each: which code paths are not covered?

STEP 2 — BEHAVIOURAL GAPS
  Review existing tests and identify:
  a) Tests that call a function but assert nothing meaningful
  b) Tests that cover only the happy path with no error cases
  c) Tests that mock so aggressively that real behaviour is never exercised
  d) Tests that duplicate each other

STEP 3 — SPEC VS TEST GAPS
  Compare acceptance criteria against test files.
  Flag: [AC-GAP]: [criterion text] — no corresponding test found

STEP 4 — TOP 10 PRIORITY GAPS
  Rank by risk = (likelihood of this path running in production)
                × (severity of failure if it breaks)

STEP 5 — REMEDIATION PLAN
  For each of the top 10:
    Test type | File | Test name | What to assert

Coverage report: [paste output of test coverage command or equivalent]
Test files: [paths or paste]
Acceptance criteria: [paste from Phase 1]
```

**After analysis, fill gaps:**

### Prompt C2 — Fill Coverage Gaps

```
Read CLAUDE.md. Fill the following coverage gaps.

Add tests to EXISTING test files — do not create new files unless
the module has zero test coverage.

Rules:
  - Tests must be meaningful — assert observable behaviour, not implementation
  - New tests must NOT duplicate existing coverage
  - Each new test gets a comment: // COVERS GAP: [gap description]

Gaps to fill: [paste top 10 from gap analysis]
Existing test file paths: [list]
```

---

## Pre-Release Coverage Gate

Before every production release, all of these must pass:

| Layer | Threshold | How to Measure |
|---|---|---|
| Unit (business logic) | 90% line + branch | `[test coverage command] -- --filter=src/features` |
| API endpoints | 100% of endpoints have at least one test | Diff API contract list vs test group blocks |
| Component states | All 8 states per component | Manual check against Phase 2 prototype spec |
| Critical path E2E | All P1 user journeys passing | E2E test suite report |
| Acceptance criteria | 100% of ACs have at least 1 test | AC-to-test traceability matrix |

Any threshold below target **blocks the release** until fixed or explicitly accepted
with a documented reason and a ticket.

---

## Fixing Failing Tests After a Code Change

```
The following tests are failing after a recent code change.

For each failing test, determine:
  A) CORRECTLY FAILING — the code change introduced a regression.
     The code change needs to be fixed, not the test.

  B) NEEDS UPDATING — the change was intentional, the test was testing old behaviour.
     Update the test to reflect the new intended behaviour.

  C) BRITTLE — failing for an incidental reason unrelated to the behaviour being tested
     (wrong selector, timing issue, hardcoded ID).
     Fix the test structure without changing what it asserts.

For each B or C test, provide the updated version.
For each A test, describe what regression was introduced.

Failing tests: [paste test names and failure messages]
Code change summary: [paste PR description or diff summary]
Original behaviour (from spec): [paste relevant acceptance criteria]
```

---

## Fixing Flaky Tests

```
This test is flaky — it passes and fails inconsistently.

Identify the root cause from these common causes:
  - Race condition: asserts before async operation completes
  - Shared state: depends on data from another test
  - Timing: uses fixed delays instead of waiting for a condition
  - Non-deterministic data: uses Date.now() or Math.random() in assertions
  - Test-order dependency: assumes a previous test ran successfully
  - Selector instability: matches multiple elements or is position-dependent

Provide:
  1. Root cause explanation
  2. Fixed test code
  3. Pattern to avoid in future tests

Flaky test: [paste test code]
Failure pattern: [describe when it fails — intermittent, CI only, etc.]
```

---

## Anti-Patterns

| Anti-Pattern | Why It Fails |
|-------------|-------------|
| Testing implementation, not behaviour | Tests break on refactoring even when behaviour unchanged |
| Generating tests after code without verifying | Encodes existing bugs as expected behaviour |
| Over-mocking everything | Tests pass but real integration is never exercised |
| Happy-path-only coverage | 80% line coverage but no error paths tested |
| Using AI without providing spec context | AI invents expected behaviour instead of testing the spec |
| Automating flaky manual cases first | Converts manual instability into automated instability |

---

## Behaviour Rules

- Generate tests from acceptance criteria, not from implementation code
- Every test must assert observable behaviour — not internal state or implementation details
- Use realistic test data: real-looking emails, names, amounts — never "foo" or "test@test.com"
- Every test is independent — passing or failing one does not affect another
- Mock only external I/O — let business logic run for real in tests
- One file per component or service — never one file per test case
- Always request negative tests and boundary values — happy-path-only coverage is dangerous
- After generating tests from code, always flag [VERIFY AGAINST SPEC] items
- The pre-release coverage gate is non-negotiable — never release below threshold without a ticket
- If the feature has `[i18n]` flags, add locale-specific test scenarios: date/time formatting,
  currency display, string length overflow in translated text, and RTL layout if applicable
